const express = require("express");
const router = express.Router();
const controller = require("../controllers/Auth.controller");

router.post("/login", controller.login);
router.post("/register", controller.register);
router.post("/forgot-password", controller.forget);
router.post("/resend-otp", controller.reSendOTP);
router.post("/update-password", controller.changePassword);

module.exports = router;
