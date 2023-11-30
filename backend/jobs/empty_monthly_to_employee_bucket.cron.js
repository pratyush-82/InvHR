const cron = require("node-cron");
const Employee = require("../models/Employee.model");
module.exports = function () {
  cron.schedule("* * 28-31 * * ", empty_monthly_to_employee_bucket);
};

async function empty_monthly_to_employee_bucket() {
  // Get the current date
  const currentDate = new Date();

  // Get the last day of the current month
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  if (currentDate.getDate() == lastDayOfMonth)
    try {
      const employees = await Employee.find();
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const lastMonthYear = lastMonth.getFullYear();
      const lastMonthMonth = lastMonth.getMonth();
      for (const employee of employees) {
        console.log(employee);

        if (
          employee.employeeType === "Trainee" ||
          employee.employeeType === "On Probation"
        ) {
          const leaveInBucket = parseInt(employee.leaveInBucket);

          // Check if the employee has leaves in the previous month
          const leavesInLastMonth = await Leave.find({
            empId: employee.empId,
            year: lastMonthYear,
            month: lastMonthMonth,
          });

          const leavesCount = leavesInLastMonth.length;

          // Update the leave bucket in the database
          await Employee.updateOne(
            { empId: employee.empId },
            { leaveInBucket: leaveInBucket - leavesCount },
            { totalLeave: totalLeave - leavesCount }
          );
        }
      }
      console.log("Leave buckets updated successfully.");
    } catch (error) {}
}
