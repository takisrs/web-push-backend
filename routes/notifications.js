const express = require('express');
const { check, oneOf } = require('express-validator');
const mongoose = require('mongoose');
const { __ } = require('i18n');

const isAuth = require('../middleware/is-auth');
const notificationsController = require('../controllers/notifications');

const router = express.Router();

router.get('/', isAuth, notificationsController.getNotifications);

router.post(
  '/',
  isAuth,
  [
    check('title')
      .isLength({ min: 5 })
      .withMessage(
        __('Title is required with a mimimun length of 5 characters')
      ),
    check('message')
      .isLength({ min: 10 })
      .withMessage(
        __('Message is required with a mimimun length of 10 characters')
      ),
    oneOf(
      [
        check('scheduledAt')
          .isEmpty()
          .withMessage(__('scheduledAt field shound be empty')),
        check('scheduledAt')
          .isDate()
          .withMessage(__('scheduledAt field shound be a valid date')),
      ],
      __(
        'Please provide a valid date or empty value to schedule for immediate sending'
      )
    ),
  ],
  notificationsController.postNotification
);

router.post(
  '/send',
  isAuth,
  [
    check('id').custom(
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
  notificationsController.sendNotification
);

module.exports = router;
