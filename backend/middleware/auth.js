const jwt = require('jsonwebtoken');
const db = require('../config/database');

const auth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'Accès non autorisé. Token manquant.' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from database
        const [users] = await db.query(
            'SELECT id_utilisateur, nom, prenom, email, role FROM utilisateur WHERE id_utilisateur = ?',
            [decoded.id]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: 'Utilisateur non trouvé.' });
        }

        // Attach user to request
        req.user = users[0];
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token invalide ou expiré.' });
    }
};

// Role-based middleware
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Non authentifié.' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Accès refusé. Rôle requis: ${roles.join(' ou ')}`
            });
        }

        next();
    };
};

module.exports = { auth, authorize };
