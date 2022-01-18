const { __ } = require('i18n');
const { validationResult } = require('express-validator');

const Subscription = require('../models/subscription');
const User = require('../models/user');
const asyncMiddleware = require('../middleware/async');
const ApiError = require('../utils/api-error');

const getSubscriptions = asyncMiddleware(async (req, res) => {
  let filter = {};
  if (req.user) filter = { user: req.user._id.toString() };

  if (req.query.endpoint) filter = { endpoint: req.query.endpoint, ...filter };

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const subscriptions = await Subscription.find(filter)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ added: -1 });

  if (subscriptions && subscriptions.length > 0) {
    const totalSubscriptions = await Subscription.countDocuments(filter);
    res.status(201).json({
      ok: true,
      message: __(
        'Fetched %d subscriptions of %d total',
        subscriptions.length,
        totalSubscriptions
      ),
      data: {
        totalItems: totalSubscriptions,
        currentPage: page,
        totalPages: Math.ceil(totalSubscriptions / limit),
        itemsPerPage: limit,
        subscriptions,
      },
    });
  } else {
    throw new ApiError(__('No subscription found'), 404);
  }
});

const postSubscription = asyncMiddleware(async (req, res, next) => {
  const { userId, subscription } = req.body;
  const errors = validationResult(req);

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(__('user not found'), 400, { id: userId });
  }

  if (!errors.isEmpty()) {
    throw new ApiError(__('Validation error occured'), 422, {
      errors: errors.array(),
    });
  }

  const subscriptionObj = new Subscription({
    user: userId,
    ...subscription,
  });

  const result = await subscriptionObj.save();

  if (result) {
    res.status(201).json({
      ok: true,
      message: __('Subscription created successfully!'),
      data: subscriptionObj,
    });
  }
});

module.exports = {
  getSubscriptions,
  postSubscription,
};
