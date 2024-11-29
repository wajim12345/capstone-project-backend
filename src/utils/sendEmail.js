const nodemailer = require("nodemailer");

// verify the sender email crendetials
const transporter = nodemailer.createTransport({
  // host: "smtp-mail.outlook.com",
  service: process.env.EMAIL_SERVICE,
  secure: process.env.EMAIL_PORT == 465,
  // port: 587,
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false,
  },
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// send the reset password email
const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
