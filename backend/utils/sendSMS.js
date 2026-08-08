const axios = require("axios");

const sendSMS = async ({ phone, otp }) => {
  try {
    const apiKey = process.env.TWOFACTOR_API_KEY;

    if (!apiKey) {
      throw new Error("TWOFACTOR_API_KEY is not configured.");
    }

    const phoneNumber = phone.replace("+", "");

    const message = `${otp} is your Aquora verification code. It expires in 15 minutes.`;

    const params = new URLSearchParams();

    params.append("mode", "TRANS_SMS");
    params.append("apikey", apiKey);
    params.append("to", phoneNumber);
    params.append("from", "AQUORA");
    params.append("msg", message);

    const response = await axios.post(
      "https://2factor.in/API/R1/",
      params.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("2Factor Transactional SMS Response:", response.data);

    if (response.data?.Status !== "Success") {
      throw new Error(
        response.data?.Details || "2Factor SMS request failed."
      );
    }

    return response.data;
  } catch (error) {
    console.error(
      "2Factor Transactional SMS Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

module.exports = sendSMS;