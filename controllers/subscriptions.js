const { __ } = require('i18n');

const Subscription = require('../models/subscription');

exports.getSubscriptions = (req, res, next) => {
    let filter = {};
    if (req.user)
        filter = { userId: req.user._id.toString() };

    if (req.query.endpoint)
        filter = { endpoint: req.query.endpoint, ...filter };


    Subscription.find(filter).then(subscriptions => {
        if (subscriptions.length > 0){
            res.status(201).json({
                ok: true,
                message: __("Fetched %s subscriptions", subscriptions.length),
                data: subscriptions
            });
        } else {
            res.status(404).json({
                ok: false,
                message: __("No subscription found"),
                data: subscriptions
            });
        }

    }).catch(err => {
        next(err);
    });
};


exports.postSubscription = (req, res, next) => {
    const subscription = new Subscription({
        userId: req.user._id.toString(),
        ...req.body.subscription
    });

    subscription.save().then(result => {
        res.status(201).json({
            ok: true,
            message: __("Subscription created successfully!"),
            data: subscription
        });
    }).catch(err => {
        next(err);
    });
};