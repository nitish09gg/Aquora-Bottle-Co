const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  await resend.emails.send({
    from: "Aquora Bottle Co <onboarding@resend.dev>",
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;