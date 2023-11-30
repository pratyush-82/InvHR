const express = require("express");
const router = express.Router();
const controller = require("../controllers/Designation.controller");

router.post("/create", controller.Create);
router.get("/list", controller.List);
router.get("/:id", controller.DesignationById);
router.put("/update", controller.Update);
module.exports = router;
