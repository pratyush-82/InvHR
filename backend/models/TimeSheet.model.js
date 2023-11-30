const mongoose = require("mongoose");
const { number } = require("yup");
const schema = new mongoose.Schema({
  id: {
    type: String,
  },
  empId: {
    type: String,
  },
  email: {
    type: String,
  },
  name: {
    type: String,
  },
  projectName: {
    type: String,
  },
  start: {
    type: Date,
  },
  end: {
    type: Date,
  },
  comment: {
    type: String,
  },
  createdOn: {
    type: Date,
    default: Date.now(),
  },
  updatedOn: {
    type: Date,
    default: Date.now(),
  },
  createdBy: {
    type: String,
  },
  updatedBy: {
    type: String,
  },
});
schema.pre("save", function (next) {
  this.updatedOn = Date.now();
  next();
});
const model = mongoose.model("timesheet", schema);
module.exports = model;
