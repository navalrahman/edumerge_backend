const express = require('express');
const router = express.Router();
const programController = require('../../controller/ProgramController/ProgramController');
const requireAuth = require('../../middleware/auth');
const checkRole = require('../../middleware/roleAuth');

router.use(requireAuth);

router.post('/program', checkRole(['Admin']), programController.createProgram);
router.post('/programs', checkRole(['Admin']), programController.createProgram); 
router.put('/program/:id', checkRole(['Admin']), programController.updateProgram); 
router.get('/programs', programController.getPrograms);

module.exports = router;
