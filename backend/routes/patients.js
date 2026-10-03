const express = require('express');
const {
    getPatients,
    getPatient,
    getPatientSessions,
    getPatientExercises,
    updatePatient
} = require('../controllers/patientController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, authorize('Psychologue', 'Admin'), getPatients);
router.get('/:id', auth, getPatient);
router.get('/:id/sessions', auth, getPatientSessions);
router.get('/:id/exercises', auth, getPatientExercises);
router.put('/:id', auth, authorize('Patient', 'Admin'), updatePatient);

module.exports = router;
