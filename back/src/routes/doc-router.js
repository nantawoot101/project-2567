const express = require('express');
const router = express.Router();
const docController = require('../controller/doc-controller');

router.post('/save', docController.newDoc);
router.get('/getById/:id_project', docController.getDocsByProjectId);
router.get('/getAll', docController.getAllDocs);
// Route สำหรับอัปเดตไฟล์
router.put('/update', docController.updateDoc);
router.get('/download/:filename', docController.downloadDoc);

module.exports = router