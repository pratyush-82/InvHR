const express = require("express");
const router = express.Router();
const controller = require("../controllers/Employee.controller");

//post Methods
router.post("/create", controller.create);
router.post("/empsByIL", controller.empsByIL);
router.post("/policyVerify", controller.policyVerify);

//get Method
router.get("/list", controller.list);
router.get("/listofreportingperson", controller.ReportingEmployee);
router.get("/:id", controller.employeeById);
router.get("/timesheet/:id", controller.TimeSheetDetailsByEmployeeId);

//put Methods
router.put("/update", controller.update);

module.exports = router;
