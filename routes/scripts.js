const router = require('express').Router();
const fs = require('fs');
const path = require("path");
const { minify } = require('terser');

const isAuth = require("../middleware/is-auth");

router.get('/main', isAuth, (req, res) => {
	fs.readFile('views/main.js', 'utf8', async function (err, code) {
		if (err) {
		  throw err;
		}
        res.setHeader("Content-Type", "application/javascript; charset=UTF-8");
        code = code.replace("{HOST}", req.headers.host);
        code = code.replace("{PUBLIC_VAPID_KEY}", req.user.vapidKeys.publicKey);
		code = code.replace("{USER_ID}", req.user._id.toString());

		if (req.query.minify && req.query.minify==1){
			const minifiedCode = await minify(code);
			code = minifiedCode.code;
		}	

		res.send(code);
	});
});

router.get('/sw', isAuth, (req, res) => {
	fs.readFile(path.join(__dirname, '../views/sw.js'), 'utf8', async function (err, code) {
		if (err) {
		  throw err;
		}
        res.setHeader("Content-Type", "application/javascript; charset=UTF-8");
        code = code.replace("{HOST}", req.headers.host);
        code = code.replace("{PUBLIC_VAPID_KEY}", req.user.vapidKeys.publicKey);
		code = code.replace("{USER_ID}", req.user._id.toString());

		if (req.query.minify && req.query.minify==1){
			const minifiedCode = await minify(code);
			code = minifiedCode.code;
		}	

		res.send(code);
	});

	//res.sendFile(path.join(__dirname, '../views/sw.js'));
});

module.exports = router;