const mongoose = require("mongoose");

const emailVerificationSchema = require("../schemas/EmailVerificationSchema");

const EmailVerificationModel = mongoose.model(
  "EmailVerification",
  emailVerificationSchema
);

module.exports = EmailVerificationModel;