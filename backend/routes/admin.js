const express = require('express');
const {
    getStats,
    getUsers,
    getComplaints,
    updateComplaint,
    generateReport
} = require('../controllers/adminController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes protected by Admin role
router.get('/stats', auth, authorize('Admin'), getStats);
router.get('/users', auth, authorize('Admin'), getUsers);
router.get('/complaints', auth, authorize('Admin'), getComplaints);
router.put('/complaints/:id', auth, authorize('Admin'), updateComplaint);
router.post('/reports', auth, authorize('Admin'), generateReport);

module.exports = router;
