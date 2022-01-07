const cron = require('node-cron');
const { __ } = require('i18n');

const Notification = require('../models/notification');
const { sendNotification } = require('../services/notification');
const logger = require('./logger');
const ApiError = require('./api-error');

const setupCron = () => {
  cron.schedule('*/10 * * * * *', async () => {
    logger.debug('[NOTIFICATION] running the task to send notifications');

    const notifications = await Notification.findPending();

    if (notifications && notifications.length > 0) {
      for (const notification of notifications) {
        sendNotification(notification._id.toString())
          .then((result) => {
            logger.info(result);
            notification.sentAt = new Date();
            notification.status = 'COMPLETED';
            notification.save((err) => {
              if (err) {
                throw new ApiError(
                  __('Cannot update notification sent date'),
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
