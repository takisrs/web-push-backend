const express = require('express');
const mongoose = require('mongoose');
const { __ } = require('i18n');
const { check } = require('express-validator');

const isAuth = require('../middleware/is-auth');
const subscriptionsController = require('../controllers/subscriptions');

const router = express.Router();

router.get('/', isAuth, subscriptionsController.getSubscriptions);

router.post(
  '/',
  [
    check('userId').custom(
      (value) =>
        new Promise((resolve, reject) => {
          const isValid = mongoose.Types.ObjectId.isValid(value);
          if (!isValid) {
            reject(new Error(__('The provided id is not a valid one')));
          }
          resolve(true);
        })
    ),
  ],
  subscriptionsController.postSubscription
);

module.exports = router;
