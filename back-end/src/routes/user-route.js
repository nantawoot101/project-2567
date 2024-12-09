const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const authenticate = require('../middlewares/authenticate');

router.get('/', userController.getUsers);
router.get('/:id', authenticate,userController.getUserById); // เพิ่มเส้นทางสำหรับดึงข้อมูลผู้ใช้ById
router.put('/:id', authenticate, userController.updateUser); // เพิ่ม middleware authenticate
router.delete('/:id', userController.deleteUser); // เพิ่ม middleware authenticate


module.exports = router;