const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const webpush = require('web-push');
const { __ } = require('i18n');

const config = require('../config/config');

const User = require('../models/user');

exports.login = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error(__("Validation error occured"));
        error.statusCode = 422;
        error.data = { errors: errors.array() };
        throw error;
    }

    const email = req.body.email;
    const password = req.body.password;

    let loadedUser = null;

    User.findOne({ email: email }).then(user => {
        if (!user) {
            const error = new Error(__("A user with this email could not be found"));
            error.statusCode = 401;
            error.data = { email: email };
            throw error;
        }
        if (!user.active){
            const error = new Error(__("User is not active"));
            error.statusCode = 401;
            error.data = { userId: user._id.toString() };
            throw error;  
        }
        loadedUser = user;
        return bcrypt.compare(password, user.password);
    }).then(isEqual => {
        if (!isEqual) {
            const error = new Error(__("Wrong password!"));
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({ email: loadedUser.email, userId: loadedUser._id.toString() }, config.jwt.secret, { expiresIn: config.jwt.expires });
        res.status(200).json({ 
            ok: true,
            message: __("Login ok"),
            data: {
                userId: loadedUser._id.toString(),
                userEmail: loadedUser.email,
                website: loadedUser.website,
                token: token, 
                vapidPublicKey: loadedUser.vapidKeys.publicKey
            }
        });
    }).catch(err => {
        next(err);
    })

}


exports.signup = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error(__("Validation error occured"));
        error.statusCode = 422;
        error.data = { errors: errors.array() };
        throw error;
    }

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const website = req.body.website || '';

    const vapidKeys = webpush.generateVAPIDKeys();

    bcrypt.hash(password, 12).then(hashedPassword => {
        const user = new User({
            name: name,
            email: email,
            website: website,
            vapidKeys: vapidKeys,
            active: false,
            password: hashedPassword
        });

        user.save().then(result => {
            res.status(201).json({
                ok: true,
                message: __("Account created!"),
                data: {
                    userId: user._id.toString(),
                    email: user.email,
                    vapidPublicKey: user.vapidKeys.publicKey
                }
            });
        }).catch(err => {
            next(err);
        });

    }).catch(err => {
        next(err);
    });

}