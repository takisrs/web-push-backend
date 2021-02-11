const nodemailer = require('nodemailer');

/**
 * Sends an email
 * 
 * @param {string} to 
 * @param {string} subject 
 * @param {string} text 
 */
exports.sendEmail = (to, subject, text) => {
    var transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // upgrade later with STARTTLS
        ignoreTLS: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
        }
    });
    
    var mailOptions = {
      from: 'takispadaz@gmail.com',
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