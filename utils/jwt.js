const jwt = require("jsonwebtoken");

const createJwt = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};

const decodeToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
};

const attachCookiesToResponse = ({ res, user, refreshToken }) => {
  const accessTokenJWT = createJwt({ payload: user });
  const refreshTokenJWT = createJwt({ payload: { user, refreshToken } });

  const oneDay = 1000 * 60 * 60 * 24;
  const tenDays = 1000 * 60 * 60 * 24 * 10;

  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + tenDays),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

module.exports = { createJwt, decodeToken, attachCookiesToResponse };
