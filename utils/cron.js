const cron = require('node-cron');
const webpush = require('web-push');
const { __ } = require('i18n');

const Notification = require('../models/notification');
const Subscription = require('../models/subscription');
const User = require('../models/user');
const Log = require('../models/log');
const { sendEmail } = require('../utils/sendEmail');

const config = require('../config/config');

const setupCron = () => {
    cron.schedule('*/10 * * * * *', () => {
        console.log('running the task to send notifications');

        const now = new Date();
        console.log(now);

        Notification.find({sentAt: undefined, scheduledAt: { $lt: now }}).then(notifications => {
            //console.log(notifications);

            if (notifications.length > 0){
                for (const notification of notifications){

                    // get user
                    User.findById(notification.userId).then(user => {
                        //console.log(user);

                        if (!user){
                            const error = new Error(__("Cannot find notification user"));
                            error.statusCode = 422;
                            error.data = notification;
                            throw error;
                        }

                        webpush.setVapidDetails(
                            'mailto:'+user.email,
                            user.vapidKeys.publicKey,
                            user.vapidKeys.privateKey
                        );

                        const options = {
                            //gcmAPIKey: "",
                            timeout: config.WEBPUSH_TIMEOUT,
                            TTL: config.WEBPUSH_TTL,
                            contentEncoding: config.WEBPUSH_ENCODING
                        };
                    
                        let successCounter = 0;
                        Subscription.find({userId: user._id.toString()}).then(async subscriptions => {
                            //console.log(subscriptions);
                            for (const sub of subscriptions){
                                console.log(sub);
                                await webpush.sendNotification(sub, JSON.stringify(notification), options).then(response => {
                                    successCounter++;
                                    console.log(response);
                                    const log = new Log({
                                        subscription: sub,
                                        notification: notification,
                                        response: response
                                    });
                                    return log.save();
                                }).catch(error => {
                                    const log = new Log({
                                        subscription: sub,
                                        notification: notification,
                                        response: error
                                    });
                                    return log.save();
                                });
                            };
                        }).catch(error => {
                            throw error;
                            //next(error);
                        });

                        notification.sentAt = now;
                        notification.save(err => {
                            if (err){
                                const error = new Error(__("Cannot update notification sent date"));
                                error.statusCode = 422;
                                error.data = notification;
                                throw error;
                            } else {
                                console.log(__("Notification sent to %s subscribers!", successCounter));
                                sendEmail(user.email, __("Notification sent"), __("Notification sent to %s subscribers!", successCounter));
                            }
                        });
                    }).catch(err => {
                        //next(err);
                    })
                }

            }

        }).catch(err => {
            //next(err);
        });


    });
}

module.exports = setupCron;