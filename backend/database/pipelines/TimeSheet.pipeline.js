function TimeSheetDetailsByEmployee(empId) {
  [
    {
      $match: {
        empId: empId,
      },
    },
    {
      $lookup: {
        from: "leaves",
        localField: "empId",
        foreignField: "empId",
        as: "leaveDetails",
      },
    },
    {
      $lookup: {
        from: "timesheets",
        localField: "empId",
        foreignField: "empId",
        as: "timesheetDetails",
      },
    },
  ];
}

module.exports = {
  TimeSheetDetailsByEmployee,
};
