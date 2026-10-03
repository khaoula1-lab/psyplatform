const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Generate JWT Token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res, next) => {
    try {
        const { nom, prenom, email, mot_de_passe, role, num_tel, CIN, adresse } = req.body;

        // Validate required fields
        if (!nom || !prenom || !email || !mot_de_passe || !role) {
            return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis.' });
        }

        // Check if user exists
        const [existingUsers] = await db.query(
            'SELECT id_utilisateur FROM utilisateur WHERE email = ? OR CIN = ?',
            [email, CIN]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Cet email ou CIN existe déjà.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

        // Insert user
        const [result] = await db.query(
            `INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, role, num_tel, CIN, adresse) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [nom, prenom, email, hashedPassword, role, num_tel, CIN, adresse]
        );

        const userId = result.insertId;

        // Create corresponding patient or psychologue record
        if (role === 'Patient') {
            await db.query(
                `INSERT INTO patient (nom, prenom, email, num_tel, adresse) VALUES (?, ?, ?, ?, ?)`,
                [nom, prenom, email, num_tel, adresse]
            );
        } else if (role === 'Psychologue') {
            await db.query(
                `INSERT INTO psychologue (nom, prenom, email, telephone, adresse) VALUES (?, ?, ?, ?, ?)`,
                [nom, prenom, email, num_tel, adresse]
            );
        }

        // Generate token
        const token = generateToken(userId, role);

        res.status(201).json({
            success: true,
            token,
            user: { id: userId, nom, prenom, email, role }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
    try {
        const { email, mot_de_passe } = req.body;

        // Validate
        if (!email || !mot_de_passe) {
            return res.status(400).json({ message: 'Email et mot de passe requis.' });
        }

        // Get user
        const [users] = await db.query(
            'SELECT id_utilisateur, nom, prenom, email, mot_de_passe, role FROM utilisateur WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
        }

        const user = users[0];

        // Check password - Support both hashed and plain text passwords
        let isMatch = false;

        // First, try bcrypt comparison (for new accounts)
        try {
            isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
        } catch (error) {
            // If bcrypt fails, it's probably a plain text password
            isMatch = false;
        }

        // If bcrypt doesn't match, try plain text comparison (for existing accounts)
        if (!isMatch) {
            isMatch = (mot_de_passe === user.mot_de_passe);
        }

        if (!isMatch) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
        }

        // Generate token
        const token = generateToken(user.id_utilisateur, user.role);

        // Log activity - Convert role to match database constraint
        const typeUtilisateur = user.role === 'Admin' ? 'Administrateur' : user.role;

        await db.query(
            `INSERT INTO historique_activite (id_utilisateur, type_utilisateur, description_activite, resultat) 
       VALUES (?, ?, ?, ?)`,
            [user.id_utilisateur, typeUtilisateur, 'Connexion à la plateforme', 'Succès']
        );

        res.json({
            success: true,
            token,
            user: {
                id: user.id_utilisateur,
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
exports.getMe = async (req, res, next) => {
    try {
        const [users] = await db.query(
            'SELECT id_utilisateur, nom, prenom, email, role, num_tel, adresse FROM utilisateur WHERE id_utilisateur = ?',
            [req.user.id_utilisateur]
        );

        res.json({ success: true, user: users[0] });
    } catch (error) {
        next(error);
    }
};
