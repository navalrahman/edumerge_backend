const express = require('express');
const router = express.Router();
const admissionController = require('../../controller/AdmissionController/AdmissionController');
const requireAuth = require('../../middleware/auth');
const checkRole = require('../../middleware/roleAuth');

router.use(requireAuth);

router.post('/applicant', checkRole(['Admin', 'Admission Officer']), admissionController.createApplicant);
router.get('/applicants', checkRole(['Admin', 'Admission Officer', 'Management']), admissionController.getApplicants);
router.put('/applicant/:id', checkRole(['Admin', 'Admission Officer']), admissionController.updateApplicant);
router.post('/applicant/allocate/:id', checkRole(['Admin', 'Admission Officer']), admissionController.allocateSeat);
router.post('/applicant/confirm/:applicantId', checkRole(['Admin', 'Admission Officer']), admissionController.confirmAdmission);

module.exports = router;
