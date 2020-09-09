const express = require('express');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

const subscriptionsController = require('../controllers/subscriptions');

router.get('/', isAuth, subscriptionsController.getSubscriptions);

router.post('/', isAuth, subscriptionsController.postSubscription);

module.exports = router;