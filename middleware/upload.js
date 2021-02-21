const util = require("util");
const multer = require("multer");
const mkdirp = require("mkdirp");
const config = require('../config/config');

const maxSize = config.upload.maxsize * 1024 * 1024;

let storage = multer.diskStorage({
	destination: (req, file, cb) => {
        const dir = "resources/uploads/" + req.user._id.toString() + "/";
        mkdirp(dir, err => cb(err, dir));
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
});

let uploadFile = multer({
	storage: storage,
	limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
