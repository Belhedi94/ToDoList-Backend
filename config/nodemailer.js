const nodemailer = require("nodemailer");
require("dotenv").config();

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.PASSWORD,
  },
});

module.exports.sendMail = (user, subject, body) => {
  transport.sendMail({
    from: process.env.USER,
    to: user.email,
    subject: subject,
    html: body,
  });
};
