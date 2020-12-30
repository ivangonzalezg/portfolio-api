/* eslint-disable indent */
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "mail.ivangonzalez.co",
  port: 465,
  secure: true,
  auth: {
    user: "no-reply@ivangonzalez.co",
    pass: "OOJjdDobrgKw"
  }
});

async function send(to, subject, html) {
  try {
    const mailOptions = {
      from: "Ivan Gonzalez <no-reply@ivangonzalez.co>",
      to,
      subject,
      html
    };
    await transporter.sendMail(mailOptions);
    return 200;
  } catch (error) {
    return error;
  }
}

module.exports = {
  form: async data => {
    try {
      let email = process.env.ADMIN_EMAIL;
      if (process.argv[2] === "dev") email = process.env.ADMIN_EMAIL_DEV;
      let body = fs.readFileSync(path.join(__dirname, "../templates/form/send.html")).toString();
      Object.keys(data).forEach(key => {
        body = body.replace(new RegExp(`{{${key}}}`, "g"), data[key]);
      });
      const status = await send(email, "Nuevo envío por el formulario web", body);
      return status;
    } catch (error) {
      return error;
    }
  }
};
