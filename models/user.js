const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    website: {
        type: String,
        required: false
    },
    vapidKeys: {
        publicKey: {
            type: String,
            required: true
        },
        privateKey: {
            type: String,
            required: true
        }
    },
    active: {
        type: Boolean,
        required: true
    },
    added: { 
        type: Date, 
        default: Date.now 
    }
});

userSchema.statics.emailExists = function (email, cp) {
    this.countDocuments({email: email}).exec(cp);
} 

module.exports = mongoose.model('User', userSchema);