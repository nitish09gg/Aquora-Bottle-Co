const axios = require("axios");

const validateEmail = async (email) => {
  try {
    const { data } = await axios.get(
      "https://emailvalidation.abstractapi.com/v1/",
      {
        params: {
          api_key: process.env.ABSTRACT_API_KEY,
          email,
        },
        timeout: 5000, // Prevent hanging requests
      }
    );

    return data;
  } catch (error) {
    console.error("Email validation failed:", error.message);

    return null;
  }
};

module.exports = validateEmail;