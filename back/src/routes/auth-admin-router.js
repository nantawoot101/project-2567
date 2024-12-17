const express = require('express');
const router = express.Router();
const authController = require('../controller/auth-admin-controller');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.put('/update', authController.updateProfile);
router.put('/password', authController.changePassword);
router.get('/getAll', authController.getAllAdmin);
router.get('/getAllById/:admin_id', authController.getAdminById);

module.exports = router