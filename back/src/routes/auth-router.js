const express = require('express');
const router = express.Router();
const authController = require('../controller/auth-controller');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.put('/update', authController.updateProfile);
router.put('/password', authController.changePassword);
router.get('/getAll', authController.getAllMember);
router.get('/getAllById/:member_id', authController.getMemberById);
router.delete('/delete/:member_id', authController.deleteMember);


//api ที่ยิงไปยัง dashboard
router.get('/registration-stats', authController.getDailyRegistrationStats);
router.get('/student-count', authController.getStudentCount);
router.get('/teacher-count', authController.getTeacherCount);
router.get('/registration-counts', authController.getDailyRegistrationStatsByRole);

module.exports = router