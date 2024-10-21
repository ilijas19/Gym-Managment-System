const Trainer = require("../models/Trainer");
const Member = require("../models/Member");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
//members
const registerMember = async (req, res) => {
  const { fullName, email, membershipPlan } = req.body;
  if (!fullName || !email) {
    throw new CustomError.BadRequestError(
      "fullname and email must be provided"
    );
  }
  const existingEmail = await Member.findOne({ email: email });
  if (existingEmail) {
    throw new CustomError.BadRequestError("Email is already in use");
  }
  const member = await Member.create(req.body);

  res.status(StatusCodes.CREATED).json({ msg: "Member Created", member });
};
const getAllMembers = async (req, res) => {
  const queryObject = {};
  const members = await Member.find(queryObject);
  res.status(StatusCodes.OK).json({ members });
};
const memberCheckIn = async (req, res) => {
  const { id: memberId } = req.params;
  if (!memberId) {
    throw new CustomError.BadRequestError("Member Id Needs To Be Specified");
  }
  const member = await Member.findOne({ _id: memberId });
  if (!member) {
    throw new CustomError.NotFoundError(`No member with id:${memberId}`);
  }
  const { membershipExpirationDate } = member;
  if (Date.now() > membershipExpirationDate) {
    throw new CustomError.UnauthorizedError("Membership expired");
  }
  res.status(StatusCodes.OK).json({
    checkIn: "SUCCESS",
    member,
    membershipExpirationIn: member.daysUntilExpiration,
  });
};
const renewMembership = async (req, res) => {
  const { id: memberId } = req.params;
  if (!memberId) {
    throw new CustomError.BadRequestError("Member Id Needs To Be Specified");
  }
  const member = await Member.findOne({ _id: memberId });
  if (!member) {
    throw new CustomError.NotFoundError(`No member with id:${memberId}`);
  }
  member.membershipExpirationDate = new Date(
    Date.now() + 1000 * 60 * 60 * 24 * 30
  );
  await member.save({ validateModifiedOnly: true });
  res.status(StatusCodes.OK).json({ renew: "SUCCESS", member });
};
const updateMember = async (req, res) => {
  const { id: memberId } = req.params;
  const { fullName, email, membershipPlan } = req.body;
  if (!memberId) {
    throw new CustomError.BadRequestError("Member Id Needs To Be Specified");
  }
  const member = await Member.findOne({ _id: memberId });
  if (!member) {
    throw new CustomError.NotFoundError(`No member with id:${memberId}`);
  }
  member.fullName = fullName || member.fullName;
  member.email = email || member.email;
  member.membershipPlan = membershipPlan || member.membershipPlan;
  await member.save({ validateModifiedOnly: true });
  res.status(StatusCodes.OK).json({ update: "SUCCESS", member });
};
const deleteMember = async (req, res) => {
  const { id: memberId } = req.params;
  if (!memberId) {
    throw new CustomError.BadRequestError("Member Id Needs To Be Specified");
  }
  const member = await Member.findOneAndDelete({ _id: memberId });
  if (!member) {
    throw new CustomError.NotFoundError(`No member with id:${memberId}`);
  }
  res.status(StatusCodes.OK).json({ delete: "SUCCESS" });
};
//trainers
const registerTrainer = async (req, res) => {
  const { name, username, password } = req.body;
  if (!name || !username || !password) {
    throw new CustomError.BadRequestError("All credientials must be specified");
  }
  const trainer = await Trainer.create({ name, username, password });
  res.status(StatusCodes.OK).json({ trainer });
};
const getAllTrainers = async (req, res) => {
  const queryObject = {};
  const trainers = await Trainer.find(queryObject);
  res.status(StatusCodes.OK).json({ trainers });
};
const getSingleTrainer = async (req, res) => {
  const { id: trainerId } = req.params;
  if (!trainerId) {
    throw new CustomError.BadRequestError("trainer id needs to be specified");
  }
  const trainer = await Trainer.findOne({ _id: trainerId });
  if (!trainer) {
    throw new CustomError.NotFoundError(
      `No trainer found with id:${trainerId}`
    );
  }
  res.status(StatusCodes.OK).json(trainer);
};
const updateTrainer = async (req, res) => {
  const { id: trainerId } = req.params;
  const { name, username } = req.body;
  if (!trainerId) {
    throw new CustomError.BadRequestError("trainer id needs to be specified");
  }
  const trainer = await Trainer.findOne({ _id: trainerId });
  if (!trainer) {
    throw new CustomError.NotFoundError(
      `No trainer found with id:${trainerId}`
    );
  }
  trainer.name = name || trainer.name;
  trainer.username = username || trainer.username;
  await trainer.save({ validateModifiedOnly: true });
  res.status(StatusCodes.OK).json({ trainer });
};
const deleteTrainer = async (req, res) => {
  const { id: trainerId } = req.params;
  if (!trainerId) {
    throw new CustomError.BadRequestError("Trainer Id Needs To Be Specified");
  }
  const trainer = await Member.findOneAndDelete({ _id: trainerId });
  if (!trainer) {
    throw new CustomError.NotFoundError(`No trainer with id:${trainerId}`);
  }
  res.status(StatusCodes.OK).json({ delete: "SUCCESS" });
};

module.exports = {
  registerMember,
  getAllMembers,
  memberCheckIn,
  renewMembership,
  updateMember,
  deleteMember,
  registerTrainer,
  getAllTrainers,
  getSingleTrainer,
  updateTrainer,
  deleteTrainer,
};
