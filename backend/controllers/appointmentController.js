const db = require('../config/database');

// @desc    Get all appointments
// @route   GET /api/appointments
exports.getAppointments = async (req, res, next) => {
    try {
        const { role, id_utilisateur } = req.user;

        let query = `
      SELECT r.*, 
             p.nom as patient_nom, p.prenom as patient_prenom,
             psy.nom as psy_nom, psy.prenom as psy_prenom
      FROM rendez_vous r
      JOIN patient p ON r.id_patient = p.id_patient
      JOIN psychologue psy ON r.id_psychologue = psy.id_psy
    `;

        let params = [];

        // Filter based on role
        if (role === 'Patient') {
            const [patients] = await db.query('SELECT id_patient FROM patient WHERE email = ?', [req.user.email]);
            if (patients.length > 0) {
                query += ' WHERE r.id_patient = ?';
                params.push(patients[0].id_patient);
            }
        } else if (role === 'Psychologue') {
            const [psychologues] = await db.query('SELECT id_psy FROM psychologue WHERE email = ?', [req.user.email]);
            if (psychologues.length > 0) {
                query += ' WHERE r.id_psychologue = ?';
                params.push(psychologues[0].id_psy);
            }
        }

        query += ' ORDER BY r.date_rendez_vous DESC, r.heure_debut DESC';

        const [appointments] = await db.query(query, params);

        res.json({ success: true, count: appointments.length, data: appointments });
    } catch (error) {
        next(error);
    }
};

// @desc    Create appointment
// @route   POST /api/appointments
exports.createAppointment = async (req, res, next) => {
    try {
        const { date_rendez_vous, heure_debut, heure_fin, type_rendez_vous, id_psychologue} = req.body;
                const [patients] = await db.query('SELECT id_patient FROM patient WHERE email = ?', [req.user.email]);
        if (patients.length === 0) {
            return res.status(404).json({ message: 'Patient introuvable.' });
        }
        const id_patient = patients[0].id_patient;
        // Check if slot is available
        const [existing] = await db.query(
            `SELECT id_rendez_vous FROM rendez_vous 
       WHERE id_psychologue = ? AND date_rendez_vous = ? 
       AND ((heure_debut <= ? AND heure_fin > ?) OR (heure_debut < ? AND heure_fin >= ?))
       AND statut != 'Annulé'`,
            [id_psychologue, date_rendez_vous, heure_debut, heure_debut, heure_fin, heure_fin]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'Ce créneau n\'est pas disponible.' });
        }

        const [result] = await db.query(
            `INSERT INTO rendez_vous (date_rendez_vous, heure_debut, heure_fin, type_rendez_vous, id_psychologue, id_patient) 
       VALUES (?, ?, ?, ?, ?, ?)`,
            [date_rendez_vous, heure_debut, heure_fin, type_rendez_vous, id_psychologue, id_patient]
        );

        // Update calendar status
        await db.query(
            `UPDATE calendrier 
       SET statut = 'Réservé', id_patient = ? 
       WHERE id_psychologue = ? AND date_disponible = ? AND heure_debut = ?`,
            [id_patient, id_psychologue, date_rendez_vous, heure_debut]
        );

        // Create notification for psychologue
        await db.query(
            `INSERT INTO notification (id_psychologue, titre, message, type_notification) 
       VALUES (?, ?, ?, ?)`,
            [id_psychologue, 'Nouveau rendez-vous', `Nouveau rendez-vous réservé pour le ${date_rendez_vous}`, 'Rendez-vous']
        );

        res.status(201).json({
            success: true,
            message: 'Rendez-vous créé avec succès.',
            id: result.insertId
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
exports.updateAppointment = async (req, res, next) => {
    try {
        const { statut } = req.body;

        await db.query(
            'UPDATE rendez_vous SET statut = ? WHERE id_rendez_vous = ?',
            [statut, req.params.id]
        );

        res.json({ success: true, message: 'Rendez-vous mis à jour.' });
    } catch (error) {
        next(error);
    }
};

// @desc    Cancel appointment
// @route   DELETE /api/appointments/:id
exports.cancelAppointment = async (req, res, next) => {
    try {
        await db.query(
            'UPDATE rendez_vous SET statut = ? WHERE id_rendez_vous = ?',
            ['Annulé', req.params.id]
        );

        res.json({ success: true, message: 'Rendez-vous annulé.' });
    } catch (error) {
        next(error);
    }
};
