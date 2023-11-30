const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  empId: {
    type: String,
  },
  previousLeave: {
    type: String,
  },
  currentLeave: {
    type: String,
  },
  time: {
    type: Date,
  },
  creditBy: {
    type: String,
  },
  LeaveId: {
    type: String,
  },
  type: {
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
const model = mongoose.model("leave", schema);
module.exports = model;
