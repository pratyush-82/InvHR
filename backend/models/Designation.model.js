const mongoose = require("mongoose");
const { number, string } = require("yup");
const schema = new mongoose.Schema({
  id: {
    type: String,
  },
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  designationName: {
    type: String,
  },
  permission: {
    type: Object,
  },
  status: {
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
const model = mongoose.model("designation", schema);
module.exports = model;
