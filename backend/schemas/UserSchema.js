const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      sparse: true,
    },

    password: {
      type: String,
      minlength: 8,
      select: false,
    },

    provider: {
      type: String,
      enum: ["email", "google", "phone"],
      default: "email",
    },

    firebaseUid: {
      type: String,
      unique: true,
      sparse: true,
    },

    photo: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
    },
    resetPasswordToken: {
      type: String,
    },
    
    resetPasswordExpires: {
      type: Date,
    }
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (!this.password || !this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function (enteredPassword) {
  if (!this.password) return false;

  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = userSchema;