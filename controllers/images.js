const { __ } = require('i18n');

const uploadFile = require('../middleware/upload');

exports.postImage = async (req, res, next) => {
  try {
    await uploadFile(req, res);

    console.log(req.file);

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
    res.status(500).json({
      ok: false,
      message: __('Could not upload the file'),
      data: '',
    });
  }
};
