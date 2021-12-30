const util = require('util');
const multer = require('multer');
const mkdirp = require('mkdirp');

const config = require('../config/config');

const maxSize = config.upload.maxsize * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = `resources/uploads/${req.user._id.toString()}/`;
    mkdirp(dir, (err) => cb(err, dir));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadFile = multer({
  storage,
  limits: { fileSize: maxSize },
}).single('file');

const uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
