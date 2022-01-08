const express = require('express');
const { check, oneOf } = require('express-validator');
const { __ } = require('i18n');

const isAuth = require('../middleware/is-auth');
const notificationsController = require('../controllers/notifications');
const { isValidMongoId } = require('../utils/validation');

const router = express.Router();

router.get('/', isAuth, notificationsController.getNotifications);

router.get(
  '/:id',
  [check('id').custom(isValidMongoId)],
  isAuth,
  notificationsController.getNotification
);

router.put(
  '/:id',
  [check('id').custom(isValidMongoId)],
  isAuth,
  notificationsController.putNotification
);

router.delete(
  '/:id',
  isAuth,
  [check('id').custom(isValidMongoId)],
  notificationsController.deleteNotification
);

router.copy(
  '/:id',
  isAuth,
  [check('id').custom(isValidMongoId)],
  notificationsController.copyNotification
);

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
          .isISO8601()
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
  [check('id').custom(isValidMongoId)],
  notificationsController.sendNotification
);

module.exports = router;
