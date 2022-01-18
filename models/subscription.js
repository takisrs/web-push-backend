const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  endpoint: {
    type: String,
    required: true,
  },
  keys: {
    p256dh: {
      type: String,
      required: true,
    },
    auth: {
      type: String,
      required: true,
    },
  },
  added: {
    type: Date,
    default: Date.now,
  },
});

subscriptionSchema.statics.endpointExists = function (endpoint, cp) {
  this.countDocuments({ endpoint }).exec(cp);
};

module.exports = mongoose.model('Subscription', subscriptionSchema);
