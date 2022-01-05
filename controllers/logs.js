const { __ } = require('i18n');

const Log = require('../models/log');
const asyncMiddleware = require('../middleware/async');
const ApiError = require('../utils/api-error');

const getLogs = asyncMiddleware(async (req, res) => {
  const { user } = req;
  let filter = {};
  if (user) filter = { 'subscription.user': user._id };

  const logs = await Log.find(filter);

  if (logs && logs.length > 0) {
    res.status(201).json({
      ok: true,
      message: __('Fetched %s logs', logs.length),
      data: logs,
    });
  } else {
    throw new ApiError(__('No logs found'), 404);
  }
});

module.exports = { getLogs };
