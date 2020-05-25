const Subscription = require('../models/subscription');

exports.getSubscriptions = (req, res, next) => {
    let filter = {};
    if (req.query.endpoint)
        filter = { endpoint: req.query.endpoint };

    Subscription.find(filter).then(subscriptions => {
        if (subscriptions.length > 0){
            res.status(201).json({
                ok: true,
                message: 'Fetched ' + subscriptions.length + ' subscriptions',
                data: subscriptions
            });
        } else {
            res.status(404).json({
                ok: false,
                message: 'No subscription found',
                data: subscriptions
            });
        }

    }).catch(err => {
        next(err);
    });
};


exports.postSubscription = (req, res, next) => {
    const subscription = new Subscription(req.body.subscription);

    subscription.save().then(result => {
        res.status(201).json({
            ok: true,
            message: 'Subscription created successfully!',
            data: subscription
        });
    }).catch(err => {
        next(err);
    });
};