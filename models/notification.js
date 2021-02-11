const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    icon: {
        type: String
    },
    image: {
        type: String
    },
    badge: {
        type: String
    },
    dir: {
        type: String,
        default: "ltr"
    },
    lang: {
        type: String,
        default: "el-GR"
    },
    vibrate: { 
        type: Array
    },
    silent: {
        type: Boolean
    },
    tag: {
        type: String
    },
    renotify: {
        type: Boolean
    },
    actions: {
        type: Array
    },
    data: {
        type: Array
    },
    scheduledAt: {
        type: Date,
        required: true
    },
    sentAt: {
        type: Date
    }

});

module.exports = mongoose.model('Notification', notificationSchema);