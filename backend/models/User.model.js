const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  EmpId: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  mobile: {
    type: Number,
  },
  password: {
    type: String,
  },
  status: {
    type: String,
    default: "active",
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

const model = mongoose.model("user", schema);
module.exports = model;
