const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const authController = require('../controllers/auth');

router.post('/login', authController.login);

router.post('/signup', [
    check('email').isEmail(),
    check('name').isLength({ min: 5 })
], authController.signup);

module.exports = router;