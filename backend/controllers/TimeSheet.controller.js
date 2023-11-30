const { object, string, date } = require("yup");
const {
  sendResponse,
  requestFail,
  requestSuccess,
} = require("../helpers/RequestResponse.helper");
const TimeSheet = require("../models/TimeSheet.model");
const { generateNextNumber, getAdmin } = require("../helpers/Common.helper");
async function createworklog(req, res) {
  let admin = await getAdmin();
  const { body } = req;
  const WorklogSchema = object({
    projectName: string().required("project name is required"),
    start: date().required("start time is required"),
    end: date().required("end time is required"),
    comment: string().required("comment is required"),
  });
  let worklog = null;
  try {
    worklog = await WorklogSchema.validate(body);
  } catch (e) {
    return sendResponse(res, 400, e.message);
  }
  let dbWorklog = null;
  try {
    dbWorklog = await TimeSheet.findOne({ id: worklog.id });
    if (dbWorklog) return requestFail(res, "Project already existing");
  } catch (e) {
    console.log("24", e);
    return requestFail(res, "something went wrong");
    return sendResponse(res, 400, e.message);
  }
  if (!worklog && dbWorklog != null)
    requestFail(res, "Something went wrong. Try again");
  let totalWorklog = 0;
  try {
    totalWorklog = await TimeSheet.find();
  } catch (err) {}
  const Id = `WL${generateNextNumber(totalWorklog.length ?? 0)}`;
  new TimeSheet({
    empId: admin.empId,
    email: admin.email,
    name: admin.name,
    id: Id,
    projectName: worklog.projectName,
    start: worklog.start,
    end: worklog.end,
    comment: worklog.comment,
  }).save((err, dbResponse) => {
    console.log(dbResponse, "responsez");
    if (err) {
      return requestFail(res, 500, "something is wrong");
    } else {
      return requestSuccess(res, dbResponse);
    }
  });
}

async function workloglist(req, res) {
  let worklogs = null;
  try {
    worklogs = await TimeSheet.aggregate([
      {
        $sort: {
          _id: -1,
        },
      },
    ]);
  } catch (error) {}
  if (!worklogs)
    return requestFail(res, "something went wrong can't get worklogs");
  return requestSuccess(res, worklogs);
}

function worklogupdate(req, res) {
  try {
    TimeSheet.updateOne(
      { id: req.body.id },
      {
        $set: {
          start: req.body.start,
          end: req.body.end,
          comment: req.body.comment,
        },
      },
      (error, result) => {
        if (error) return requestFail(res, "something went wrong");
        return sendResponse(res, 200, "update successfully");
      }
    );
  } catch (error) {
    return requestFail(res, 500, "something went wrong");
  }
}

async function worklogById(req, res) {
  let worklogs = null;
  try {
    worklogs = await TimeSheet.findOne({ id: req.params.id });
  } catch (error) {
    console.log(error);
  }
  return requestSuccess(res, worklogs);
}

module.exports = {
  createworklog,
  workloglist,
  worklogupdate,
  worklogById,
};
