const axios = require("axios");

const sendSMS = async ({ phone, otp }) => {
  try {
    const apiKey = process.env.TWOFACTOR_API_KEY;

    if (!apiKey) {
      throw new Error("TWOFACTOR_API_KEY is not configured.");
    }

    // +918335024412 → 918335024412
    const phoneNumber = phone.replace("+", "");

    const url = `https://2factor.in/API/V1/${apiKey}/SMS/${phoneNumber}/${otp}`;

    const response = await axios.post(url);

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