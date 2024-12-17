const express = require('express');
const router = express.Router();
const authController = require('../controller/expert-controller');

router.post('/save', authController.save);
router.put('/update', authController.updateExpert);
router.get('/getAll', authController.getAllExpert);
router.get('/getById/:id_expert', authController.getExpertById);
router.delete('/delete/:id_expert', authController.deleteExpert);

router.get('/count', authController.getTotalExpertCount);

module.exports = router