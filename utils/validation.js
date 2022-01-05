const mongoose = require('mongoose');
const { __ } = require('i18n');

const isValidMongoId = (value) =>
  new Promise((resolve, reject) => {
    const isValid = mongoose.Types.ObjectId.isValid(value);
    if (!isValid) {
      reject(new Error(__('The provided id is not a valid one')));
    } else {
      resolve(true);
    }
  });

module.exports = { isValidMongoId };
