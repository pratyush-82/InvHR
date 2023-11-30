const mongoose = require("mongoose");
const { number, string } = require("yup");

const schema = new mongoose.Schema({
  empId: {
    type: String,
    // unique: true,
  },
  name: {
    type: String,
  },
  password: {
    type: String,
  },
  avatarbase64: {
    type: String,
  },
  aadhaarCard: {
    type: String,
    default: "",
  },
  panCard: {
    type: String,
    default: "",
  },
  bankDocument: {
    type: String,
    default: "",
  },
  degree: {
    type: String,
    default: "",
  },
  education: {
    type: String,
  },
  fatherName: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  designation: {
    type: String,
  },
  designationName: {
    type: String,
  },
  personalEmail: {
    type: String,
  },
  gender: {
    type: String,
  },
  maritalStatus: {
    type: String,
  },
  empStatus: {
    type: String,
  },
  emergencyContact: {
    type: String,
  },
  bloodGroup: {
    type: String,
  },
  employeeType: {
    type: String,
  },
  reportingPerson: {
    type: String,
  },
  branchType: {
    type: String,
  },
  LOJ: {
    type: String,
  },
  experience: {
    type: Number,
  },
  DOR: {
    type: Date,
  },
  DOB: {
    type: Date,
  },
  DOJ: {
    type: String,
  },
  aadharNumber: {
    type: String,
  },
  panNumber: {
    type: String,
  },
  location: {
    type: String,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  empStatus: {
    type: String,
  },
  // empToken: {
  //   type: String,
  // },
  // empPolicyStatus: {
  //   type: String,
  // },
  zipCode: {
    type: Number,
  },
  phoneNumber: {
    type: String,
  },
  empStatus: {
    type: String,
    default: "current",
  },
  bankName: {
    type: String,
  },
  IFSCCode: {
    type: String,
  },
  bankType: {
    type: String,
  },
  accountNumber: {
    type: String,
  },
  education: {
    type: String,
  },
  board: {
    type: String,
  },
  percentage: {
    type: String,
  },
  yrOfPassing: {
    type: Date,
  },
  technologies: [
    {
      technologyName: String,
      technologyExp: String,
      technologyYear: String,
    },
  ],
  organizations: [
    {
      orgName: String,
      orgDOJ: String,
      orgDOR: String,
    },
  ],
  totalLeave: {
    type: String,
  },
  leaveInBucket: {
    type: String,
  },
  availedLeave: {
    type: String,
  },
  LOP: {
    type: String,
  },
  policyAgreed: {
    type: Boolean,
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

const model = mongoose.model("employee", schema);
module.exports = model;
