const cron = require("node-cron");
const Employee = require("../models/Employee.model");
module.exports = function () {
  cron.schedule("0 0 1 * *", add_monthly_to_employee_bucket);
  // cron.schedule("* * 16 * * ", add_monthly_to_employee_bucket);
  cron.schedule("0 0 1 * *", add_leaves_to_new_employees);
};

async function add_monthly_to_employee_bucket() {
  try {
    const employees = await Employee.find();
    for (const employee of employees) {
      console.log(employee);
      // Update the leave bucket in the database

      await Employee.updateOne(
        { empId: employee.empId },
        { leaveInBucket: employee.leaveInBucket + 2 },
        { totalLeave: employee.totalLeave + 2 }
      );
    }
    console.log("Leave buckets updated successfully.");
  } catch (error) {}
}

async function add_leaves_to_new_employees() {
  try {
    const newEmployees = await Employee.find({ totalLeave: 0 });
    for (const employee of newEmployees) {
      // Update the leave bucket and total leave for new employees
      await Employee.updateOne(
        { empId: employee.empId },
        {
          $inc: {
            leaveInBucket: 2,
            totalLeave: 2,
          },
        }
      );
    }
  } catch (error) {
    console.error("Error adding leaves for new employees:", error);
  }
}
