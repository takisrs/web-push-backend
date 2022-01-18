const express = require('express');
const { check } = require('express-validator');
const { __ } = require('i18n');

const isAuth = require('../middleware/is-auth');
const subscriptionsController = require('../controllers/subscriptions');
const { isValidMongoId } = require('../utils/validation');
const Subscription = require('../models/subscription');

const router = express.Router();

router.get('/', isAuth, subscriptionsController.getSubscriptions);

router.post(
  '/',
  [
    check('userId').custom(isValidMongoId),
    check('subscription.endpoint').custom(
      (value) =>
        new Promise((resolve, reject) => {
          Subscription.endpointExists(value, function (err, count) {
            if (err) {
              reject(new Error(__('Server Error')));
            }
            if (count > 0) {
              reject(new Error(__('Subscription already in use')));
            }
            resolve(true);
          });
        })
    ),
  ],
  subscriptionsController.postSubscription
);

module.exports = router;
