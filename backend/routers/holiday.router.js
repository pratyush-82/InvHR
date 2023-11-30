const express = require("express");
const router = express.Router();
const controller = require("../controllers/holiday.controller");

//post Methods
router.post("/create", controller.create);

//get Method
router.get("/list", controller.list);
router.get("/:id", controller.holidayById);

// //put Methods
router.put("/update", controller.update);

module.exports = router;
