const db = require('../config/database');

// @desc    Get all exercises
// @route   GET /api/exercises
exports.getExercises = async (req, res, next) => {
    try {
        const [exercises] = await db.query(
            'SELECT * FROM exercice ORDER BY id_exercice DESC'
        );

        res.json({ success: true, count: exercises.length, data: exercises });
    } catch (error) {
        next(error);
    }
};

// @desc    Get exercise by ID
// @route   GET /api/exercises/:id
exports.getExercise = async (req, res, next) => {
    try {
        const [exercises] = await db.query(
            'SELECT * FROM exercice WHERE id_exercice = ?',
            [req.params.id]
        );

        if (exercises.length === 0) {
            return res.status(404).json({ message: 'Exercice non trouvé.' });
        }

        res.json({ success: true, data: exercises[0] });
    } catch (error) {
        next(error);
    }
};

// @desc    Create exercise (Psychologue only)
// @route   POST /api/exercises
exports.createExercise = async (req, res, next) => {
    try {
        const { type_exercice, titre, descriptions, objectif, duree_estimee, score_max, difficulte, consignes, ressources } = req.body;

        const [result] = await db.query(
            `INSERT INTO exercice (type_exercice, titre, descriptions, objectif, duree_estimee, score_max, difficulte, consignes, ressources) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [type_exercice, titre, descriptions, objectif, duree_estimee, score_max, difficulte, consignes, ressources]
        );

        res.status(201).json({
            success: true,
            message: 'Exercice créé avec succès.',
            id: result.insertId
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Submit exercise (Patient)
// @route   POST /api/exercises/:id/submit
exports.submitExercise = async (req, res, next) => {
    try {
        const { contenu_reponse, duree_exercice } = req.body;
        const id_exercice = req.params.id;

        // Get patient ID from user email
        const [patients] = await db.query(
            'SELECT id_patient FROM patient WHERE email = ?',
            [req.user.email]
        );

        if (patients.length === 0) {
            return res.status(404).json({ message: 'Patient non trouvé.' });
        }

        const id_patient = patients[0].id_patient;

        // Get exercise type
        const [exercises] = await db.query(
            'SELECT type_exercice FROM exercice WHERE id_exercice = ?',
            [id_exercice]
        );

        const [result] = await db.query(
            `INSERT INTO exercice_realise (id_exercice, id_patient, type_exercice, date_realisation, duree_exercice, contenu_reponse) 
       VALUES (?, ?, ?, CURDATE(), ?, ?)`,
            [id_exercice, id_patient, exercises[0].type_exercice, duree_exercice, contenu_reponse]
        );

        res.status(201).json({
            success: true,
            message: 'Exercice soumis avec succès.',
            id: result.insertId
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Validate exercise (Psychologue)
// @route   PUT /api/exercises/submissions/:id/validate
exports.validateExercise = async (req, res, next) => {
    try {
        const { commentaire_psychologue, note_patient, etat_validation } = req.body;

        await db.query(
            `UPDATE exercice_realise 
       SET commentaire_psychologue = ?, note_patient = ?, etat_validation = ?
       WHERE id_exercice_realise = ?`,
            [commentaire_psychologue, note_patient, etat_validation, req.params.id]
        );

        res.json({ success: true, message: 'Exercice validé avec succès.' });
    } catch (error) {
        next(error);
    }
};
