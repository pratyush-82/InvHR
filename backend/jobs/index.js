const add_monthly_to_employee_bucket = require("./add_monthly_to_employee_bucket.cron");
const add_leaves_to_new_employees = require("./add_monthly_to_employee_bucket.cron");
const empty_monthly_to_employee_bucket = require("./empty_monthly_to_employee_bucket.cron");

module.exports = function () {
  add_monthly_to_employee_bucket();
};

module.exports = function () {
  empty_monthly_to_employee_bucket();
};

module.exports = function () {
  add_leaves_to_new_employees();
};
