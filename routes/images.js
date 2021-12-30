const express = require('express');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

const imagesController = require('../controllers/images');

router.post('/', isAuth, imagesController.postImage);

module.exports = router;
