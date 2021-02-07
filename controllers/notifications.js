const webpush = require('web-push');
const { validationResult } = require('express-validator');
const { __ } = require('i18n');

const Subscription = require("../models/subscription");
const Notification = require("../models/notification");
const Log = require("../models/log");

exports.postNotification = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error(__("Validation error occured"));
        error.statusCode = 422;
        error.data = { errors: errors.array() };
        throw error;
    }

    const userId = req.user._id.toString();

    const title = req.body.title;
    const message = req.body.message;
    const icon = req.body.icon;
    const image = req.body.image;
    const dir = req.body.dir || "ltr"; // ltr, rtl
    const lang = req.body.lang || "el-GR"; //BCP 47, en-US
    const vibrate = req.body.vibrate; // [100, 30, 100] vibrate, pause, vibrate
    const silent = req.body.silent || false; // when true, don't use vibrate option (throws a TypeError)
    const badge = req.body.badge; // 96X96
    const tag = req.body.tag;
    const renotify = req.body.renotify || true; // true, false
    const actions = req.body.actions || []; // [{ action: "confirm", title: "OK", icon: "https://..." }]
    const data = req.body.data || [];

    let scheduledAt = new Date();

    if (req.body.scheduledAt)
        scheduledAt = req.body.scheduledAt;
    
    const notification = new Notification({
        userId: userId,
        title: title, 
        message: message,
        icon: icon,
        image: image,
        dir: dir,
        lang: lang,
        vibrate: vibrate,
        silent: silent,
        badge: badge,
        tag: tag,
        renotify: renotify,
        actions: actions,
        data: data,
        scheduledAt: scheduledAt
    });

    notification.save().then(result => {
        res.status(201).json({
            ok: true,
            message: __('Notification created successfully!'),
            data: notification
        });
    }).catch(err => {
        next(err);
    });
    
}

exports.sendNotification = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error(__("Validation error occured"));
        error.statusCode = 422;
        error.data = { errors: errors.array() };
        throw error;
    }

    webpush.setVapidDetails(
        'mailto:'+req.user.email,
        req.user.vapidKeys.publicKey,
        req.user.vapidKeys.privateKey
    );

    const title = req.body.title;
    const message = req.body.message;
    const icon = req.body.icon;
    const image = req.body.image;
    const dir = req.body.dir || "ltr"; // ltr, rtl
    const lang = req.body.lang || "el-GR"; //BCP 47, en-US
    const vibrate = req.body.vibrate; // [100, 30, 100] vibrate, pause, vibrate
    const silent = req.body.silent || false; // when true, don't use vibrate option (throws a TypeError)
    const badge = req.body.badge; // 96X96
    const tag = req.body.tag;
    const renotify = req.body.renotify || true; // true, false
    const actions = req.body.actions || []; // [{ action: "confirm", title: "OK", icon: "https://..." }]
    const data = req.body.data || [];

    const notificationData = {
        title: title, 
        message: message,
        icon: icon,
        image: image,
        dir: dir,
        lang: lang,
        vibrate: vibrate,
        silent: silent,
        badge: badge,
        tag: tag,
        renotify: renotify,
        actions: actions,
        data: data
    };

    const options = {
        //gcmAPIKey: "",
        timeout: 5000, // 5 sec
        TTL: 60*60*24*4, // 4 days
        contentEncoding: "aes128gcm"
    };

    let successCounter = 0;
    Subscription.find({userId: req.user._id.toString()}).then(async subscriptions => {
        for (const sub of subscriptions){
            await webpush.sendNotification(sub, JSON.stringify(notificationData), options).then(result => {
                return result;
            }).then(response => {
                successCounter++;
                const log = new Log({
                    subscription: sub,
                    notification: notificationData,
                    response: response
                });
                return log.save();
            }).catch(error => {
                const log = new Log({
                    subscription: sub,
                    notification: notificationData,
                    response: error
                });
                return log.save();
            });
        };

        return res.status(201).json({
            ok: true,
            message: __("Notification send to %s subscribers!", subscriptions.length),
            data: {
                totalSubscriptions: subscriptions.length,
                totalSent: successCounter,
                notification: notificationData
            }
        });
    }).catch(error => {
        next(error);
    });
};