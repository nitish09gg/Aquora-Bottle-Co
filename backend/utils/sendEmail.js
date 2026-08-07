const axios = require("axios");

const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log("API key exists:", !!process.env.BREVO_API_KEY);
    console.log(
      "API key prefix:",
      process.env.BREVO_API_KEY?.substring(0, 8)
    );

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "AQUORA",
          email: "sanjit420sanju@gmail.com",
        },
        to: [
          {
            email: to,
          },
        ],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log("Email sent successfully:", response.data);
  } catch (error) {
    console.error("Status:", error.response?.status);
    console.error("Response:", error.response?.data);
    console.error("Message:", error.message);
    throw error;
  }
};

module.exports = sendEmail;