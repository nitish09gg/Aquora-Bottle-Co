const axios = require("axios");

const sendSMS = async ({ phone, otp }) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/transactionalSMS/send",
      {
        sender: "AQUORA",
        recipient: phone,
        content: `Your Aquora verification code is ${otp}. It expires in 15 minutes.`,
        type: "transactional",
        tag: "phoneVerification",
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log("SMS sent successfully:", {
        phone,
        response: response.data,
      });
    return response.data;
  } catch (error) {
    console.error(
      "Brevo SMS Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

module.exports = sendSMS;