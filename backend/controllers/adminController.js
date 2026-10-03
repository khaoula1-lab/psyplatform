const db = require('../config/database');

// @desc    Get platform statistics
// @route   GET /api/admin/stats
exports.getStats = async (req, res, next) => {
    try {
        const [patientCount] = await db.query('SELECT COUNT(*) as count FROM patient');
        const [psychologueCount] = await db.query('SELECT COUNT(*) as count FROM psychologue');
        const [appointmentCount] = await db.query('SELECT COUNT(*) as count FROM rendez_vous');
        const [totalRevenue] = await db.query('SELECT SUM(montant) as total FROM paiement WHERE statut = "Payé"');

        const stats = {
            totalPatients: patientCount[0].count,
            totalPsychologues: psychologueCount[0].count,
            totalAppointments: appointmentCount[0].count,
            totalRevenue: totalRevenue[0].total || 0
        };

        res.json({ success: true, data: stats });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
exports.getUsers = async (req, res, next) => {
    try {
        const [users] = await db.query(
            'SELECT id_utilisateur, nom, prenom, email, role, num_tel, date_creation FROM utilisateur ORDER BY date_creation DESC'
        );

        res.json({ success: true, count: users.length, data: users });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all complaints
// @route   GET /api/admin/complaints
exports.getComplaints = async (req, res, next) => {
    try {
        const [complaints] = await db.query(
            `SELECT r.*, p.nom as patient_nom, p.prenom as patient_prenom
       FROM reclamation r
       JOIN patient p ON r.id_patient = p.id_patient
       ORDER BY r.date_creation DESC`
        );

        res.json({ success: true, count: complaints.length, data: complaints });
    } catch (error) {
        next(error);
    }
};

// @desc    Update complaint status
// @route   PUT /api/admin/complaints/:id
exports.updateComplaint = async (req, res, next) => {
    try {
        const { statut } = req.body;

        await db.query(
            'UPDATE reclamation SET statut = ? WHERE id_reclamation = ?',
            [statut, req.params.id]
        );

        res.json({ success: true, message: 'Réclamation mise à jour.' });
    } catch (error) {
        next(error);
    }
};

// @desc    Generate report
// @route   POST /api/admin/reports
exports.generateReport = async (req, res, next) => {
    try {
        const { type_rapport, date_debut_periode, date_fin_periode } = req.body;

        const [result] = await db.query(
            `INSERT INTO rapport_statistique (type_rapport, date_debut_periode, date_fin_periode, genere_par) 
       VALUES (?, ?, ?, ?)`,
            [type_rapport, date_debut_periode, date_fin_periode, req.user.id_utilisateur]
        );

        res.status(201).json({
            success: true,
            message: 'Rapport généré avec succès.',
            id: result.insertId
        });
    } catch (error) {
        next(error);
    }
};
