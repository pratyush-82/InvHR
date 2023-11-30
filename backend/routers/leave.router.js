const express = require("express");
const router = express.Router();
const controller = require("../controllers/Leave.controller");

//post Methods
router.post("/type/create", controller.createLeaveType);
// get methods
router.get("/type/list", controller.LeaveTypeList);
router.get("/type/:id", controller.LeaveTypeById);
// put methods
router.put("/type/update", controller.LeaveTypeUpdate);

// Leave Category
router.post("/category/create", controller.createleaveCategory);
// get methods
router.get("/category/list", controller.LeaveCategoryList);
router.get("/category/:id", controller.LeaveCategoryById);
// put methods
router.put("/category/update", controller.LeaveCategoryUpdate);

// Leave
router.post("/leaverequest", controller.CreateLeave);
router.get("/leaverequest/list", controller.LeaveList);
router.get("/leaverequest/:id", controller.LeaveById);
router.put("/leaverequest/update", controller.LeaveUpdate);
router.delete("/leaverequest/delete", controller.LeaveDelete);

// Leave Management
router.get("/management/list", controller.EmpListByReportingPerson);
router.put("/request/update", controller.LeaveRequestUpdateByManagement);
router.get("/request/:id", controller.LeaveRequestById);
module.exports = router;
