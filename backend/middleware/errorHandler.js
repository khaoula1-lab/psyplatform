const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Default error
    let error = { ...err };
    error.message = err.message;

    // MySQL duplicate key error
    if (err.code === 'ER_DUP_ENTRY') {
        error.message = 'Cette valeur existe déjà dans la base de données.';
        return res.status(400).json({ message: error.message });
    }

    // MySQL foreign key constraint error
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        error.message = 'Référence invalide. L\'élément référencé n\'existe pas.';
        return res.status(400).json({ message: error.message });
    }

    // MySQL validation error
    if (err.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
        error.message = 'Données invalides. Vérifiez les contraintes.';
        return res.status(400).json({ message: error.message });
    }

    res.status(err.statusCode || 500).json({
        message: error.message || 'Erreur serveur interne',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;
