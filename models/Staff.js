const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const StaffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name value"],
  },
  username: {
    type: String,
    required: [true, "Please provide username value"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  role: {
    type: String,
    enum: ["admin", "staff"],
    default: "staff",
  },
  dateOfEmployment: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

StaffSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

StaffSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Staff", StaffSchema);
