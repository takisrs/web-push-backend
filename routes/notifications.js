const express = require('express');
const { check } = require('express-validator');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

const notificationsController = require('../controllers/notifications');

router.post('/send', isAuth, [
    check('title').isLength({ min: 5 }),
    check('message').isLength({min: 10 })
], notificationsController.sendNotification);

module.exports = router;