const Notification = require("../models/notification");

const NotificationService = {

    sendNotification: (id) => {

        Notification.findOne({ _id: id }).populate('user').then(notification => {
            console.log(notification);
        }).catch(err => {
            throw err;
        });
                    // get user
                    /*
                    User.findById(notification.user).then(user => {
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
                            timeout: config.webpush.timeout,
                            TTL: config.webpush.ttl,
                            contentEncoding: config.webpush.encoding
                        };
                    
                        let successCounter = 0;
                        Subscription.find({user: user._id.toString()}).then(async subscriptions => {
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
                                    log.save();
                                }).catch(error => {
                                    const log = new Log({
                                        subscription: sub,
                                        notification: notification,
                                        response: error
                                    });
                                    log.save();
                                });
                            };
                            return successCounter;
                        }).then(totalSent => {
                            notification.sentAt = now;
                            notification.save(err => {
                                if (err){
                                    const error = new Error(__("Cannot update notification sent date"));
                                    error.statusCode = 422;
                                    error.data = notification;
                                    throw error;
                                } else {
                                    console.log(__("Notification sent to %s subscribers!", totalSent));
                                    sendEmail(user.email, __("%s // Notification sent", notification.title), __("Notification sent to %s subscribers!", totalSent));
                                }
                            });
                        }).catch(error => {
                            throw error;
                        });


                    }).catch(err => {
                        throw error;
                    })
                    */
    }
}

module.exports = NotificationService;