const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const webpush = require('web-push');
const { __ } = require('i18n');

const config = require('../config/config');
const User = require('../models/user');
const asyncMiddleware = require('../middleware/async');
const { throwError } = require('../utils/throwError');

const login = asyncMiddleware(async (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throwError('Validation error occured', 422, { errors: errors.array() });
  }

  const user = await User.findOne({ email });

  if (!user) {
    throwError('A user with this email could not be found', 401, { email });
  }

  if (!user.active) {
    throwError('User is not active', 401, { userId: user._id.toString() });
  }

  const isPasswordEqual = await bcrypt.compare(password, user.password);

  if (!isPasswordEqual) {
    throwError('Wrong password!', 401);
  }

  const token = jwt.sign(
    { email: user.email, userId: user._id.toString() },
    config.jwt.secret,
    { expiresIn: config.jwt.expires }
  );

  res.status(200).json({
    ok: true,
    message: __('Login ok'),
    data: {
      userId: user._id.toString(),
      userEmail: user.email,
      website: user.website,
      token,
      vapidPublicKey: user.vapidKeys.publicKey,
    },
  });
});

const signup = asyncMiddleware(async (req, res, next) => {
  const { name, email, password, website = '' } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throwError('Validation error occured', 422, { errors: errors.array() });
  }

  const vapidKeys = webpush.generateVAPIDKeys();

  const hashedPassword = await bcrypt.hash(password, 12);
  if (hashedPassword) {
    const user = new User({
      name,
      email,
      website,
      vapidKeys,
      active: false,
      password: hashedPassword,
    });

    const userSaved = await user.save();
    if (userSaved) {
      res.status(201).json({
        ok: true,
        message: __('Account created!'),
        data: {
          userId: user._id.toString(),
          email: user.email,
          vapidPublicKey: user.vapidKeys.publicKey,
        },
      });
    }
  }
});

module.exports = {
  login,
  signup,
};
