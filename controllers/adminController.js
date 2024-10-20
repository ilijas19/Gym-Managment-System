const Staff = require("../models/Staff");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");

const createStaffMember = async (req, res) => {
  const { name, username, password } = req.body;
  if (!name || !username || !password) {
    throw new CustomError.BadRequestError("All credientials must be specified");
  }
  const staff = await Staff.create({ name, username, password });
  res.status(StatusCodes.OK).json({ staff });
};

const getAllStaffMembers = async (req, res) => {
  const staffs = await Staff.find({ role: "staff" }).select({ password: 0 });
  res.status(StatusCodes.OK).json(staffs);
};

const getStaffMember = async (req, res) => {
  const { id: staffId } = req.params;
  if (!staffId) {
    throw new CustomError.BadRequestError("Staff Id needs to be provided");
  }
  const staff = await Staff.findOne({ _id: staffId }).select({ password: 0 });
  if (!staff) {
    throw new CustomError.NotFoundError(`No staff with id: ${staffId}`);
  }
  res.status(StatusCodes.OK).json({ staff });
};

const updateStaffMember = async (req, res) => {
  const { id: staffId } = req.params;
  const { name, username, active } = req.body;
  if (!staffId) {
    throw new CustomError.BadRequestError("Staff Id needs to be provided");
  }
  const staff = await Staff.findOne({ _id: staffId }).select({ password: 0 });
  if (!staff) {
    throw new CustomError.NotFoundError(`No staff with id: ${staffId}`);
  }
  staff.name = name || staff.name;
  staff.username = username || staff.username;
  staff.active = active || staff.active;
  await staff.save({ validateModifiedOnly: true });
  res.status(StatusCodes.OK).json({ staff });
};

const deleteStaffMember = async (req, res) => {
  const { id: staffId } = req.params;
  if (!staffId) {
    throw new CustomError.BadRequestError("Staff Id needs to be provided");
  }
  const staff = await Staff.findOneAndDelete({ _id: staffId });
  if (!staff) {
    throw new CustomError.NotFoundError(`No staff with id: ${staffId}`);
  }
  res.status(StatusCodes.OK).json({ msg: "Staff Deleted" });
};

const resetStaffPassword = async (req, res) => {
  const { id: staffId } = req.params;
  const { password } = req.body;
  if (!staffId) {
    throw new CustomError.BadRequestError("Staff Id needs to be provided");
  }
  const staff = await Staff.findOne({ _id: staffId });
  if (!staff) {
    throw new CustomError.NotFoundError(`No staff with id: ${staffId}`);
  }
  staff.password = password;
  await staff.save();
  res.status(StatusCodes.OK).json({ msg: "password updated" });
};

module.exports = {
  createStaffMember,
  getAllStaffMembers,
  getStaffMember,
  updateStaffMember,
  deleteStaffMember,
  resetStaffPassword,
};
