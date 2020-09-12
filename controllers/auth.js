const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.login = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation error occured");
        error.statusCode = 422;
        error.data = { errors: errors.array() };
        throw error;
    }

    const email = req.body.email;
    const password = req.body.password;

    let loadedUser = null;

    User.findOne({ email: email }).then(user => {
      if (!user) {
        const error = new Error('A user with this email could not be found.');
        error.statusCode = 401;
        error.data = { email: email };
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    }).then(isEqual => {
        if (!isEqual) {
            const error = new Error('Wrong password!');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({ email: loadedUser.email, userId: loadedUser._id.toString() }, process.env.JWT_TOKEN_SECRET, { expiresIn: '1h' });
        res.status(200).json({ 
            ok: true,
            message: "Login ok",
            data: {
                token: token, 
                userId: loadedUser._id.toString() 
            }
        });
    }).catch(err => {
        next(err);
    })

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