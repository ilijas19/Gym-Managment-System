const Staff = require("../models/Staff");
const Token = require("../models/Token");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { createTokenUser, attachCookiesToResponse } = require("../utils");
const crypto = require("crypto");

const staffLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new CustomError.BadRequestError(`All credientials must be provided`);
  }
  const staff = await Staff.findOne({ username: username });
  if (!staff) {
    throw new CustomError.NotFoundError(`No staff with username ${username}`);
  }
  const isPasswordCorrect = await staff.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Wrong password");
  }
  const tokenUser = createTokenUser(staff);
  const existingToken = await Token.findOne({ user: staff._id });
  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new CustomError.UnauthenticatedError("Auhtentication failed");
    }
    const refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    res.status(StatusCodes.OK).json({ tokenUser });
    return;
  }
  const refreshToken = crypto.randomBytes(40).toString("hex");
  const ip = req.ip;
  const userAgent = req.headers["user-agent"];
  await Token.create({ refreshToken, ip, userAgent, user: staff._id });
  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  res.status(StatusCodes.OK).json({ tokenUser });
};

const trainerLogin = async (req, res) => {
  res.send("trainerlogin");
};

const logout = async (req, res) => {
  await Token.findOneAndDelete({ user: req.user.userId });
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(StatusCodes.OK).json({ msg: "Logout" });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ currentUser: req.user });
};

module.exports = { staffLogin, trainerLogin, logout, showCurrentUser };
