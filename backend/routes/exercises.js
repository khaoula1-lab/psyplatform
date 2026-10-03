const express = require('express');
const {
    getExercises,
    getExercise,
    createExercise,
    submitExercise,
    validateExercise
} = require('../controllers/exerciseController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getExercises);
router.get('/:id', auth, getExercise);
router.post('/', auth, authorize('Psychologue', 'Admin'), createExercise);
router.post('/:id/submit', auth, authorize('Patient'), submitExercise);
router.put('/submissions/:id/validate', auth, authorize('Psychologue'), validateExercise);

module.exports = router;
