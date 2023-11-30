const { object, string, date } = require("yup");
const Project = require("../models/Project.model");
const Employee = require("../models/Employee.model");
const {
  sendResponse,
  requestFail,
  requestSuccess,
} = require("../helpers/RequestResponse.helper");
const { generateNextNumber } = require("../helpers/Common.helper");
async function create(req, res) {
  const { body } = req;
  const ProjectSchema = object({
    name: string().required("Name is required"),
    projectHead: string().required("Project Head is required"),
    status: string().required("Project status is required"),
    description: string().required("description is required"),
    startDate: date().required("Project Start Date is required"),
    visibility: string(),
  });
  let project = null;
  try {
    project = await ProjectSchema.validate(body);
    console.log("project", project);
  } catch (e) {
    return sendResponse(res, 400, e.message);
  }
  let dbProject = null;
  try {
    dbProject = await Project.findOne({ name: project.name });
    console.log(dbProject, "db");
    if (dbProject) return requestFail(res, "already existing project");
  } catch (e) {
    return requestFail(res, "Something went wrong");
  }
  if (!project && dbProject != null)
    requestFail(res, "Something went wrong, try again");
  let totalProject = 0;
  try {
    totalProject = await Project.find();
  } catch (err) {}
  const Id = `PROJ${generateNextNumber(totalProject.length ?? 0)}`;
  console.log("id", Id);
  console.log("Data: ", project);
  new Project({
    id: Id,
    name: project.name,
    description: project.description,
    projectHead: project.projectHead,
    startDate: project.startDate,
    status: project.status,
    visibility: project.visibility,
  }).save((err, dbResponse) => {
    if (err) {
      return requestFail(res, 500, `something is wrong: ${err}`);
    } else {
      console.log(dbResponse, "response");
      return requestSuccess(res, dbResponse);
    }
  });
}
async function list(req, res) {
  let projects = null;
  try {
    projects = await Project.aggregate([
      {
        $sort: {
          _id: -1,
        },
      },
    ]);
  } catch (error) {}
  if (!projects)
    return requestFail(res, "Something went wrong can't get projects");
  return requestSuccess(res, projects);
}
async function projectHead(req, res) {
  let employees = null;
  try {
    employees = await Employee.aggregate([
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $project: {
          empId: 1, // Include the _id field
          name: 1, // Include the name field
        },
      },
    ]);
  } catch (error) {}
  if (!employees)
    return requestFail(res, "Something went wrong can't get Employees");
  return requestSuccess(res, employees);
}

function update(req, res) {
  try {
    Project.updateOne(
      { id: req.body.id },
      {
        $set: {
          name: req.body.name,
          projectHead: req.body.projectHead,
          status: req.body.status,
          visibility: req.body.visibility,
          description: req.body.description,
          startDate: req.body.startDate,
          updatedBy: "admin.id",
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
async function projectById(req, res) {
  let Projects = null;
  try {
    Projects = await Project.findOne({ id: req.params.id });
  } catch (error) {
    console.log(error);
  }
  return requestSuccess(res, Projects);
}
module.exports = {
  create,
  list,
  update,
  projectById,
  projectHead,
};
