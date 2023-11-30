function employeeByIdPipeline($empId) {
  return [
    ({
      $match: {
        empId: $empId,
      },
    },
    {}),
  ];
}

function ReportingEmployeePipeline() {
  return [
    {
      $unset: [
        "password",
        "avatarbase64",
        "fatherName",
        "designation",
        "personalEmail",
        "gender",
        "maritalStatus",
        "empStatus",
        "emergencyContact",
        "bloodGroup",
        "employeeType",
        "reportingPerson",
        "LOJ",
        "experience",
        "DOR",
        "DOJ",
        "DOB",
        "aadharNumber",
        "panNumber",
        "city",
        "country",
        "state",
        "zipCode",
        "phoneNumber",
        "bankName",
        "IFSCCode",
        "bankType",
        "accountNumber",
        "technologies",
        "organizations",
        "address",
      ],
    },
  ];
}

function EmployeeImageByIdPipeline($empId) {
  return [
    {
      $match: {
        empId: $empId,
      },
    },
    {
      $unset: ["password", "aadhaarCard"],
    },
  ];
}

module.exports = {
  employeeByIdPipeline,
  ReportingEmployeePipeline,
  EmployeeImageByIdPipeline,
};
