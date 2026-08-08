const axios = require("axios");

const sendSMS = async ({ phone, otp }) => {
  try {
    const apiKey = process.env.TWOFACTOR_API_KEY;

    if (!apiKey) {
      throw new Error("TWOFACTOR_API_KEY is not configured.");
    }

    const response = await axios.post(
      "https://2factor.in/API/V1/OTP/SEND",
      {
        to: phone,
        template_name: "AQUORA_OTP",
        var1: otp,
      },
      {
        headers: {
          "X-API-Key": apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("2Factor SMS Response:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "2Factor SMS Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

module.exports = sendSMS;