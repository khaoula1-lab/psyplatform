const express = require('express');
const {
    getAppointments,
    createAppointment,
    updateAppointment,
    cancelAppointment
} = require('../controllers/appointmentController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getAppointments);
router.post('/', auth, createAppointment);
router.put('/:id', auth, updateAppointment);
router.delete('/:id', auth, cancelAppointment);

module.exports = router;
