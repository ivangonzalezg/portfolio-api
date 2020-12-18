/* eslint-disable indent */
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const MailComposer = require("nodemailer/lib/mail-composer");

function getAuth(credentialsPath, tokenPath) {
  const credentials = fs.readFileSync(credentialsPath).toString();
  const { client_secret: clientSecret, client_id: clientId, redirect_uris: redirectUris } = JSON.parse(credentials).installed;
  const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUris[0]);
  const token = fs.readFileSync(tokenPath).toString();
  oAuth2Client.setCredentials(JSON.parse(token));
  return oAuth2Client;
}

async function createEmailAdminRaw(email, subject, html) {
  const mail = new MailComposer({
    from: "Ivan Gonzalez <ivan.gonzalez.testing.email@gmail.com>",
    to: email,
    subject,
    html,
    textEncoding: "base64"
  });
  let encodedMessage = await mail.compile().build();
  encodedMessage = await Buffer.from(encodedMessage)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return encodedMessage;
}

async function send(email, subject, body) {
  try {
    const auth = getAuth(
      path.join(__dirname, "../config/credentials.gmail.json"),
      path.join(__dirname, "../config/token.gmail.json")
    );
    const raw = await createEmailAdminRaw(email, subject, body);
    const gmail = google.gmail({ version: "v1", auth });
    const r = await gmail.users.messages.send({
      auth,
      userId: "me",
      resource: {
        raw
      }
    });
    return r.status;
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
