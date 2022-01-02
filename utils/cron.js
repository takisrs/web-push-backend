const cron = require('node-cron');
const { __ } = require('i18n');

const Notification = require('../models/notification');
const { sendNotification } = require('../services/notification');
const logger = require('./logger');
const { throwError } = require('./throwError');

const setupCron = () => {
  cron.schedule('*/10 * * * * *', async () => {
    logger.debug('running the task to send notifications');

    const now = new Date();

    const notifications = await Notification.find({
      sentAt: undefined,
      scheduledAt: { $lt: now },
    });

    if (notifications && notifications.length > 0) {
      for (const notification of notifications) {
        sendNotification(notification._id.toString())
          .then((result) => {
            logger.info(result);
            notification.sentAt = now;
            notification.save((err) => {
              if (err) {
                throwError(
                  'Cannot update notification sent date',
                  422,
                  notification
                );
              } else {
                logger.debug(__('Notification marked as sent'));
              }
            });
          })
          .catch((error) => {
            logger.error(error);
          });
      }
    }
  });
};

module.exports = setupCron;
