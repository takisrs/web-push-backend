const express = require("express");
const { check, oneOf } = require("express-validator");
const mongoose = require('mongoose');

const isAuth = require("../middleware/is-auth");

const router = express.Router();

const notificationsController = require("../controllers/notifications");

router.post("/", isAuth, [
    check("title").isLength({ min: 5 }), 
    check("message").isLength({ min: 10 }),
    oneOf([
        check("scheduledAt").isEmpty(),
        check("scheduledAt").isDate(),
    ], "Please provide a valid date or empty value to schedule for immediate sending")
], notificationsController.postNotification);

router.post("/send", isAuth, [
    check("id").custom(value => {
        return new Promise((resolve, reject) => {
            isValid = mongoose.Types.ObjectId.isValid(value);
            if (!isValid) {
                reject(new Error('The provided id is not a valid one'));
            }
            resolve(true);
        });
    })
], notificationsController.sendNotification);



module.exports = router;
