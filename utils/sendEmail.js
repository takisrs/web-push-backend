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
    var transporter = nodemailer.createTransport({
        host: config.SMTP_HOST,
        port: config.SMTP_PORT,
        secure: false, // upgrade later with STARTTLS
        ignoreTLS: true,
        auth: {
          user: config.SMTP_USER,
          pass: config.SMTP_PASSWORD
        }
    });
    
    var mailOptions = {
      from: config.EMAIL_FROM,
      to: to,
      subject: subject,
      text: text
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
}