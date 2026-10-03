const db = require('../config/database');

// @desc    Get conversations
// @route   GET /api/messages/conversations
exports.getConversations = async (req, res, next) => {
    try {
        const userId = req.user.id_utilisateur;

        const [conversations] = await db.query(
            `SELECT DISTINCT 
         CASE 
           WHEN m.id_expediteur = ? THEN m.id_recepteur 
           ELSE m.id_expediteur 
         END as user_id,
         u.nom, u.prenom, u.role,
         (SELECT contenu FROM message 
          WHERE (id_expediteur = ? AND id_recepteur = user_id) 
             OR (id_expediteur = user_id AND id_recepteur = ?)
          ORDER BY date_envoi DESC LIMIT 1) as dernier_message,
         (SELECT date_envoi FROM message 
          WHERE (id_expediteur = ? AND id_recepteur = user_id) 
             OR (id_expediteur = user_id AND id_recepteur = ?)
          ORDER BY date_envoi DESC LIMIT 1) as derniere_date
       FROM message m
       JOIN utilisateur u ON u.id_utilisateur = CASE 
         WHEN m.id_expediteur = ? THEN m.id_recepteur 
         ELSE m.id_expediteur 
       END
       WHERE m.id_expediteur = ? OR m.id_recepteur = ?
       ORDER BY derniere_date DESC`,
            [userId, userId, userId, userId, userId, userId, userId, userId]
        );

        res.json({ success: true, count: conversations.length, data: conversations });
    } catch (error) {
        next(error);
    }
};

// @desc    Get messages with user
// @route   GET /api/messages/:userId
exports.getMessages = async (req, res, next) => {
    try {
        const currentUserId = req.user.id_utilisateur;
        const otherUserId = req.params.userId;

        const [messages] = await db.query(
            `SELECT m.*, 
         u1.nom as exp_nom, u1.prenom as exp_prenom,
         u2.nom as rec_nom, u2.prenom as rec_prenom
       FROM message m
       JOIN utilisateur u1 ON m.id_expediteur = u1.id_utilisateur
       JOIN utilisateur u2 ON m.id_recepteur = u2.id_utilisateur
       WHERE (m.id_expediteur = ? AND m.id_recepteur = ?) 
          OR (m.id_expediteur = ? AND m.id_recepteur = ?)
       ORDER BY m.date_envoi ASC`,
            [currentUserId, otherUserId, otherUserId, currentUserId]
        );

        // Mark as read
        await db.query(
            `UPDATE message SET statut = 'Lu' 
       WHERE id_expediteur = ? AND id_recepteur = ? AND statut = 'Envoyé'`,
            [otherUserId, currentUserId]
        );

        res.json({ success: true, count: messages.length, data: messages });
    } catch (error) {
        next(error);
    }
};

// @desc    Send message
// @route   POST /api/messages
exports.sendMessage = async (req, res, next) => {
    try {
        const { id_recepteur, contenu } = req.body;
        const id_expediteur = req.user.id_utilisateur;

        const [result] = await db.query(
            'INSERT INTO message (id_expediteur, id_recepteur, contenu) VALUES (?, ?, ?)',
            [id_expediteur, id_recepteur, contenu]
        );

        // Create notification
        await db.query(
            `INSERT INTO notification (id_patient, id_psychologue, titre, message, type_notification) 
       VALUES (?, ?, ?, ?, ?)`,
            [id_recepteur, null, 'Nouveau message', `Vous avez reçu un nouveau message`, 'Message']
        );

        res.status(201).json({
            success: true,
            message: 'Message envoyé.',
            id: result.insertId
        });
    } catch (error) {
        next(error);
    }
};
