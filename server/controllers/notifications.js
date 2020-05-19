const webpush = require('web-push');
const config = require("../config.json");

const subscription = require("../models/subscription");

webpush.setVapidDetails(
  'mailto:'+config.email,
  config.vapidPublicKey,
  config.vapidPrivateKey
);


exports.sendNotification = (req, res, next) => {
    const title = req.body.title;
    const message = req.body.message;

    subscription.find().then(subscriptions => {
        subscriptions.forEach(sub => {
            webpush.sendNotification(sub, JSON.stringify({title: title, message: message})).then(result => {
                console.log(result);
                res.status(201).json({
                    message: 'Notification send to '+ subscriptions.length +' subscribers!',
                    data: {title, message}
                });
            }).catch(err => {
                throw err;
            });
        })
    });
};