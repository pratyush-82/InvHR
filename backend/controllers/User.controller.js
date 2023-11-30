const { object, string, number, date, InferType } = require("yup");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const {
  sendResponse,
  requestFail,
  requestSuccess,
} = require("../helpers/RequestResponse.helper");
const {
  generateId,
  generatePassword,
  getAdmin,
  generateJWT,
} = require("../helpers/Common.helper");

async function register(req, res) {
  const { body } = req;
  // current user
  const admin = await getAdmin(req);
  if (!admin) return requestFail(res, "Authrization error");

  // Customer Schema
  const UserSchema = object({
    name: string(),
    roleId: string().required("Please select user role"),
    email: string()
      .required("Please enter an email")
      .min(3, "Email is to short. Look like you enter a wrong email")
      .email(),
    password: string().min(6, "Password must be greater then 6 "),
  });

  let user = null;

  //   Verify customer schema
  try {
    user = await UserSchema.validate(body);
  } catch (e) {
    return requestFail(res, e.message);
  }

  if (!user) return requestFail(res, "Something went wrong.");

  const encryptedPassword = bcrypt.hashSync(user.password, 8);

  User.findOne({ email: user.email }, (err, dbResponse) => {
    if (dbResponse)
      return requestFail(res, "Entered email is already registerd with us.");

    //   Generate a new id for User
    const userId = `U${generateId(4)}`;

    new User({
      userId: userId,
      userName: user.name,
      email: user.email,
      contact: null,
      password: encryptedPassword,
      status: "inactive",
      roleId: user.roleId,
      createdOn: new Date(),
      updatedOn: new Date(),
      createdBy: admin.id,
      updatedBy: admin.id,
    }).save((err, dbResponse) => {
      if (err) {
        sendResponse(
          res,
          500,
          "Sorry, Something went wrong. Can't register now."
        );
      } else {
        sendResponse(
          res,
          200,
          `Account created for ${user.name} successfully.`,
          {
            id: dbResponse.userId,
            name: dbResponse.userName,
            email: dbResponse.email,
          }
        );
      }
    });
  });
}

module.exports = {
  register,
};
