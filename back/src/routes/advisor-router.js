const express = require('express');
const router = express.Router();
const authController = require('../controller/advisor-controller');

router.post('/save', authController.save);
router.put('/update', authController.updateAdvisor);
router.get('/getAll', authController.getAllAdvisor);
router.get('/getById/:id_advisor', authController.getAdvisorById);
router.delete('/delete/:id_advisor', authController.deleteAdvisor);

router.get('/count', authController.getTotalAdvisorCount);

module.exports = router