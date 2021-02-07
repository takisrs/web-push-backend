const { __ } = require('i18n');

const Log = require('../models/log');

exports.getLogs = (req, res, next) => {
    let filter = {};
    if (req.user)
        filter = { 'subscription.userId': req.user._id };
    
    Log.find(filter).then(logs => {
        if (logs.length > 0){
            res.status(201).json({
                ok: true,
                message: __("Fetched %s logs", logs.length),
                data: logs
            });
        } else {
            res.status(404).json({
                ok: false,
                message: __("No logs found"),
                data: logs
            });
        }

    }).catch(err => {
        next(err);
    });
};