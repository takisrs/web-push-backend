const nodemailer = require('nodemailer');
const config = require('../config/config');

/**
 * Sends an email
 *
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 */
exports.sendEmail = (to, subject, text) => {
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
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
};
