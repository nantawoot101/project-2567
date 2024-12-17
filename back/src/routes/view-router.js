const express = require('express');
const router = express.Router();
const viewController = require('../controller/view-controller');

// เพิ่มการคลิกให้กับโปรเจค
router.post('/save', viewController.addView);

// ดึงข้อมูลวิวทั้งหมดของโปรเจค
router.get('/project/:id_project', viewController.getViewsByProject);

module.exports = router;