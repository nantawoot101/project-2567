const express = require('express');
const router = express.Router();
const authController = require('../controller/creator-controller');

router.post('/save', authController.save);
router.put('/update', authController.update);
router.get('/getAll', authController.getAllCreator);
router.get('/product/:id_product', authController.getCreatorByProductId);
router.get('/getAllById/:id', authController.getCreatorById);

module.exports = router