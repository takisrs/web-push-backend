const Log = require('../models/log');

exports.getLogs = (req, res, next) => {
    let filter = {};
    if (req.user)
        filter = { 'subscription.userId': req.user._id };
    
    Log.find(filter).then(logs => {
        if (logs.length > 0){
            res.status(201).json({
                ok: true,
                message: 'Fetched ' + logs.length + ' logs',
                data: logs
            });
        } else {
            res.status(404).json({
                ok: false,
                message: 'No logs found',
                data: logs
            });
        }

    }).catch(err => {
        next(err);
    });
};