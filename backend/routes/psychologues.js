const express = require('express');
const {
    getPsychologues,
    getPsychologue,
    getPsychologuePatients,
    getPsychologueCalendar,
    addAvailability,
    updatePsychologue
} = require('../controllers/psychologueController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getPsychologues);
router.get('/:id', auth, getPsychologue);
router.get('/:id/patients', auth, authorize('Psychologue', 'Admin'), getPsychologuePatients);
router.get('/:id/calendar', auth, getPsychologueCalendar);
router.post('/:id/calendar', auth, authorize('Psychologue'), addAvailability);
router.put('/:id', auth, authorize('Psychologue', 'Admin'), updatePsychologue);

module.exports = router;
