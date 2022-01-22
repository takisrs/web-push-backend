const { __ } = require('i18n');

const uploadFile = require('../middleware/upload');
const ApiError = require('../utils/api-error');
const asyncMiddleware = require('../middleware/async');

const postImage = asyncMiddleware(async (req, res) => {
  try {
    await uploadFile(req, res);

    if (req.file === undefined) {
      throw new ApiError(__('Please upload a file!'), 400);
    }

    res.status(200).json({
      ok: true,
      message: __('Uploaded the file successfully: %s', req.file.originalname),
      data: {
        ...req.file,
        fullpath: `http://${req.headers.host}/${req.file.path}`,
      },
    });
  } catch (err) {
    throw new ApiError(__('Could not upload the file'), 500, { err });
  }
});

module.exports = { postImage };
