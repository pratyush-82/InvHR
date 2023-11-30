const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  empId: {
    type: String,
  },
  email: {
    type: String,
  },
  name: {
    type: String,
  },
  id: {
    type: String,
  },
  leaveType: {
    type: String,
  },
  leaveCategory: {
    type: String,
  },
  startDate: {
    type: String,
  },
  endDate: {
    type: String,
  },
  reportingPersonId: {
    type: String,
  },
  reportingPerson: {
    type: String,
  },
  leaveCause: {
    type: String,
  },
  reportingPersonEmail: {
    type: String,
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "approved", "rejected"],
  },
  comment: {
    type: String,
  },
  leaveInBucket: {
    type: String,
  },
  LOP: {
    type: String,
  },
  approvedBy: {
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
