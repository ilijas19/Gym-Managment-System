const express = require("express");

const router = express.Router();
const {
  authenticateUser,
  authorizePermission,
} = require("../middlewares/authentication");

const {
  addNewClient,
  removeClient,
  sendMailToClient,
  getAllClients,
  findSingleClient,
} = require("../controllers/trainerController");

router
  .route("/")
  .get(authenticateUser, authorizePermission("trainer"), getAllClients)
  .post(authenticateUser, authorizePermission("trainer"), addNewClient);

router
  .route("/:id")
  .get(authenticateUser, authorizePermission("trainer"), findSingleClient)
  .post(authenticateUser, authorizePermission("trainer"), sendMailToClient)
  .delete(authenticateUser, authorizePermission("trainer"), removeClient);

module.exports = router;
