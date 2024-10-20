const express = require("express");
const router = express.Router();

const {
  authenticateUser,
  authorizePermission,
} = require("../middlewares/authentication");

const {
  staffLogin,
  trainerLogin,
  logout,
  showCurrentUser,
} = require("../controllers/authController");

router.post("/trainerLogin", trainerLogin);
router.post("/login", staffLogin);
router.get("/logout", authenticateUser, logout);
router.get("/showMe", authenticateUser, showCurrentUser);

module.exports = router;
