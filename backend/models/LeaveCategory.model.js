const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  id: {
    type: String,
  },
  name: {
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

const model = mongoose.model("leavecategory", schema);
module.exports = model;
