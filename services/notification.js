const { __ } = require('i18n');
const webpush = require('web-push');

const Notification = require('../models/notification');
const Subscription = require('../models/subscription');
const Log = require('../models/log');
const config = require('../config/config');
const logger = require('../utils/logger');
const sendEmail = require('../utils/sendEmail');
const ApiError = require('../utils/api-error');

const NotificationService = {
  sendNotification: async (id) => {
    const notification = await Notification.findOneAndUpdate(
      { _id: id },
      { status: 'IN_PROGRESS' }
    ).populate('user');

    if (!notification) {
      throw new ApiError(__('Cannot find notification'), 422, { id });
    }

    const user = notification.user;

    if (!user) {
      throw new ApiError(__('Cannot find notification user'), 422, user);
    }

    webpush.setVapidDetails(
      'mailto:' + user.email,
      user.vapidKeys.publicKey,
      user.vapidKeys.privateKey
    );

    const subscriptions = await Subscription.find({
      user: user._id.toString(),
    });

    let successCounter = 0;
    for (const subscription of subscriptions) {
      try {
        const notificationResult = await webpush.sendNotification(
          subscription,
          JSON.stringify(notification),
          {
            timeout: config.webpush.timeout,
            TTL: config.webpush.ttl,
            contentEncoding: config.webpush.encoding,
          }
        );

        if (notificationResult) {
          successCounter++;

          const log = new Log({
            subscription,
            notification,
            response: notificationResult,
          });
          const result = await log.save();
          console.log(result);
        }
      } catch (error) {
        logger.debug(error);
      }
    }

    logger.info(__('Notification sent to %s subscribers!', successCounter));
    await sendEmail(
      user.email,
      __('%s // Notification sent', notification.title),
      __('Notification sent to %s subscribers!', successCounter)
    );

    return successCounter;
  },
};

module.exports = NotificationService;
