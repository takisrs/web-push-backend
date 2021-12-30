const webpush = require('web-push');
const { validationResult } = require('express-validator');
const { __ } = require('i18n');

const Subscription = require('../models/subscription');
const Notification = require('../models/notification');
const Log = require('../models/log');

const config = require('../config/config');

const postNotification = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error(__('Validation error occured'));
    error.statusCode = 422;
    error.data = { errors: errors.array() };
    throw error;
  }

  const user = req.user._id.toString();

  const { title } = req.body;
  const { message } = req.body;
  const { icon } = req.body;
  const { image } = req.body;
  const dir = req.body.dir || 'ltr'; // ltr, rtl
  const lang = req.body.lang || 'el-GR'; // BCP 47, en-US
  const { vibrate } = req.body; // [100, 30, 100] vibrate, pause, vibrate
  const silent = req.body.silent || false; // when true, don't use vibrate option (throws a TypeError)
  const { badge } = req.body; // 96X96
  const { tag } = req.body;
  const renotify = req.body.renotify || true; // true, false
  const actions = req.body.actions || []; // [{ action: "confirm", title: "OK", icon: "https://..." }]
  const data = req.body.data || [];

  let scheduledAt = new Date();

  if (req.body.scheduledAt) scheduledAt = req.body.scheduledAt;

  const notification = new Notification({
    user,
    title,
    message,
    icon,
    image,
    dir,
    lang,
    vibrate,
    silent,
    badge,
    tag,
    renotify,
    actions,
    data,
    scheduledAt,
  });

  notification
    .save()
    .then((_result) => {
      res.status(201).json({
        ok: true,
        message: __('Notification created successfully!'),
        data: notification,
      });
    })
    .catch((err) => {
      next(err);
    });
};

const sendNotification = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error(__('Validation error occured'));
    error.statusCode = 422;
    error.data = { errors: errors.array() };
    throw error;
  }

  webpush.setVapidDetails(
    `mailto:${req.user.email}`,
    req.user.vapidKeys.publicKey,
    req.user.vapidKeys.privateKey
  );

  const { title } = req.body;
  const { message } = req.body;
  const { icon } = req.body;
  const { image } = req.body;
  const dir = req.body.dir || 'ltr'; // ltr, rtl
  const lang = req.body.lang || 'el-GR'; // BCP 47, en-US
  const { vibrate } = req.body; // [100, 30, 100] vibrate, pause, vibrate
  const silent = req.body.silent || false; // when true, don't use vibrate option (throws a TypeError)
  const { badge } = req.body; // 96X96
  const { tag } = req.body;
  const renotify = req.body.renotify || true; // true, false
  const actions = req.body.actions || []; // [{ action: "confirm", title: "OK", icon: "https://..." }]
  const data = req.body.data || [];

  const notificationData = {
    title,
    message,
    icon,
    image,
    dir,
    lang,
    vibrate,
    silent,
    badge,
    tag,
    renotify,
    actions,
    data,
  };

  const options = {
    // gcmAPIKey: "",
    timeout: config.webpush.timeout,
    TTL: config.webpush.ttl,
    contentEncoding: config.webpush.encoding,
  };

  let successCounter = 0;
  Subscription.find({ user: req.user._id.toString() })
    .then(async (subscriptions) => {
      for (const sub of subscriptions) {
        await webpush
          .sendNotification(sub, JSON.stringify(notificationData), options)
          .then((result) => result)
          .then((response) => {
            successCounter++;
            const log = new Log({
              subscription: sub,
              notification: notificationData,
              response,
            });
            return log.save();
          })
          .catch((error) => {
            const log = new Log({
              subscription: sub,
              notification: notificationData,
              response: error,
            });
            return log.save();
          });
      }

      return res.status(201).json({
        ok: true,
        message: __(
          'Notification send to %s subscribers!',
          subscriptions.length
        ),
        data: {
          totalSubscriptions: subscriptions.length,
          totalSent: successCounter,
          notification: notificationData,
        },
      });
    })
    .catch((error) => {
      next(error);
    });
};

const getNotifications = (req, res, next) => {
  let filter = {};
  if (req.user) filter = { user: req.user._id.toString() };

  if (req.query.id) filter = { _id: req.query.id, ...filter };

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 3;

  Notification.find(filter)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ addedAt: -1 })
    .then((notifications) => {
      if (notifications.length > 0) {
        Notification.countDocuments(filter).then((count) => {
          res.status(201).json({
            ok: true,
            message: __(
              'Fetched %d notifications of %d total',
              notifications.length,
              count
            ),
            data: {
              totalItems: count,
              currentPage: page,
              totalPages: Math.ceil(count / limit),
              itemsPerPage: limit,
              notifications,
            },
          });
        });
      } else {
        res.status(404).json({
          ok: false,
          message: __('No notifications found'),
          data: notifications,
        });
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  postNotification,
  sendNotification,
  getNotifications,
};
