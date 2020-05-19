const express = require('express');

const router = express.Router();

const notificationsController = require('../controllers/notifications');

router.post('/send', notificationsController.sendNotification);

module.exports = router;