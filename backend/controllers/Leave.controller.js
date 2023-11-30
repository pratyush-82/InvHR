const { object, string, date } = require("yup"),
  {
    sendResponse,
    requestFail,
    requestSuccess,
  } = require("../helpers/RequestResponse.helper"),
  Employee = require("../models/Employee.model"),
  LeaveType = require("../models/LeaveType.model"),
  LeaveCategory = require("../models/LeaveCategory.model"),
  Leave = require("../models/Leave.model"),
  Holiday = require("../models/Holiday.model"),
  {
    generateNextNumber,
    getAdmin,
    countDaysBetweenDates,
  } = require("../helpers/Common.helper"),
  {
    EmployeeByReportingPerson,
    EmployeeLeaveList,
  } = require("../database/pipelines/Leave.pipeline"),
  {
    sendLeave,
    sendApprovedLeave,
    sendRejectedLeave,
  } = require("../helpers/Mail.helper");

// ********************* LEAVE TYPE **************** //
async function createLeaveType(req, res) {
  const { body } = req;
  const LeaveTypeSchema = object({
    name: string().required("Leave Type Name is required"),
  });
  let leaveType = null;
  try {
    leaveType = await LeaveTypeSchema.validate(body);
  } catch (e) {
    return sendResponse(res, 400, e.message);
  }
  let dbLeaveType = null;
  try {
    dbLeaveType = await LeaveType.findOne({
      name: leaveType.name,
    });
    if (dbLeaveType) return requestFail(res, "Leave Type is already existing");
  } catch (e) {
    return requestFail(res, "something went wrong");
    return sendResponse(res, 400, e.message);
  }
  if (!leaveType && dbLeaveType != null)
    requestFail(res, "Something went wrong. Try again");
  let totalLeaveType = 0;
  try {
    totalLeaveType = await LeaveType.find();
  } catch (err) {}
  const Id = `LT${generateNextNumber(totalLeaveType.length ?? 0)}`;
  new LeaveType({
    id: Id,
    name: leaveType.name,
  }).save((err, dbResponse) => {
    if (err) {
      return requestFail(res, 500, "Something is wrong");
    } else {
      return requestSuccess(res, dbResponse);
    }
  });
}

async function LeaveTypeList(req, res) {
  let leaveTypes = null;
  try {
    leaveTypes = await LeaveType.aggregate([
      {
        $sort: {
          _id: -1,
        },
      },
    ]);
  } catch (error) {}
  if (!leaveTypes)
    return requestFail(res, "Something went wrong can't get leave type");
  return requestSuccess(res, leaveTypes);
}

async function LeaveTypeUpdate(req, res) {
  try {
    LeaveType.updateOne(
      { id: req.body.id },
      {
        $set: {
          name: req.body.name,
        },
      },
      (error, result) => {
        if (error) return requestFail(res, "Something went wrong");
        return sendResponse(res, 200, "update successfully");
      }
    );
  } catch (error) {
    return requestFail(res, 500, "Something went wrong");
  }
}

async function LeaveTypeById(req, res) {
  let leavetypes = null;
  try {
    leavetypes = await LeaveType.findOne({ id: req.params.id });
  } catch (error) {}
  return requestSuccess(res, leavetypes);
}

// ****************** LEAVE CATEGORY ********************//
async function createleaveCategory(req, res) {
  const { body } = req;
  const LeaveCategorySchema = object({
    name: string().required("Leave Category Name is required"),
  });
  let leaveCategory = null;
  try {
    leaveCategory = await LeaveCategorySchema.validate(body);
  } catch (e) {
    return sendResponse(res, 400, e.message);
  }
  let dbLeaveCategory = null;
  try {
    dbLeaveCategory = await LeaveCategory.findOne({
      name: leaveCategory.name,
    });
    if (dbLeaveCategory)
      return requestFail(res, "Leave category is already existing");
  } catch (e) {
    return requestFail(res, "Something went wrong");
    return sendResponse(res, 400, e.message);
  }
  if (!leaveCategory && dbLeaveCategory != null)
    requestFail(res, "Something went wrong.Try again");
  let totalLeaveCategory = 0;
  try {
    totalLeaveCategory = await LeaveCategory.find();
  } catch (err) {}
  const Id = `LC${generateNextNumber(totalLeaveCategory.length ?? 0)}`;
  new LeaveCategory({
    id: Id,
    name: leaveCategory.name,
  }).save((err, dbResponse) => {
    if (err) {
      return requestFail(res, 500, "Something is wrong");
    } else {
      return requestSuccess(res, dbResponse);
    }
  });
}

