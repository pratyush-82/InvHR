const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  empId: {
    type: String,
  },
  totalLeave: {
    type: Number,
  },
  leaveInBucket: {
    type: Number,
  },
  availedLeave: {
    type: Number,
  },
  LOP: {
    type: Number,
  },
});
schema.pre("save", function (next) {
  this.updateOne = Date.now();
  next();
});
const model = mongoose.model("leaveInformation", schema);
module.exports = model;
