const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  id: {
    type: String,
  },
  details: {
    type: String,
  },
  // Other fields related to leave details
  isDeleted: {
    type: Boolean,
    default: false,
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
  this.updateOn = Date.now();
  next();
});
const model = mongoose.model("todo", schema);
module.exports = model;
