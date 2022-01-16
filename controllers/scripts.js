const fs = require('fs');
const path = require('path');
const { __ } = require('i18n');
const { minify } = require('terser');

const asyncMiddleware = require('../middleware/async');

const getMainScript = asyncMiddleware(async (req, res) => {
  const { user, headers, query } = req;

  fs.readFile(
    path.join(__dirname, '../views/main.js'),
    'utf8',
    async (err, code) => {
      if (err) throw err;
      code = code.replace('{HOST}', headers.host);
      code = code.replace('{PUBLIC_VAPID_KEY}', user.vapidKeys.publicKey);
      code = code.replace('{USER_ID}', user._id.toString());

      if (query.minify && query.minify == 1) {
        const minifiedCode = await minify(code);
        code = minifiedCode.code;
      }

      res.status(201).json({
        ok: true,
        message: __('Main script code retrieved'),
        data: code,
      });
    }
  );
});

const getSWScript = asyncMiddleware(async (req, res) => {
  const { user, headers, query } = req;

  fs.readFile(
    path.join(__dirname, '../views/sw.js'),
    'utf8',
    async (err, code) => {
      if (err) throw err;
      code = code.replace('{HOST}', headers.host);
      code = code.replace('{PUBLIC_VAPID_KEY}', user.vapidKeys.publicKey);
      code = code.replace('{USER_ID}', user._id.toString());

      if (query.minify && query.minify == 1) {
        const minifiedCode = await minify(code);
        code = minifiedCode.code;
      }

      res.status(201).json({
        ok: true,
        message: __('Main script code retrieved'),
        data: code,
      });
    }
  );
});

module.exports = { getMainScript, getSWScript };
