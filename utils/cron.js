const cron = require('node-cron');
const webpush = require('web-push');
const { __ } = require('i18n');

const Notification = require('../models/notification');
const Subscription = require('../models/subscription');
const User = require('../models/user');
const Log = require('../models/log');
const sendEmail = require('../utils/sendEmail');
const logger = require('./logger');
const config = require('../config/config');
const NotificationService = require('../services/notification');

const setupCron = () => {
  cron.schedule('*/10 * * * * *', () => {
    logger.debug('running the task to send notifications');

    NotificationService.sendNotification('60259fc058893961e6681eca');

    const now = new Date();

    Notification.find({ sentAt: undefined, scheduledAt: { $lt: now } })
      .then((notifications) => {
        if (notifications.length > 0) {
          for (const notification of notifications) {
            // get user
            User.findById(notification.user)
              .then((user) => {
                if (!user) {
                  const error = new Error(__('Cannot find notification user'));
                  error.statusCode = 422;
                  error.data = notification;
                  throw error;
                }

                webpush.setVapidDetails(
                  'mailto:' + user.email,
                  user.vapidKeys.publicKey,
                  user.vapidKeys.privateKey
                );

                const options = {
                  //gcmAPIKey: "",
                  timeout: config.webpush.timeout,
                  TTL: config.webpush.ttl,
                  contentEncoding: config.webpush.encoding,
                };

                let successCounter = 0;
                Subscription.find({ user: user._id.toString() })
                  .then(async (subscriptions) => {
                    for (const sub of subscriptions) {
                      await webpush
                        .sendNotification(
                          sub,
                          JSON.stringify(notification),
                          options
                        )
                        .then((response) => {
                          successCounter++;
                          const log = new Log({
                            subscription: sub,
                            notification: notification,
                            response: response,
                          });
                          log.save();
                        })
                        .catch((error) => {
                          const log = new Log({
                            subscription: sub,
                            notification: notification,
                            response: error,
                          });
                          log.save();
                        });
                    }
                    return successCounter;
                  })
                  .then((totalSent) => {
                    notification.sentAt = now;
                    notification.save((err) => {
                      if (err) {
                        const error = new Error(
                          __('Cannot update notification sent date')
                        );
                        error.statusCode = 422;
                        error.data = notification;
                        throw error;
                      } else {
                        console.log(
                          __('Notification sent to %s subscribers!', totalSent)
                        );
                        sendEmail(
                          user.email,
                          __('%s // Notification sent', notification.title),
                          __('Notification sent to %s subscribers!', totalSent)
                        );
                      }
                    });
                  })
                  .catch((error) => {
                    throw error;
                  });
              })
              .catch((error) => {
                throw error;
              });
          }
        }
      })
      .catch((error) => {
        throw error;
      });
  });
};

module.exports = setupCron;
