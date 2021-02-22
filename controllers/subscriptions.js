const { __ } = require('i18n');

const Subscription = require('../models/subscription');
const User = require('../models/user');

exports.getSubscriptions = (req, res, next) => {
    let filter = {};
    if (req.user)
        filter = { user: req.user._id.toString() };

    if (req.query.endpoint)
        filter = { endpoint: req.query.endpoint, ...filter };

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;

    Subscription.find(filter).skip((page-1) * limit).limit(limit).sort({added: -1}).then(subscriptions => {
        if (subscriptions.length > 0){
            Subscription.countDocuments(filter).then(count => {
                res.status(201).json({
                    ok: true,
                    message: __("Fetched %d subscriptions of %d total", subscriptions.length, count),
                    data: {
                        totalItems: count,
                        currentPage: page,
                        totalPages: Math.ceil(count / limit),
                        itemsPerPage: limit,
                        notifications: subscriptions
                    }
                });
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
    //User.find()

    const subscription = new Subscription({
        user: req.body.userId,
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