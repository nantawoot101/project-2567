const express = require('express');
const router = express.Router();
const Contact = require('../controllers/contact-controller');

router.post('/', Contact.sendEmail);






module.exports = router;