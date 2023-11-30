const express = require("express");
const router = express.Router();
const controller = require("../controllers/Appraisal.controller");
// Methods
router.post("/create", controller.create);
router.get("/listEmployeeAppraisal", controller.list);
router.put("/updateEmployeeAppraisal/:id", controller.update);
router.get("/:id", controller.appraisalById);
router.delete("/employeeAppraisal/delete", controller.EmployeeAppraisalDelete);
module.exports = router;
