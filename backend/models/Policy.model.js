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
  description: {
    type: String,
  },
  status: {
    type: String,
  },
  document: {
    type: String,
  },
  date: {
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
const model = mongoose.model("policy", schema);
module.exports = model;
