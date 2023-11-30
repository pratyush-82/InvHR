const { object, string, date } = require("yup"),
  {
    sendResponse,
    requestFail,
    requestSuccess,
  } = require("../helpers/RequestResponse.helper"),
  Todo = require("../models/Todo.model");
const { generateNextNumber } = require("../helpers/Common.helper");

async function create(req, res) {
  const { body } = req;
  const todoSchema = object({
    details: string().required("details is required"),
  });
  let todo = null;
  try {
    todo = await todoSchema.validate(body);
  } catch (e) {
    return sendResponse(res, 400, e.message);
  }
  let dbTodo = null;
  try {
    dbTodo = await Todo.findOne({
      details: todo.details,
    });
    if (dbTodo) return requestFail(res, "Todo is already exist");
  } catch (e) {
    return requestFail(res, "Something went wrong");
    return sendResponse(res, 400, e.message);
  }
  if (!todo && dbTodo != null)
    requestFail(res, "Something went wrong, try again");
  let totalTodo = 0;
  try {
    totalTodo = await Todo.find();
  } catch (err) {}
  const Id = `TD${generateNextNumber(totalTodo.length ?? 0)}`;
  new Todo({
    id: Id,
    details: todo.details,
  }).save((err, dbResponse) => {
    if (err) {
      return requestFail(res, 500, "Something went wrong");
    } else {
      return requestSuccess(res, dbResponse);
    }
  });
}

async function list(req, res) {
  let todo = null;
  try {
    todo = await Todo.aggregate([
      {
        $sort: {
          _id: -1,
        },
      },
    ]);
  } catch (error) {}
  if (!todo)
    return requestFail(res, "Something went wrong can't get todo list");
  return requestSuccess(res, todo);
}

async function update(req, res) {
  try {
    Todo.updateOne(
      {
        id: req.body.id,
      },
      {
        $set: {
          ...req.body,
        },
      },
      (error, result) => {
        if (error) return requestFail(res, "Something went wrong");
        return sendResponse(res, 200, "Update Successfully");
      }
    );
  } catch (error) {
    return requestFail(res, 500, "Something went wrong");
  }
}

async function todoById(req, res) {
  let todo = null;
  try {
    todo = await Todo.findOne({ id: req.params.id });
  } catch (error) {}
  return requestSuccess(res, todo);
}

async function Delete(req, res) {
  let deletedTodo = null;
  try {
    deletedTodo = await Todo.findOneAndUpdate(
      { id: req.body.id },
      { $set: { isDeleted: true } },
      { new: true }
    );
  } catch (error) {
    console.log(error);
  }
  if (deletedTodo) {
    return requestSuccess(res, "TodoMarked as deleted", deletedTodo);
  } else {
    return requestFail(res, "Todo not found.");
  }
}

module.exports = {
  create,
  list,
  update,
  todoById,
  Delete,
};
