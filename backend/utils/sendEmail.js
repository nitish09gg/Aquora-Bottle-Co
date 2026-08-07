const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,          // true only for port 465
  requireTLS: true,       // use this with port 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log("Connecting to SMTP...");

    await transporter.verify();
    console.log("SMTP verified!");

    const info = await transporter.sendMail({
      from: `"Aquora Bottle Co" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent:", info.messageId);
  } catch (err) {
    console.error("SMTP Error:", err);
    throw err;
  }
};

module.exports = sendEmail;