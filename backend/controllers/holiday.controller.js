const { object, string, date } = require("yup");
const Holiday = require("../models/Holiday.model");
const {
  sendResponse,
  requestFail,
  requestSuccess,
} = require("../helpers/RequestResponse.helper");
const {
  generateId,
  getAdmin,
  generateNextNumber,
} = require("../helpers/Common.helper");
const {
  holidayByIdPipeline,
} = require("../database/pipelines/Holiday.pipeline");

async function create(req, res) {
  const { body } = req;
  const HolidaySchema = object({
    name: string().required("Holiday name is required"),
    details: string().required("Holiday Details is required"),
    date: date().required("date is required"),
    branch: object(),
  });
  let holiday = null;
  try {
    holiday = await HolidaySchema.validate(body);
  } catch (e) {
    return sendResponse(res, 400, e.message);
  }
  let dbHoliday = null;
  try {
    dbHoliday = await Holiday.findOne({ $and: [{ name: holiday.name} , { date:holiday.date }]});
    if (dbHoliday) return requestFail(res, "Already existing Holiday name.");
  } catch (e) {
    return requestFail(res, "Something went wrong");
  }
  if (!holiday && dbHoliday != null)
    requestFail(res, "Something went wrong. Try again");
  let totalHoliday = 0;
  try {
    totalHoliday = await Holiday.find();
  } catch (err) {}

  const Id = `HD${generateNextNumber(totalHoliday.length ?? 0)}`;

  new Holiday({
    id: Id,
    name: holiday.name,
    details: holiday.details,
    date: holiday.date,
    branch: holiday.branch,
  }).save((err, dbResponse) => {
    if (err) {
      return requestFail(res, 500, "something is wrong");
    } else {
      return requestSuccess(res, dbResponse);
    }
  });
}

async function list(req, res) {
  let holidys = null;
  try {
    holidys = await Holiday.aggregate([
      {
        $sort: {
          _id: -1,
        },
      },
    ]);
  } catch (error) {}
  if (!holidys)
    return requestFail(res, "Something went wrong can't get holidys");
  return requestSuccess(res, holidys);
}

async function update(req, res) {
  let dbHoliday = null;
  try {
    dbHoliday = await Holiday.findOne({ $and: [{ name: req.body.name} , { date:req.body.date }]});
    if (dbHoliday) return requestFail(res, "Already existing Holiday name.");
  } catch (e) {
    return requestFail(res, "Something went wrong");
  }
  if (dbHoliday != null)
    requestFail(res, "Something went wrong. Try again");
  try {
    Holiday.updateOne(
      { id: req.body.id },
      {
        $set: {
          name: req.body.name,
          details: req.body.details,
          date: req.body.date,
          branch: req.body.branch,
          updatedBy: "admin.id",
        },
      },
      (error, result) => {
        if (error) return requestFail(res, "Something went wrong");
        return sendResponse(res, 200, "Update successfully");
      }
    );
  } catch (error) {
    return requestFail(res, 500, "something went worng");
  }
}

async function holidayById(req, res) {
  let Holidays = null;
  try {
    Holidays = await Holiday.findOne({ id: req.params.id });
  } catch (error) {
    console.log(error);
  }
  return requestSuccess(res, Holidays);
}

module.exports = {
  create,
  list,
  update,
  holidayById,
};
