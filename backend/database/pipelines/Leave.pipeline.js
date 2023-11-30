function EmployeeByReportingPerson($empId) {
  return [
    {
      $match: {
        reportingPersonId: $empId,
      },
    },
    {
      $lookup: {
        from: "employees",
        localField: "reportingPersonId",
        foreignField: "empId",
        as: "reportingPersonObj",
      },
    },
    {
      $addFields: {
        reportingPerson: {
          $first: "$reportingPersonObj.name",
        },
      },
    },
    {
      $unset: "reportingPersonObj",
    },
  ];
}

function EmployeeLeaveList($empId) {
  return [
    {
      $match: {
        empId: $empId,
      },
    },
    {
      $lookup: {
        from: "employees",
        localField: "reportingPersonId",
        foreignField: "empId",
        as: "reportingPersonObj",
      },
    },
    {
      $addFields: {
        reportingPerson: {
          $first: "$reportingPersonObj.name",
        },
      },
    },
  ];
}

module.exports = {
  EmployeeByReportingPerson,
  EmployeeLeaveList,
};
