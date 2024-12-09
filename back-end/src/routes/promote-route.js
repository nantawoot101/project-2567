const express = require('express');
const router = express.Router();
const promoteController = require('../controllers/promote-controller');




// หน้าแสดงรายการโปรโมท
router.get('/', promoteController.getAllpromote);


// หน้าแสดงรายละเอียดหนังสือเฉพาะเล่ม
router.get('/:id', promoteController.getPromoteId);

//หน้าเพิ่มการโปรโมท
router.post('/add', promoteController.addpromote);

// หน้าลบการโปรโมท
router.delete('/:id', promoteController.deletePromote);

module.exports = router;

