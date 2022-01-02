const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
  },
  image: {
    type: String,
  },
  badge: {
    type: String,
  },
  dir: {
    type: String,
    default: 'ltr',
  },
  lang: {
    type: String,
    default: 'el-GR',
  },
  vibrate: {
    type: Array,
  },
  silent: {
    type: Boolean,
  },
  tag: {
    type: String,
  },
  renotify: {
    type: Boolean,
  },
  actions: {
    type: Array,
  },
  data: {
    type: Array,
  },
  scheduledAt: {
    type: Date,
    required: true,
  },
  sentAt: {
    type: Date,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
    default: 'PENDING',
  },
});

notificationSchema.statics.findPending = function (cb) {
  const now = new Date();

  return this.find(
    { sentAt: undefined, scheduledAt: { $lt: now }, status: 'PENDING' },
    cb
  );
};

module.exports = mongoose.model('Notification', notificationSchema);
