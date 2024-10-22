const sgMail = require("@sendgrid/mail");

const sendMail = async ({ to, message }) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to,
    from: "ilijagocic19@gmail.com",
    subject: "Mail From Trainer",
    html: `<strong>${message}</strong>`,
  };
  const mail = await sgMail.send(msg);
  if (mail) {
    console.log("mail sent");
  }
};

module.exports = sendMail;
