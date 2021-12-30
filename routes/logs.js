const express = require('express');

const isAuth = require('../middleware/is-auth');
const logsController = require('../controllers/logs');

const router = express.Router();

router.get('/', isAuth, logsController.getLogs);

module.exports = router;
