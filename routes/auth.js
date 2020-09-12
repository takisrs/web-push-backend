const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const authController = require('../controllers/auth');

router.post('/login', [
    check('email').isEmail().normalizeEmail()
], authController.login);

router.post('/signup', [
    check('email').isEmail().normalizeEmail(),
    check('name').isLength({ min: 5 })
], authController.signup);

module.exports = router;