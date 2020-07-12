const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    console.log(email, password);

    return res.status(201).json({
        ok: true,
        message: 'Login ok!',
        data: {
            email: email,
            password: password
        }
    });
}


exports.signup = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error("Validation error occured");
        error.statusCode = 422;
        error.data = { errors: errors.array() };
        throw error;
    }

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    bcrypt.hash(password, 12).then(hashedPassword => {
        const user = new User({
            name: name,
            email: email,
            password: hashedPassword
        });

        user.save().then(result => {
            res.status(201).json({
                ok: true,
                message: 'Account created!',
                data: user
            });
        }).catch(err => {
            next(err);
        });

    }).catch(err => {
        next(err);
    });

}