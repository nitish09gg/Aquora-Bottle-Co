const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

    await transporter.verify();
    console.log("SMTP Connection Successful");

    await transporter.sendMail({
      from: `"Aquora Bottle Co." <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Mail Sent Successfully");
  } catch (err) {
    console.error("Nodemailer Error:");
    console.error(err);
    throw err;
  }
};

module.exports = sendEmail;