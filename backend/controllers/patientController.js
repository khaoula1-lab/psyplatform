const db = require('../config/database');

// @desc    Get all patients (for psychologue)
// @route   GET /api/patients
exports.getPatients = async (req, res, next) => {
    try {
        const [patients] = await db.query(
            `SELECT id_patient, nom, prenom, email, num_tel, age, sex, situation, 
              etat_civil, date_inscription, photo_profil 
       FROM patient 
       ORDER BY date_inscription DESC`
        );

        res.json({ success: true, count: patients.length, data: patients });
    } catch (error) {
        next(error);
    }
};

// @desc    Get patient by ID
// @route   GET /api/patients/:id
exports.getPatient = async (req, res, next) => {
    try {
        const [patients] = await db.query(
            'SELECT * FROM patient WHERE id_patient = ?',
            [req.params.id]
        );

        if (patients.length === 0) {
            return res.status(404).json({ message: 'Patient non trouvé.' });
        }

        res.json({ success: true, data: patients[0] });
    } catch (error) {
        next(error);
    }
};

// @desc    Get patient's therapy sessions
// @route   GET /api/patients/:id/sessions
exports.getPatientSessions = async (req, res, next) => {
    try {
        const [sessions] = await db.query(
            `SELECT s.*, p.nom as psy_nom, p.prenom as psy_prenom 
       FROM seance_therapie s
       JOIN psychologue p ON s.id_psychologue = p.id_psy
       WHERE s.id_patient = ?
       ORDER BY s.date_seance DESC`,
            [req.params.id]
        );

        res.json({ success: true, count: sessions.length, data: sessions });
    } catch (error) {
        next(error);
    }
};

// @desc    Get patient's exercises
// @route   GET /api/patients/:id/exercises
exports.getPatientExercises = async (req, res, next) => {
    try {
        const [exercises] = await db.query(
            `SELECT er.*, e.titre, e.type_exercice, e.difficulte, e.score_max
       FROM exercice_realise er
       JOIN exercice e ON er.id_exercice = e.id_exercice
       WHERE er.id_patient = ?
       ORDER BY er.date_realisation DESC`,
            [req.params.id]
        );

        res.json({ success: true, count: exercises.length, data: exercises });
    } catch (error) {
        next(error);
    }
};

// @desc    Update patient profile
// @route   PUT /api/patients/:id
exports.updatePatient = async (req, res, next) => {
    try {
        const { nom, prenom, num_tel, adresse, situation, age } = req.body;

        await db.query(
            `UPDATE patient 
       SET nom = ?, prenom = ?, num_tel = ?, adresse = ?, situation = ?, age = ?
       WHERE id_patient = ?`,
            [nom, prenom, num_tel, adresse, situation, age, req.params.id]
        );

        res.json({ success: true, message: 'Profil mis à jour avec succès.' });
    } catch (error) {
        next(error);
    }
};
