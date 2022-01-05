const express = require('express');
const { check } = require('express-validator');

const isAuth = require('../middleware/is-auth');
const subscriptionsController = require('../controllers/subscriptions');
const { isValidMongoId } = require('../utils/validation');

const router = express.Router();

router.get('/', isAuth, subscriptionsController.getSubscriptions);

router.post(
  '/',
  [check('userId').custom(isValidMongoId)],
  subscriptionsController.postSubscription
);

module.exports = router;
