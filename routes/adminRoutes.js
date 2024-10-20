const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermission,
} = require("../middlewares/authentication");

const {
  createStaffMember,
  getAllStaffMembers,
  getStaffMember,
  updateStaffMember,
  deleteStaffMember,
  resetStaffPassword,
} = require("../controllers/adminController");

router
  .route("/")
  .post(authenticateUser, authorizePermission("admin"), createStaffMember)
  .get(authenticateUser, authorizePermission("admin"), getAllStaffMembers);

router
  .route("/resetPassword/:id")
  .patch(authenticateUser, authorizePermission("admin"), resetStaffPassword);

router
  .route("/:id")
  .get(authenticateUser, authorizePermission("admin"), getStaffMember)
  .patch(authenticateUser, authorizePermission("admin"), updateStaffMember)
  .delete(authenticateUser, authorizePermission("admin"), deleteStaffMember);

module.exports = router;
