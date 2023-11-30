const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  id: {
    type: String,
    // unique: true,
  },
  name: {
    type: String,
    // unique: true,
  },
  details: {
    type: String,
  },
  date: {
    type: Date,
  },
  branch: {
    type: Object,
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

const model = mongoose.model("holiday", schema);
module.exports = model;
