const express = require('express');

const router = express.Router();

const subscriptionsController = require('../controllers/subscriptions');

router.post('/add', subscriptionsController.postSubscription);

module.exports = router;