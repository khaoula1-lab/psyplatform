const db = require('../config/database');

// @desc    Get all psychologues
// @route   GET /api/psychologues
exports.getPsychologues = async (req, res, next) => {
    try {
        const [psychologues] = await db.query(
            `SELECT id_psy, nom, prenom, email, telephone, adresse, num_licence, 
              experience, biographie, prix_consultation, photo_profil, date_creation_compte
       FROM psychologue 
       ORDER BY date_creation_compte DESC`
        );

        res.json({ success: true, count: psychologues.length, data: psychologues });
    } catch (error) {
        next(error);
    }
};

// @desc    Get psychologue by ID
// @route   GET /api/psychologues/:id
exports.getPsychologue = async (req, res, next) => {
    try {
        const [psychologues] = await db.query(
            'SELECT * FROM psychologue WHERE id_psy = ?',
            [req.params.id]
        );

        if (psychologues.length === 0) {
            return res.status(404).json({ message: 'Psychologue non trouvé.' });
        }

        res.json({ success: true, data: psychologues[0] });
    } catch (error) {
        next(error);
    }
};

// @desc    Get connected psychologue's patients
// @route   GET /api/psychologues/me/patients
exports.getPsychologuePatients = async (req, res, next) => {
    try {
        const [psychologues] = await db.query('SELECT id_psy FROM psychologue WHERE email = ?', [req.user.email]);
        if (psychologues.length === 0) {
            return res.status(404).json({ message: 'Psychologue introuvable.' });
        }
        const id_psy = psychologues[0].id_psy;

        const [patients] = await db.query(
            `SELECT DISTINCT p.* 
       FROM patient p
       JOIN rendez_vous r ON p.id_patient = r.id_patient
       WHERE r.id_psychologue = ?
       ORDER BY p.nom, p.prenom`,
            [id_psy]
        );

        res.json({ success: true, count: patients.length, data: patients });
    } catch (error) {
        next(error);
    }
};
// @desc    Get psychologue's calendar
// @route   GET /api/psychologues/:id/calendar
exports.getPsychologueCalendar = async (req, res, next) => {
    try {
        const [calendar] = await db.query(
            `SELECT c.*, p.nom as patient_nom, p.prenom as patient_prenom
       FROM calendrier c
       LEFT JOIN patient p ON c.id_patient = p.id_patient
       WHERE c.id_psychologue = ?
       ORDER BY c.date_disponible, c.heure_debut`,
            [req.params.id]
        );

        res.json({ success: true, count: calendar.length, data: calendar });
    } catch (error) {
        next(error);
    }
};

// @desc    Add availability to calendar
// @route   POST /api/psychologues/:id/calendar
exports.addAvailability = async (req, res, next) => {
    try {
        const { date_disponible, heure_debut, heure_fin } = req.body;

        const [result] = await db.query(
            `INSERT INTO calendrier (date_disponible, heure_debut, heure_fin, statut, id_psychologue) 
       VALUES (?, ?, ?, 'Disponible', ?)`,
            [date_disponible, heure_debut, heure_fin, req.params.id]
        );

        res.status(201).json({
            success: true,
            message: 'Disponibilité ajoutée.',
            id: result.insertId
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update psychologue profile
// @route   PUT /api/psychologues/:id
exports.updatePsychologue = async (req, res, next) => {
    try {
        const { nom, prenom, telephone, adresse, experience, biographie, prix_consultation } = req.body;

        await db.query(
            `UPDATE psychologue 
       SET nom = ?, prenom = ?, telephone = ?, adresse = ?, 
           experience = ?, biographie = ?, prix_consultation = ?
       WHERE id_psy = ?`,
            [nom, prenom, telephone, adresse, experience, biographie, prix_consultation, req.params.id]
        );

        res.json({ success: true, message: 'Profil mis à jour avec succès.' });
    } catch (error) {
        next(error);
    }
};
