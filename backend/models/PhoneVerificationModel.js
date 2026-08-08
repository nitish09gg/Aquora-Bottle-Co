const mongoose = require("mongoose");

const phoneVerificationSchema = require("../schemas/PhoneVerificationSchema");

phoneVerificationSchema.index(
  { otpExpires: 1 },
  { expireAfterSeconds: 0 }
);

const PhoneVerification =
  mongoose.models.PhoneVerification ||
  mongoose.model(
    "PhoneVerification",
    phoneVerificationSchema
  );

module.exports = PhoneVerification;