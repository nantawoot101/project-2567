const express = require('express');
const router = express.Router();
const dowloadController = require('../controller/dowload-controller');

router.get('/getAll', dowloadController.getAll);

// เพิ่มการคลิกให้กับโปรเจค
router.post('/save', dowloadController.incrementDownload);

// ดึงข้อมูลวิวทั้งหมดของโปรเจค
router.get('/getById/:id_doc', dowloadController.getDownloadCount);

module.exports = router;