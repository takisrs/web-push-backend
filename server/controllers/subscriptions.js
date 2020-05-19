const Subscription = require('../models/subscription');

exports.getSubscriptions = (req, res, next) => {
    Subscription.find().then(subscriptions => {
        res.status(201).json({
            message: 'Fetched ' + subscriptions.length + ' subscriptions',
            data: subscriptions
        });
    }).catch(err => {
        throw err;
    });
};


exports.postSubscription = (req, res, next) => {
    const subscription = new Subscription(req.body.subscription);

    subscription.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Subscription created successfully!',
            data: subscription
        });
    }).catch(err => {
        throw err;
    });
};