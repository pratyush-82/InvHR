const { object, string } = require("yup");
const User = require("../models/User.model");
const {
  sendResponse,
  requestFail,
  requestSuccess,
} = require("../helpers/RequestResponse.helper");
const Employee = require("../models/Employee.model");
var bcrypt = require("bcryptjs");
const {
  generateJWT,
  generateId,
  generateOTP,
  getAdmin,
  getCurrentEmployee,
} = require("../helpers/Common.helper");
const { sendForgetOTP, sendOTP } = require("../helpers/Mail.helper");
const jwt = require("jsonwebtoken");
const { jwtToken } = require("../configs/auth.config");
const {
  empByIdPipeline,
} = require("../database/pipelines/Designation.pipeline");

async function login({ body }, res) {
  const LoginSchema = object({
    empId: string().required("please Enter EmpId"),
    password: string().min(3, "Password is required"),
  });

  let reqData = null;

  try {
    reqData = await LoginSchema.validate(body);
  } catch (e) {
    return requestFail(res);
  }

  let employee = null;
  try {
    employee = await Employee.aggregate(
      empByIdPipeline({ empId: reqData.empId })
    );
    employee = employee[0];
  } catch (error) {}

  if (!employee) return requestFail(res, "Invalid Credentials.");
  if (employee.empStatus !== "current employee")
    return requestFail(
      res,
      "You can't Login to your account. Maybe you are Ex Employee"
    );

  const isPasswordMatch = await bcrypt.compare(
    reqData.password,
    employee.password
  );

  if (!isPasswordMatch) return requestFail(res, "EmpId or Password is wrong.");

  const responseData = {
    empId: employee.empId ? employee.empId : employee.empId,
    name: employee.userName ? employee.userName : employee.name,
    email: employee.email,
    designation: employee.designation,
    empStatus: employee.empStatus,
    policyAgreed: employee.policyAgreed,
  };

  return requestSuccess(res, "Successfully Login", {
    ...responseData,
    permissions: employee.permissions,
    avatarbase64: employee.avatarbase64,
    token: generateJWT(responseData),
  });
}

async function register(req, res) {
  const RegisterSchema = object({
    name: string().min(2, "Name is to short"),
    email: string()
      .required("Please enter an email")
      .min(3, "Email is to short. Look like you enter a wrong email")
      .email(),
    password: string().min(6, "Password must be greater then 6"),
  });

  let reqData = null;
  try {
    reqData = await RegisterSchema.validate(req.body);
  } catch (e) {
    return requestFail(res, e.message);
  }

  if (!reqData) return requestFail(res);

  let dbUser = null;

  try {
    dbUser = await User.findOne({ email: reqData.email });
  } catch (error) {}

  if (dbUser)
    return requestFail(res, "Email address already registered successfully");

  const encryptedPassword = bcrypt.hashSync(reqData.password, 8);
  const geneUserId = `U${generateId(10)}`;

  new User({
    id: geneUserId,
    name: reqData.name,
    mobile: "",
    email: reqData.email,
    password: encryptedPassword,
    emailVerified: true,
    status: "active",
    createdOn: new Date(),
    updatedOn: new Date(),
    createdBy: geneUserId,
    updatedBy: geneUserId,
  }).save((err, dbRes) => {
    if (err) return requestFail(res, "Can't register an account");

    let data = {
      id: dbRes.id,
      name: dbRes.name,
      email: dbRes.email,
    };

    return requestSuccess(
      res,
      `Hi ${dbRes.name}, You are registered successfully with us.`,
      {
        name: dbRes.name,
        email: dbRes.email,
        token: generateJWT(data),
      }
    );
  });
}

async function forget(req, res) {
  const { body } = req;
  const forgetSchema = object({
    email: string()
      .required("Please enter an email")
      .min(3, "Email is to short. Look like you enter a wrong email")
      .email(),
  });

  let reqData = null;

  try {
    reqData = await forgetSchema.validate(body);
  } catch (e) {
    return sendResponse(res, 400, e.message);
  }

  let employee = null;

  try {
    employee = await Employee.findOne({ email: reqData.email }).exec();
  } catch (error) {
    return requestFail(res, "Something went wrong");
  }

  if (!employee)
    return requestFail(
      res,
      "Can't find any account associated with this email address"
    );

  const OTP = generateOTP();
  sendForgetOTP(employee.email, OTP);
  return requestSuccess(res, `OTP sent to your register email address`, {
    otpToken: jwt.sign({ empId: employee.empId }, jwtToken + OTP, {
      expiresIn: 600,
    }),
    email: employee.email,
  });
}

async function reSendOTP(req, res) {
  let currentEmployee = await getAdmin(req);

  if (!currentEmployee) return requestFail(res);

  let employee = null;

  employee = await Employee.findOne({ email: currentEmployee.email });

  if (!employee)
    requestFail(
      res,
      "Something went wrong with employee" + JSON.stringify(currentEmployee)
    );

  const OTP = generateOTP();
  sendOTP(employee.email, OTP);
  const data = {
    otpToken: jwt.sign({}, jwtToken + OTP, { expiresIn: 600 }),
  };

  return requestSuccess(res, data);
}

async function changePassword(req, res) {
  const { body } = req;
  const changePasswordSchema = object({
    password: string().min(6, "Password must be greater then 6 ").required(),
    otp: string().required(),
    otpToken: string().required("Something went wrong."),
  });

  let reqData = null;

  try {
    reqData = await changePasswordSchema.validate(body);
  } catch (e) {
    return sendResponse(res, 400, e.message);
  }

  let otpTokenResult = null;

  try {
    otpTokenResult = jwt.verify(reqData.otpToken, jwtToken + reqData.otp);
  } catch (error) {
    return requestFail(res, "You entered wrong otp");
  }

  if (!otpTokenResult) return requestFail(res, "You entered wrong otp");

  let employee = null;
  try {
    employee = await Employee.findOne({ empId: otpTokenResult.empId });
  } catch (error) {
    return requestFail(res, "Something went wrong");
  }

  if (!employee)
    return requestFail(
      res,
      "Can't find any account associated with this email address"
    );

  let encryptedPassword = bcrypt.hashSync(reqData.password, 8);

  try {
    Employee.updateOne(
      { empId: otpTokenResult.empId },
      {
        $set: {
          password: encryptedPassword,
          updatedBy: otpTokenResult.id,
          updatedOn: new Date(),
        },
      },
      async (error, result) => {
        if (error || result.modifiedCount == 0) {
          return requestFail(res, "Can't change password right now.");
        } else {
          return requestSuccess(res, "Password change successfully.");
        }
      }
    );
  } catch (error) {
    return requestFail(res, "Can't change password now.");
  }
}

module.exports = {
  login,
  register,
  forget,
  reSendOTP,
  changePassword,
};
