const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    subscription: {
        type: Object,
        required: true
    },
    notification: {
        type: Object,
        required: true
    },
    response: {
        type: Object,
        required: true
    },
    added: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Log', logSchema);