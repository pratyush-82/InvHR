const { object, string, date } = require("yup");
const Policy = require("../models/Policy.model");
const {
  sendResponse,
  requestFail,
  requestSuccess,
} = require("../helpers/RequestResponse.helper");
const { generateNextNumber } = require("../helpers/Common.helper");
async function create(req, res) {
  const { body } = req;
  const PolicySchema = object({
    name: string().required("Name is required"),
    description: string().required("description is required"),
    status: string().required("status is required"),
    document: string().required("document is required"),
    date: date().required("Effective from date is required"),
  });
  let policy = null;
  try {
    policy = await PolicySchema.validate(body);
  } catch (e) {
    return sendResponse(res, 400, e.message);
  }
  let dbPolicy = null;
  try {
    dbPolicy = await Policy.findOne({ name: policy.name });
    console.log(dbPolicy);
    if (dbPolicy) return requestFail(res, "Already existing Policy.");
  } catch (e) {
    return requestFail(res, "Something went wrong");
  }
  if (!policy && dbPolicy != null)
    requestFail(res, "Something went wrong. Try again");
  let totalPolicy = 0;
  try {
    totalPolicy = await Policy.find();
  } catch (err) {}

  const Id = `POL${generateNextNumber(totalPolicy.length ?? 0)}`;
  new Policy({
    id: Id,
    name: policy.name,
    description: policy.description,
    status: policy.status,
    document: policy.document,
    date: policy.date,
  }).save((err, dbResponse) => {
    if (err) {
      return requestFail(res, 500, "something is wrong");
    } else {
      return requestSuccess(res, dbResponse);
    }
  });
}

async function list(req, res) {
  let policies = null;
  try {
    policies = await Policy.aggregate([
      {
        $sort: {
          _id: -1,
        },
      },
    ]);
  } catch (error) {}
  if (!policies)
    return requestFail(res, "Something went wrong can't get policies");
  return requestSuccess(res, policies);
}

async function update(req, res) {
  try {
    Policy.updateOne(
      { id: req.body.id },
      {
        $set: {
          name: req.body.name,
          description: req.body.description,
          status: req.body.status,
          document: req.body.document,
          date: req.body.date,
          updatedBy: "admin.id",
        },
      },
      (error, result) => {
        if (error) return requestFail(res, "Something went wrong");
        return sendResponse(res, 200, "Update successfully");
      }
    );
  } catch (error) {
    return requestFail(res, 500, "something went wrong");
  }
}

async function policyById(req, res) {
  let Policies = null;
  try {
    Policies = await Policy.findOne({ id: req.params.id });
  } catch (error) {
    console.log(error);
  }
  return requestSuccess(res, Policies);
}
module.exports = {
  create,
  list,
  update,
  policyById,
};
