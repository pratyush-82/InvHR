const { object, string, array } = require("yup");
const Designation = require("../models/Designation.model");
const { generateNextNumber } = require("../helpers/Common.helper");
const {
  requestFail,
  requestSuccess,
  sendResponse,
} = require("../helpers/RequestResponse.helper");

async function Create(req, res) {
  const { body } = req;
  const DesignationSchema = object({
    name: string().required("name is required"),
    description: string().required("description is required"),
    permission: object(),
    status: string().required("status is required"),
  });
  let designation = null;
  try {
    designation = await DesignationSchema.validate(body);
  } catch (e) {
    return requestFail(res, 400, e.message);
  }
  let dbDesignation = null;
  try {
    dbDesignation = await Designation.findOne({ name: designation.name });
    if (dbDesignation)
      return requestFail(res, "Same desgination is already exist");
  } catch (e) {
    return requestFail(res, "Something went wrong");
  }
  if (!designation && dbDesignation != null)
    requestFail(res, "Something went wrong. Try again");
  let totalDesignation = 0;
  try {
    totalDesignation = await Designation.find();
  } catch (err) {}
  const id = `D${generateNextNumber(totalDesignation.length ?? 0)}`;
  new Designation({
    id: id,
    name: designation.name,
    description: designation.description,
    permission: designation.permission,
    status: designation.status,
  }).save((err, dbResponse) => {
    if (err) {
      return requestFail(res, 500, "something went wrong");
    } else {
      return requestSuccess(res, dbResponse);
    }
  });
}

async function List(req, res) {
  let designations = null;
  try {
    designations = await Designation.aggregate([
      {
        $sort: {
          _id: -1,
        },
      },
    ]);
  } catch (error) {}
  if (!designations)
    return requestFail(res, "Something went wrong can't get designation");
  return requestSuccess(res, designations);
}

async function DesignationById(req, res) {
  let designations = null;
  try {
    designations = await Designation.findOne({
      id: req.params.id.toUpperCase(),
    });
  } catch (error) {
    console.log(error.message);
  }
  return requestSuccess(res, designations);
}

async function Update(req, res) {
  try {
    Designation.updateOne(
      { id: req.body.id },
      {
        $set: {
          name: req.body.name,
          description: req.body.description,
          permission: req.body.permission,
          status: req.body.status,
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

module.exports = {
  Create,
  DesignationById,
  List,
  Update,
};
