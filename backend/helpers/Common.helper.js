const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const Employee = require("../models/Employee.model");

const jwtToken = process.env.JWT_SERVER_TOKEN || "token";

//  Define this method to generate random number to represent service _id

/**
 * It generates a random number of a given length
 * @param [length=5] - The length of the ID to be generated.
 * @returns a random number of length 5.
 */

function generateId(length = 3) {
  let id = "";
  for (let i = 0; i < length; i++) {
    id += Math.floor(Math.random() * (9 - 0)) + 0;
  }
  return id;
}
function pad(n) {
  var s = "00" + n;
  return s.substring(s.length - 4);
}
function date() {
  return new Date();
}

function generateNextNumber(number) {
  // Increment the given number by 1
  const nextNumber = number + 1;

  // Convert the next number to a string
  const nextNumberString = nextNumber.toString();

  // Check if the length of the string is already 4
  if (nextNumberString.length === 4) {
    return nextNumberString; // Return the next number as is
  } else if (nextNumberString.length < 4) {
    // If the length is less than 4, pad the string with leading zeros
    const paddedNumber = nextNumberString.padStart(4, "0");
    return paddedNumber;
  } else {
    // If the length is greater than 4, truncate the string to the last 4 digits
    const truncatedNumber = nextNumberString.slice(-4);
    return truncatedNumber;
  }
}

function makePassword() {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < 6; i++) {
    const randomVar = Math.random();
    result += characters.charAt(Math.floor(randomVar * charactersLength));
  }

  return result;
}

function generatePassword() {
  var length = 8,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

function generateOTP() {
  var digits = "0123456789";
  var otpLength = 4;
  var otp = "";
  for (let i = 1; i <= otpLength; i++) {
    var index = Math.floor(Math.random() * digits.length);
    otp = otp + digits[index];
  }
  return otp;
}

function generateJWT(data = null, config = { expiresIn: "10d" }) {
  return jwt.sign(data, jwtToken, config);
}

function getRequestToken() {
  try {
    return currentHttpRequest.headers["authorization"];
  } catch (error) {
    return "";
  }
}

function verifyJWT(token) {
  try {
    return jwt.verify(token.trim(), jwtToken);
  } catch (error) {
    print(error.message, "function : verifyJWT; file : Common.helper.js");
    return false;
  }
}

async function getAdmin() {
  const requestToken = getRequestToken();
  let user = requestToken ? verifyJWT(requestToken) : null;

  if (!user) {
    return false;
  }

  try {
    user = await Employee.findOne({ email: user.email });

    console.log(user, "user with the help of token");

    if (!user || (user.status && user.status.toLowerCase() !== "active")) {
      return false;
    }

    return {
      empId: user.empId,
      name: user.name,
      email: user.email,
      leaveInBucket: user.leaveInBucket,
      LOP: user.LOP,
    };
  } catch (error) {
    console.error("Error in getAdmin:", error);
    return false;
  }
}

async function getCurrentEmployee() {
  // Get token from request and verify
  let tempEmp = verifyJWT(
    currentHttpRequest.headers["authorization"].split(" ")[1]
  );

  let emp = false;

  // check user is valid customer
  try {
    emp = await Employee.findOne({ empId: tempEmp.empId });
  } catch (err) {
    print(err.message);
  }

  if (emp) return { empId: emp.empId, name: emp.name, email: emp.email };

  return emp;
}

// function countDaysBetweenDates(startDate, endDate) {
//   const start = new Date(startDate);
//   const end = new Date(endDate);

//   // To calculate the time difference of two dates
//   const DiffInTime = end.getTime() - start.getTime();

//   //To calculate the no. of days between two datea
//   const DiffInDays = DiffInTime / (1000 * 3600 * 24);

//   return DiffInDays;
// }

function countDaysBetweenDates(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Function to check if a given date is a weekend (Saturday or Sunday)
  function isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday (0) and Saturday (6)
  }

  let workingDays = 0;
  let currentDate = new Date(start);

  while (currentDate <= end) {
    if (!isWeekend(currentDate)) {
      workingDays++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return workingDays;
}

function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 represents Sunday, and 6 represents Saturday
}

function isHoliday(date) {
  const holidays = [
    // Specify the dates of holidays in the format: 'month-day'
    "12-25", // Christmas
    "01-01", // New Year's Day
    "08-02",
    // Add more holidays if needed
  ];

  const month = date.getMonth() + 1; // JavaScript months are 0-based, so we add 1
  const day = date.getDate();
  const formattedDate = `${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;

  return holidays.includes(formattedDate);
  return false;
}

function calculateWorkingDays(startDate, endDate) {
  const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day

  let currentDate = new Date(startDate);
  const targetDate = new Date(endDate);

  let workingDays = 0;

  while (currentDate <= targetDate) {
    if (!isWeekend(currentDate) && !isHoliday(currentDate)) {
      workingDays++;
    }
    currentDate.setTime(currentDate.getTime() + oneDay);
  }

  return workingDays;
}

module.exports = {
  generateId,
  date,
  generatePassword,
  generateOTP,
  generateJWT,
  getAdmin,
  pad,
  makePassword,
  getRequestToken,
  generateNextNumber,
  getCurrentEmployee,
  countDaysBetweenDates,
  calculateWorkingDays,
};
