const express = require('express');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

const logsController = require('../controllers/logs');

router.get('/', isAuth, logsController.getLogs);

module.exports = router;