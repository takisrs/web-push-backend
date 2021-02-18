const router = require('express').Router();
const fs = require('fs');
const path = require("path");

const isAuth = require("../middleware/is-auth");

router.get('/main', isAuth, (req, res) => {
    console.log(req.headers.host);	
	fs.readFile('views/main.js', 'utf8', function (err, data) {
		if (err) {
		  throw err;
		}
        res.setHeader("Content-Type", "application/javascript; charset=UTF-8");
        data = data.replace("{HOST}", req.headers.host);
        data = data.replace("{PUBLIC_VAPID_KEY}", req.user.vapidKeys.publicKey);
		res.send(data);
	});
	
});

router.get('/sw', isAuth, (req, res) => {
	res.sendFile(path.join(__dirname, '../views/sw.js'));
});

module.exports = router;