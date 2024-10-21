const mongoose = require("mongoose");
const validator = require("validator");

const MemberSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please provide member name"],
  },
  email: {
    required: [true, "please provide email"],
    type: String,
    validate: {
      validator: function (email) {
        return validator.isEmail(email);
      },
      message: "Email not valid",
    },
  },
  membershipPlan: {
    type: String,
    enum: ["open-gym", "individual"],
    default: "open-gym",
  },
  membershipExpirationDate: {
    type: Date,
    default: () => new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  },
  trainer: {
    type: mongoose.Types.ObjectId,
    ref: "Trainer",
  },
  note: {
    type: String,
  },
});

MemberSchema.virtual("daysUntilExpiration").get(function () {
  const now = new Date();
  return Math.ceil(
    (this.membershipExpirationDate - now) / (1000 * 60 * 60 * 24)
  );
});

module.exports = mongoose.model("Member", MemberSchema);
