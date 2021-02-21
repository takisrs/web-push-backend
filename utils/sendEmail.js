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
        host: config.smtp.host,
        port: config.smtp.port,
        secure: false, // upgrade later with STARTTLS
        ignoreTLS: true,
        auth: {
          user: config.smtp.user,
          pass: config.smtp.password
        }
    });
    
    var mailOptions = {
      from: config.smtp.from,
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