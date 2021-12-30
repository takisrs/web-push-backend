const express = require('express');
const { check } = require('express-validator');
const { __ } = require('i18n');

const User = require('../models/user');
const authController = require('../controllers/auth');

const router = express.Router();

router.post(
  '/login',
  [check('email').isEmail().normalizeEmail()],
  authController.login
);

router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .normalizeEmail()
      .custom(
        (value) =>
          new Promise((resolve, reject) => {
            User.emailExists(value, function (err, count) {
              if (err) {
                reject(new Error(__('Server Error')));
              }
              if (count > 0) {
                reject(new Error(__('E-mail already in use')));
              }
              resolve(true);
            });
          })
      ),
    check('name').isLength({ min: 5 }),
  ],
  authController.signup
);

module.exports = router;
