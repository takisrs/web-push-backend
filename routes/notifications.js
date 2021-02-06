const express = require("express");
const { check, oneOf } = require("express-validator");
const mongoose = require('mongoose');
const i18n = require('i18n');

const isAuth = require("../middleware/is-auth");

const router = express.Router();

const notificationsController = require("../controllers/notifications");

router.post("/", isAuth, [
    check("title").isLength({ min: 5 }).withMessage(i18n.__("Title is required with a mimimun length of 5 characters")), 
    check("message").isLength({ min: 10 }).withMessage(i18n.__("Message is required with a mimimun length of 10 characters")),
    oneOf([
        check("scheduledAt").isEmpty().withMessage(i18n.__("scheduledAt file shound be empty")),
        check("scheduledAt").isDate().withMessage(i18n.__("scheduledAt file shound be a valid date")),
    ], i18n.__("Please provide a valid date or empty value to schedule for immediate sending"))
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
