const express = require('express');
const router = express.Router();
const authController = require('../controller/chairman-controller');

router.post('/save', authController.save);
router.put('/update', authController.updateChairman);
router.get('/getAll', authController.getAllChairman);
router.get('/getById/:id_chairman', authController.getChairmanById);
router.delete('/delete/:id_chairman', authController.deleteChairman);

router.get('/count', authController.getTotalChairmanCount);

module.exports = router