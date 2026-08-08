const axios = require("axios");

const sendSMS = async ({ phone, otp }) => {
  console.log("========== sendSMS CALLED ==========");
  console.log("Phone:", phone);
  console.log("OTP:", otp);

  try {
    const apiKey = process.env.TWOFACTOR_API_KEY;

    console.log(
      "2Factor API key exists:",
      Boolean(apiKey)
    );

    if (!apiKey) {
      throw new Error("TWOFACTOR_API_KEY is not configured.");
    }

    const phoneNumber = phone.replace("+", "");

    const message = `${otp} is your Aquora verification code. It expires in 15 minutes.`;

    console.log("Sending transactional SMS...");
    console.log("Phone:", phoneNumber);
    console.log("Sender: AQUORA");
    console.log("Message:", message);

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

    console.log("========== 2FACTOR RESPONSE ==========");
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("========== 2FACTOR ERROR ==========");

    console.error(
      error.response?.data || error.message
    );

    throw error;
  }
};

module.exports = sendSMS;