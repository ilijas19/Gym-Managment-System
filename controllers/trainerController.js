const Trainer = require("../models/Trainer");
const Member = require("../models/Member");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const sendMail = require("../utils/sendMail");

const addNewClient = async (req, res) => {
  const loggedTrainer = await Trainer.findOne({ _id: req.user.userId });
  if (!loggedTrainer) {
    throw new CustomError.UnauthenticatedError("No logged trainer");
  }
  const { id: clientId } = req.body;
  if (!clientId) {
    throw new CustomError.BadRequestError("Client id needs to be specified");
  }
  const client = await Member.findOne({ _id: clientId });
  if (!client) {
    throw new CustomError.NotFoundError(`No Member with id: ${clientId}`);
  }
  if (loggedTrainer.clients.includes(client._id)) {
    throw new CustomError.BadRequestError("already in your clients");
  }
  client.membershipPlan = "individual";
  client.trainer = loggedTrainer._id;
  loggedTrainer.clients.push(client._id);
  await client.save({ validateModifiedOnly: true });
  await loggedTrainer.save({ validateModifiedOnly: true });
  res.status(StatusCodes.OK).json({ msg: "Client Added", client });
};

const removeClient = async (req, res) => {
  const loggedTrainer = await Trainer.findOne({ _id: req.user.userId });
  if (!loggedTrainer) {
    throw new CustomError.UnauthenticatedError("No logged trainer");
  }
  const { id: clientId } = req.params;
  if (!clientId) {
    throw new CustomError.BadRequestError("Client id needs to be specified");
  }
  const client = await Member.findOne({
    _id: clientId,
    trainer: loggedTrainer._id,
  });
  if (!client) {
    throw new CustomError.NotFoundError(
      `You Have No Client with id: ${clientId}`
    );
  }
  client.trainer = null;
  client.membershipPlan = "open-gym";
  // Remove the client from the trainer's client list
  loggedTrainer.clients = loggedTrainer.clients.filter(
    (clientObjId) => clientObjId.toString() !== clientId
  );

  await client.save({ validateModifiedOnly: true });
  await loggedTrainer.save({ validateModifiedOnly: true });

  res.status(StatusCodes.OK).json({ msg: "Client removed" });
};

const getAllClients = async (req, res) => {
  const loggedTrainer = await Trainer.findOne({
    _id: req.user.userId,
  }).populate("clients");
  if (!loggedTrainer) {
    throw new CustomError.UnauthenticatedError("No logged trainer");
  }

  res.status(StatusCodes.OK).json({
    clients: loggedTrainer.clients,
    count: loggedTrainer.clients.length,
  });
};

const findSingleClient = async (req, res) => {
  const { id: clientId } = req.params;
  if (!clientId) {
    throw new CustomError.BadRequestError("client id needs to be provided");
  }
  const client = await Member.findOne({
    _id: clientId,
    trainer: req.user.userId,
  });
  if (!client) {
    throw new CustomError.NotFoundError(
      `You have no client with id: ${clientId}`
    );
  }
  res.status(StatusCodes.OK).json({ client });
};

const sendMailToClient = async (req, res) => {
  const { id: clientId } = req.params;
  if (!clientId) {
    throw new CustomError.BadRequestError("client id needs to be provided");
  }
  const client = await Member.findOne({
    _id: clientId,
    trainer: req.user.userId,
  });
  if (!client) {
    throw new CustomError.NotFoundError(
      `You have no client with id: ${clientId}`
    );
  }
  const { message } = req.body;
  if (!message) {
    throw new CustomError.BadRequestError(
      "Message For Client Must Be Provided"
    );
  }
  await sendMail({ to: client.email, message });
  res.status(StatusCodes.OK).json({ msg: "Mail sent to client" });
};

module.exports = {
  addNewClient,
  removeClient,
  sendMailToClient,
  getAllClients,
  findSingleClient,
};
