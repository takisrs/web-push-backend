const express = require('express');
const { check } = require('express-validator');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

const subscriptionsController = require('../controllers/subscriptions');

router.get('/', isAuth, subscriptionsController.getSubscriptions);

router.post('/', [
    check("userId").custom(value => {
        return new Promise((resolve, reject) => {
            isValid = mongoose.Types.ObjectId.isValid(value);
            if (!isValid) {
                reject(new Error(__("The provided id is not a valid one")));
            }
            resolve(true);
        });
    })
], subscriptionsController.postSubscription);

module.exports = router;