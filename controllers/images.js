const { __ } = require('i18n');

const uploadFile = require('../middleware/upload');
const ApiError = require('../utils/api-error');

const postImage = async (req, res, next) => {
  try {
    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).json({
        ok: false,
        message: __('Please upload a file!'),
        data: [],
      });
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
    throw new ApiError(__('Could not upload the file'), 500, {});
  }
};

module.exports = { postImage };
