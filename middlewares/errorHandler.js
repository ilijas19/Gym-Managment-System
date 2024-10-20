const CustomApiError = require("../errors/custom-error");
const { StatusCodes } = require("http-status-codes");

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomApiError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  if (err.name === "CastError") {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `${err.value} is not valid id` });
  }
  if (err.code === 11000) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: `Duplicate value entered for ${Object.keys(err.keyValue)}`,
    });
  }
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ msg: "Something Went Wrong" });
};

module.exports = errorHandler;