async function LeaveCategoryList(req, res) {
  let leaveCategorys = null;
  try {
    leaveCategorys = await LeaveCategory.aggregate([
      {
        $sort: {
          _id: -1,
        },
      },
    ]);
  } catch (error) {}
  if (!leaveCategorys)
    return requestFail(
      res,
      "Something went wrong can't get leave categroy list."
    );
  return requestSuccess(res, leaveCategorys);
}

async function LeaveCategoryUpdate(req, res) {
  try {
    LeaveCategory.updateOne(
      {
        id: req.body.id,
      },
      {
        $set: {
          name: req.body.name,
        },
      },
      (error, result) => {
        if (error) return requestFail(res, "Something went wrong");
        return sendResponse(res, 200, "Update successfully");
      }
    );
  } catch (error) {
    return requestFail(res, 500, "Something went wrong");
  }
}

async function LeaveCategoryById(req, res) {
  let leaveCategorys = null;
  try {
    leaveCategorys = await LeaveCategory.findOne({
      id: req.params.id,
    });
  } catch (error) {
    console.log(error);
  }
  return requestSuccess(res, leaveCategorys);
}

// ************** Leave ****************** //
async function CreateLeave(req, res) {
  let admin = await getAdmin();
  console.log(admin.empId, "admin");
  const { body } = req;
  const LeaveSchema = object({
    leaveType: string().required("Leave Type is required"),
    leaveCategory: string().required("Leave Category is required"),
    startDate: date().required("start date is required"),
    endDate: date().required("end date is required"),
    reportingPerson: string().required("reporting preson is required"),
    reportingPersonId: string().required("reporting preson Id is required"),
    leaveCause: string().required("leave cause is required"),
  });
  let leave = null;
  try {
    leave = await LeaveSchema.validate(body);
  } catch (e) {
    return sendResponse(res, 400, e.message);
  }
  let dbLeave = null;
  let dbEmp = null;
  try {
    dbLeave = await Leave.findOne({
      id: leave.id,
    });
    if (dbLeave) return requestFail(res, "Leave is already existing");
  } catch (e) {
    return requestFail(res, "Something went wrong");
    return sendResponse(res, 400, e.message);
  }
  try {
    dbEmp = await Employee.findOne({ name: leave.reportingPerson });
  } catch (error) {
    console.log(error);
  }
  if (!leave && dbLeave != null)
    requestFail(res, "Something went worng. Try again");
  let totalLeave = 0;
  try {
    totalLeave = await Leave.find();
  } catch (err) {}
  const Id = `LEV${generateNextNumber(totalLeave.length ?? 0)}`;
  new Leave({
    empId: admin.empId,
    email: admin.email,
    name: admin.name,
    leaveInBucket: admin.leaveInBucket,
    LOP: admin.LOP,
    id: Id,
    leaveType: leave.leaveType,
    leaveCategory: leave.leaveCategory,
    startDate: leave.startDate,
    endDate: leave.endDate,
    reportingPersonId: dbEmp.empId,
    reportingPerson: dbEmp.name,
    reportingPersonEmail: dbEmp.email,
    leaveCause: leave.leaveCause,
    status: leave.status,
  }).save((err, dbResponse) => {
    if (err) {
      return requestFail(res, 500, "Something is wrong");
    } else {
      sendLeave({
        id: Id,
        name: admin.name,
        empId: admin.empId,
        reportingPersonName: dbEmp.name,
        leaveCause: leave.leaveCause,
        email: admin.email,
        reportingPersonEmail: dbEmp.email,
      });
      console.log(dbResponse, "dbResponse");
      return requestSuccess(res, dbResponse);
    }
  });
}

async function LeaveList(req, res) {
  let admin = await getAdmin();
  console.log(admin, "Admin 285");
  let leaves = null;
  try {
    leaves = await Leave.aggregate(EmployeeLeaveList(admin.empId));
    console.log(EmployeeLeaveList(admin.empId), "aggreg");
    console.log(leaves, "Leaves");
  } catch (error) {}
  if (leaves === 0) return requestFail(res, "can't find any Leave");
  return requestSuccess(res, leaves);
}

async function LeaveUpdate(req, res) {
  try {
    Leave.updateOne(
      { id: req.body.id },
      {
        $set: {
          leaveCategory: req.body.leaveCategory,
          leaveType: req.body.leaveType,
          leaveCause: req.body.leaveCause,
          endDate: req.body.endDate,
          startDate: req.body.startDate,
        },
      },
      (error, result) => {
        if (error) return requestFail(res, "something went wrong");
        return sendResponse(res, 200, "Update successfully");
      }
    );
  } catch (error) {
    return requestFail(res, 500, "Something went wrong");
  }
}

