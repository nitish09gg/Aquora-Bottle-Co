const jwt = require("jsonwebtoken");

const userVerification = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);

    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Your session is invalid or has expired.",
    });
  }
};

module.exports = { userVerification };