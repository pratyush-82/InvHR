const { object, string, date, array, number, boolean } = require("yup");
const bcrypt = require("bcryptjs");
const Employee = require("../models/Employee.model");
const Designation = require("../models/Designation.model");
const {
  sendResponse,
  requestFail,
  requestSuccess,
} = require("../helpers/RequestResponse.helper");

const {
  generateId,
  pad,
  getAdmin,
  generatePassword,
} = require("../helpers/Common.helper");
const {
  TimeSheetDetailsByEmployee,
} = require("../database/pipelines/TimeSheet.pipeline");
const {
  ReportingEmployeePipeline,
} = require("../database/pipelines/Employee.pipeline");
const { userAccountCreate } = require("../helpers/Mail.helper");

async function create(req, res) {
  const { body } = req;
  const EmpSchema = object({
    avatarbase64: string().required("Picture is required"),
    empStatus: string().required("Emp Status is required"),
    branchType: string().required("Branch is required"),
    empId: string().required("Employee ID is required"),
    name: string().required("Name is required"),
    designation: string().required("Designation is required"),
    email: string()
      .required("Email is required")
      .email("Email must be a valid email address"),
    reportingPerson: string().required("Reporting Person is required"),
    phoneNumber: string().required("Phone number is required"),
    emergencyContact: string().required("Emergency Contact is required"),
    panNumber: string().required("PAN is required"),
    aadharNumber: string().required("Aadhaar Number is required"),
    employeeType: string().required("EmployeeType is required"),
    LOJ: string().required("Location of Joining is required"),
    DOJ: date()
      .required("DOJ is required")
      .typeError("Date of Joining should be a date"),
    DOR: date()
      .nullable(true)
      .when("empStatus", {
        // eslint-disable-next-line no-shadow
        is: (empStatus) => empStatus !== "current employee",
        then: (schema) =>
          schema
            .required("DOR is required")
            .typeError("Date of Relieving should be a date"),
      }),

    maritalStatus: string(),
    gender: string(),
    personalEmail: string(),
    bloodGroup: string(),
    experience: string(),
    DOB: date().nullable(true),
    fatherName: string(),
    address: string(),
    country: string(),
    state: string(),
    city: string(),
    zipCode: string(),
    bankName: string(),
    IFSCCode: string(),
    bankType: string(),
    accountNumber: string(),
    education: string(),
    board: string(),
    percentage: string(),
    yrOfPassing: date().nullable(true),
    technologies: array(),
    organizations: array(),
    totalLeave: string(),
    leaveInBucket: string(),
    availedLeave: string(),
    LOP: string(),
    policyAgreed: boolean(),
  });

  let emp = null;
  try {
    emp = await EmpSchema.validate(body);
    console.log(emp, "emp");
  } catch (e) {
    console.log(e);
    return requestFail(res, e.message + " My error");
  }

  let dbEmployee = null;
  try {
    dbEmployee = await Employee.findOne({ name: emp.name, empId: emp.empId });
    if (dbEmployee) return requestFail(res, "Already existing Employee.");
  } catch (e) {
    return requestFail(res, "Something went wrong1");
  }
  try {
    dbEmployee = await Designation.findOne({ id: emp.designation });
  } catch (error) {
    console.log(error);
  }
  emailEmployee = await Employee.findOne({ email: emp.email });
  if (emailEmployee)
    return requestFail(res, "Employee with this Email Id already exists.");
  emailEmployee = await Employee.findOne({ empId: emp.empId });
  if (emailEmployee)
    return requestFail(res, "Employee with this Employee Id already exists.");
  if (!emp && dbEmployee != null)
    requestFail(res, "Something went wrong. Try again");
  const tempPassword = generatePassword();
  const tempencryptedpass = bcrypt.hashSync(tempPassword, 8);

  try {
    new Employee({
      empId: emp.empId,
      name: emp.name,
      password: tempencryptedpass,
      avatarbase64: emp.avatarbase64,
      designation: emp.designation,
      designationName: dbEmployee.name,
      personalEmail: emp.personalEmail,
      emergencyContact: emp.emergencyContact,
      bloodGroup: emp.bloodGroup,
      reportingPerson: emp.reportingPerson,
      LOJ: emp.LOJ,
      DOB: emp.DOB,
      DOJ: emp.DOJ,
      DOR: emp.DOR,
      maritalStatus: emp.maritalStatus,
      gender: emp.gender,
      branchType: emp.branchType,
      empStatus: emp.empStatus,
      experience: emp.experience,
      employeeType: emp.employeeType,
      aadharNumber: emp.aadharNumber,
      panNumber: emp.panNumber,
      fatherName: emp.fatherName,
      email: emp.email,
      phoneNumber: emp.phoneNumber,
      address: emp.address,
      country: emp.country,
      state: emp.state,
      zipCode: emp.zipCode,
      city: emp.city,
      bankName: emp.bankName,
      IFSCCode: emp.IFSCCode,
      accountNumber: emp.accountNumber,
      aadhaarCard: emp.aadhaarCard,
      panCard: emp.panCard,
      bankDocument: emp.bankDocument,
      degree: emp.degree,
      bankType: emp.bankType,
      organizations: emp.organizations,
      technologies: emp.technologies,
      education: emp.education,
      board: emp.board,
      percentage: emp.percentage,
      yrOfPassing: emp.yrOfPassing,
      totalLeave: "0",
      leaveInBucket: "0",
      availedLeave: "0",
      LOP: "0",
      policyAgreed: false,
    }).save((err, dbResponse) => {
      if (err) {
        console.log("error", err);
        return requestFail(res, 500, "something is wrong");
      } else {
        userAccountCreate({
          to: emp.email,
          userName: emp.name,
          userEmail: emp.email,
          password: tempPassword,
        });
        return requestSuccess(res, dbResponse);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

async function list(req, res) {
  let employees = null;
  try {
    employees = await Employee.aggregate([
      {
        $sort: {
          _id: -1,
        },
      },
    ]);
  } catch (error) {}
  if (!employees)
    return requestFail(res, "Something went wrong can't get Employees");
  return requestSuccess(res, employees);
}

async function update(req, res) {
  try {
    console.log("Update Personal - ", req.body);
    const updateEmp = await Designation.findOne({ id: req.body.designation });

    if (!updateEmp) {
      return requestFail(res, 404, "Designation not found");
    }
    1;
    req.body.designationName = updateEmp.name;
    const { empId, email, ...updateData } = req.body;

    const updateResult = await Employee.updateOne(
      { empId: empId },
      {
        $set: updateData,
      }
    );

    if (updateResult.nModified === 1) {
      return requestSuccess(res, 200, "Update successful");
    } else {
      return requestFail(res, 500, "Update failed");
    }
  } catch (error) {
    console.error(error);
    return requestFail(res, 500, "Something went wrong");
  }
}

async function empsByIL(req, res) {
  try {
    let empsByIL = await Employee.count({
      empId: { $regex: req.body.code },
    });
    console.log(empsByIL, "empsByIL");
    if (empsByIL.length === 0)
      return requestFail(res, 500, "Something went wrong can't get employees");
    if (empsByIL != null) {
      return requestSuccess(
        res,
        200,
        "Successfully get employee details",
        req.body.code + pad(empsByIL + 1)
      );
    }
  } catch (error) {
    console.error(error.message);
  }
}

async function employeeById(req, res) {
  let user = null;
  try {
    user = await Employee.findOne({ empId: req.params.id.toUpperCase() });
  } catch (error) {
    console.error(error.message);
  }
  if (user != null) {
    return requestSuccess(res, 200, "Successfully get employee details", user);
  }
  return requestFail(res, 500, "Something went wrong can't get employee");
}

async function ReportingEmployee(req, res) {
  let reportingPersonsList = null;
  try {
    reportingPersonsList = await Employee.aggregate(
      ReportingEmployeePipeline()
    );
  } catch (error) {
    console.log("error", error.message);
  }

  if (reportingPersonsList && reportingPersonsList.length > 0)
    return requestSuccess(res, reportingPersonsList);

  return requestFail(res, "Can't get employee list");
}

async function policyVerify(req, res) {
  const { body } = req;
  const PolicyAgreementSchema = object({
    policyAgreed: boolean(),
  });

  let reqData = null;

  try {
    reqData = await PolicyAgreementSchema.validate(body);
  } catch (e) {
    return sendResponse(res, 400, e.message);
  }
  if (!reqData) requestFail(res, "Something went wrong, please try again");
  try {
    await Employee.updateOne(
      {
        empId: reqData.empId,
      },
      {
        $set: {
          policyAgreed: reqData.policyAgreed,
        },
      }
    );
    return sendResponse(res, 200, "Policy agreement updated successfully.");
  } catch (error) {
    return requestFail(res, "can't agreed policy");
  }
}

async function TimeSheetDetailsByEmployeeId(req, res) {
  let timeSheet = null;
  try {
    timeSheet = await Employee.aggregate(
      TimeSheetDetailsByEmployee(req.params.empId)
    );
  } catch (error) {
    console.log(error, "error");
  }
  return requestSuccess(res, "successfully get Employee details", timeSheet);
}

module.exports = {
  empsByIL,
  create,
  list,
  update,
  employeeById,
  ReportingEmployee,
  policyVerify,
  TimeSheetDetailsByEmployeeId,
};
