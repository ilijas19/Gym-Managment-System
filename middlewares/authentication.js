const Token = require("../models/Token");
const CustomError = require("../errors");
const { decodeToken, attachCookiesToResponse } = require("../utils");

const authorizePermission = (role) => {
  return async (req, res, next) => {
    if (req.user.role === "admin") return next();
    if (req.user.role === role) return next();
    throw new CustomError.UnauthorizedError("Not Authorized to use this path");
  };
};

const authenticateUser = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;
  if (!accessToken || !refreshToken) {
    throw new CustomError.UnauthenticatedError("Authentication failed");
  }
  if (accessToken) {
    const decodedAccessToken = decodeToken(accessToken);
    req.user = decodedAccessToken;
    return next();
  }
  if (refreshToken) {
    const decodedRefreshToken = decodeToken(refreshToken);

    const existingToken = await Token.findOne({
      user: decodedRefreshToken.user.userId,
    });
    if (!existingToken || !existingToken.isValid) {
      throw new CustomError.UnauthenticatedError("Authentication failed");
    }
    attachCookiesToResponse({
      res,
      user: decodedRefreshToken.user,
      refreshToken,
    });
    req.user = decodedRefreshToken.user;

    return next();
  }
};

module.exports = { authenticateUser, authorizePermission };
