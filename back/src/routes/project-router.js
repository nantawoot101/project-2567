const express = require('express');
const projectController = require('../controller/project-controller');

const router = express.Router();

// Route สำหรับสร้าง Project ใหม่
router.post('/save', projectController.newProject);
router.post('/saveAdmin', projectController.newProjectAdmin);

// Route สำหรับค้นหาข้อมูล Project ทั้งหมด
router.get('/getAll', projectController.getAllProjects);

// Route สำหรับแสดงข้อมูล Project โดยใช้ id_project
router.get('/getById/:id_project', projectController.getProjectById);

router.get('/member/:member_id', projectController.getProjectsByMemberId);

router.delete('/delete/:id_project', projectController.deleteProject);

router.put('/update', projectController.updateProject);

router.get('/report/type', projectController.generateProjectReportByType);


//api ใน dash-borad
router.get('/project-count', projectController.getTotalProjectCount);
router.get('/project-type-counts', projectController.getProjectTypeCounts);
router.get('/project-year-counts', projectController.getProjectCountsByYear);


module.exports = router;
