const express = require("express");
const router = express.Router();
const controller = require("../controllers/TimeSheet.controller");

// post Methods
router.post("/worklog/create", controller.createworklog);

//get Method
router.get("/worklog/list", controller.workloglist);
router.get("/worklog/:id", controller.worklogById);

//put Method
router.put("/worklog/update", controller.worklogupdate);

module.exports = router;
