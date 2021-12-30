const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('./logger');

const sendEmail = (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: false, // upgrade later with STARTTLS
    ignoreTLS: true,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.password,
    },
  });

  const mailOptions = {
    from: config.smtp.from,
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.error('[EMAIL]', error);
    } else {
      logger.info('[EMAIL]', info.response);
    }
  });
};

module.exports = sendEmail;