async function LeaveById(req, res) {
  let leaves = null;
  try {
    leaves = await Leave.findOne({ id: req.params.id });
  } catch (error) {
    console.log(error);
  }
  return requestSuccess(res, leaves);
}

async function LeaveDelete(req, res) {
  let leaves = null;
  try {
    leaves = await Leave.deleteOne({ id: req.body.id });
  } catch (error) {
    console.log(error);
  }
  return requestSuccess(res, leaves);
}

// **************** Leave Management *************** //
async function EmpListByReportingPerson(req, res) {
  let admin = await getAdmin();
  let leaveRequest = null;
  try {
    leaveRequest = await Leave.aggregate(
      EmployeeByReportingPerson(admin.empId)
    );
  } catch (error) {}
  if (!leaveRequest || leaveRequest === 0)
    return requestFail(res, "Can't find any Leave Request.");
  return requestSuccess(res, leaveRequest);
}

async function LeaveRequestById(req, res) {
  let leaveRequests = null;
  try {
    leaveRequests = await Leave.findOne({ id: req.params.id });
    console.log(leaveRequests, "leave Request");
  } catch (error) {
    console.log(error);
  }
  if (leaveRequests != null) {
    return requestSuccess(
      res,
      200,
      "SUccessfully get Leave request details",
      leaveRequests
    );
  }
  return requestFail(
    res,
    500,
    "Something went wrong can't get Leave request details."
  );
}

async function LeaveRequestUpdateByManagement(req, res) {
  const admin = await getAdmin(),
    employee = Employee.findOne({ empId: req.body.empId }),
    leaveFormDate = new Date(req.body.startDate),
    leaveToDate = new Date(req.body.endDate),
    holidays = await Holiday.find({
      createdAt: {
        $gte: leaveFormDate,
        $lte: leaveToDate,
      },
    }),
    LeaveResult = await Leave.updateOne(
      { id: req.body.id },
      {
        $set: {
          leaveCategory: req.body.leaveCategory,
          leaveType: req.body.leaveType,
          leaveCause: req.body.leaveCause,
          endDate: req.body.endDate,
          startDate: req.body.startDate,
          comment: req.body.comment,
          status: req.body.status,
          approvedBy: admin.email,
        },
      }
    );
  let LeaveDays = countDaysBetweenDates(req.body.startDate, req.body.endDate);

  if (LeaveResult.modifiedCount > 0) {
    let employeeLeaveInBucket = parseInt(employee.leaveInBucket) || 0;
    let employeeLOP = parseInt(employee.LOP) || 0;
    let employeeAvailedLeave = parseInt(employee.availedLeave) || 0;

    const status = req.body.status.toLowerCase();

    switch (status) {
      case "approved":
        LeaveDays += holidays.length || 0;

        if (employeeLeaveInBucket < LeaveDays) {
          const calculateLOP = LeaveDays - employeeLeaveInBucket;
          employeeLeaveInBucket = 0;
          employeeLOP += calculateLOP;
        } else {
          employeeLeaveInBucket -= LeaveDays;
        }

        employeeAvailedLeave += LeaveDays;

        await Employee.updateOne(
          { empId: req.body.empId },
          {
            $set: {
              leaveInBucket: employeeLeaveInBucket,
              LOP: employeeLOP,
              availedLeave: employeeAvailedLeave,
            },
          }
        );

        sendApprovedLeave({
          id: req.body.id,
          name: req.body.name,
          empId: req.body.empId,
          reportingPersonName: req.body.reportingPerson,
          leaveCause: req.body.leaveCause,
          comment: req.body.comment,
          LeaveDays: req.body.LeaveDays,
          email: req.body.email,
          reportingPersonEmail: req.body.email,
        });
        break;

      case "rejected":
        sendRejectedLeave({
          id: req.body.id,
          name: req.body.name,
          empId: req.body.empId,
          reportingPersonName: req.body.reportingPerson,
          leaveCause: req.body.leaveCause,
          comment: req.body.comment,
          LeaveDays: req.body.LeaveDays,
          email: req.body.email,
          reportingPersonEmail: req.body.email,
        });
        break;
    }
    return requestSuccess(res, "update Successfully");
  } else {
    return requestFail(res, "Something went wrong.");
  }
}

module.exports = {
  // Leave Type
  createLeaveType,
  LeaveTypeList,
  LeaveTypeUpdate,
  LeaveTypeById,

  // Leave Category
  createleaveCategory,
  LeaveCategoryList,
  LeaveCategoryUpdate,
  LeaveCategoryById,

  // Leave
  CreateLeave,
  LeaveList,
  LeaveUpdate,
  LeaveById,
  LeaveDelete,

  // Leave Managment
  EmpListByReportingPerson,
  LeaveRequestUpdateByManagement,
  LeaveRequestById,
};
