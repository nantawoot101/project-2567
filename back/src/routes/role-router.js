const express = require('express');
const router = express.Router();
const role = require('../controller/role-controller');

router.get('/getAll', role.getAllRole);


module.exports = router