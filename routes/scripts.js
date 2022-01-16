const router = require('express').Router();

const isAuth = require('../middleware/is-auth');
const scriptsController = require('../controllers/scripts');

router.get('/main', isAuth, scriptsController.getMainScript);
router.get('/sw', isAuth, scriptsController.getSWScript);

module.exports = router;
