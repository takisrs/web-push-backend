const express = require('express');

const isAuth = require('../middleware/is-auth');
const imagesController = require('../controllers/images');

const router = express.Router();

router.post('/', isAuth, imagesController.postImage);

module.exports = router;
