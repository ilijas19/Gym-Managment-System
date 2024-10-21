const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/staffController");
const {
  authenticateUser,
  authorizePermission,
} = require("../middlewares/authentication");

//member
router
  .route("/member/")
  .post(authenticateUser, authorizePermission("staff"), registerMember)
  .get(authenticateUser, authorizePermission("staff"), getAllMembers);

router
  .route("/member/:id")
  .get(authenticateUser, authorizePermission("staff"), memberCheckIn)
  .patch(authenticateUser, authorizePermission("staff"), updateMember)
  .delete(authenticateUser, authorizePermission("staff"), deleteMember);

router
  .route("/renew/:id")
  .patch(authenticateUser, authorizePermission("staff"), renewMembership);

//trainer
router
  .route("/trainer/")
  .post(authenticateUser, authorizePermission("staff"), registerTrainer)
  .get(authenticateUser, authorizePermission("staff"), getAllTrainers);

router
  .route("/trainer/:id")
  .get(authenticateUser, authorizePermission("staff"), getSingleTrainer)
  .patch(authenticateUser, authorizePermission("staff"), updateTrainer)
  .delete(authenticateUser, authorizePermission("staff"), deleteTrainer);
module.exports = router;
