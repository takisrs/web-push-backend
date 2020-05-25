const express = require('express');

const router = express.Router();

const subscriptionsController = require('../controllers/subscriptions');

router.get('/', subscriptionsController.getSubscriptions);

router.post('/', subscriptionsController.postSubscription);

module.exports = router;