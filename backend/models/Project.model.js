const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    unique: true,
  },
  projectHead: {
    type: String,
  },
  status: {
    type: String,
  },
  visibility: {
    type: String,
  },
  description: {
    type: String,
  },
  startDate: {
    type: Date,
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
const model = mongoose.model("project", schema);
module.exports = model;
