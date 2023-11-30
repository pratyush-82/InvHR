const { forEach } = require('lodash');

function jsonToFormData(json) {
  const formData = new FormData();
  const keys = Object.keys(json);

  keys.forEach((item) => {
    if ((json[item] ?? null) === null) {
      formData.append(item, json[item]);
    }
  });

  return formData;
}

function convertDateTimeFormat(dateString) {
  const date = new Date(dateString);
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  const formattedDate = date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  // const formattedTime = date.toLocaleTimeString('en-US', {
  //   hour: '2-digit',
  //   minute: '2-digit',
  //   hour12: true,
  // });

  return `${formattedDate}`;
}
/**
 * The function takes a date string and returns a formatted date in the format of "dd/mm/yy".
 * @param dateString - a string representing a date in any format that can be parsed by the JavaScript
 * Date constructor.
 * @returns The function `formatDate` returns a string representing the input date in the format
 * "DD/MM/YY".
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  let day = date.getDate();
  let month = date.getMonth() + 1;
  const year = date.getFullYear().toString().slice(-2);
  // Add leading zeros if necessary
  day = day < 10 ? `0${day}` : day;
  month = month < 10 ? `0${month}` : month;
  // Reconstruct the date in the desired format
  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
}
/**
 * The function converts a file to a Base64 encoded string using a FileReader object in JavaScript.
 * @param file - The file parameter is the file object that needs to be converted to a base64 string.
 * It can be an image, audio, video, or any other type of file.
 * @returns A Promise object is being returned.
 */
function convertBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}
/**
 * The function takes a string as input and returns the same string with all characters in uppercase.
 * @param s - The parameter "s" is a string that is passed as an argument to the function "capitalize".
 * The function returns the uppercase version of the string.
 * @returns The function `capitalize` is returning the input string `s` in all uppercase letters.
 */
function capitalize(s) {
  return s.toUpperCase();
}

function calculateDateTimeDifferenceInMinutes(startDateTime, endDateTime) {
  const startDate = new Date(startDateTime);
  const endDate = new Date(endDateTime);

  // Calculate the difference in milliseconds
  const diffInMilliseconds = Math.abs(endDate - startDate);

  // Convert milliseconds to minutes
  const millisecondsPerMinute = 60 * 1000;

  const minutes = Math.floor(diffInMilliseconds / millisecondsPerMinute);

  return minutes;
}

function calculateDateTimeDifference(startDateTime, endDateTime) {
  console.log(startDateTime, endDateTime);

  const startDate = new Date(startDateTime);
  const endDate = new Date(endDateTime);

  // Calculate the difference in milliseconds
  const diffInMilliseconds = Math.abs(endDate - startDate);

  // Convert milliseconds to individual units
  const millisecondsPerSecond = 1000;
  const millisecondsPerMinute = 60 * millisecondsPerSecond;
  const millisecondsPerHour = 60 * millisecondsPerMinute;
  const millisecondsPerDay = 24 * millisecondsPerHour;

  const days = Math.floor(diffInMilliseconds / millisecondsPerDay);
  const hours = Math.floor((diffInMilliseconds % millisecondsPerDay) / millisecondsPerHour);
  const minutes = Math.floor((diffInMilliseconds % millisecondsPerHour) / millisecondsPerMinute);
  const seconds = Math.floor((diffInMilliseconds % millisecondsPerMinute) / millisecondsPerSecond);

  return {
    days,
    hours,
    minutes,
    seconds,
  };
}

function calculateTimeDifference(start, end) {
  const Start = new Date(`1970-01-01T${start}`);
  const End = new Date(`1970-01-01T${end}`);

  // Calculate the difference in milliseconds
  let diffInMilliseconds = Math.abs(End - Start);

  // Convert milliseconds to individual units
  const millisecondsPerMinute = 60 * 1000;
  const millisecondsPerHour = 60 * millisecondsPerMinute;

  const hours = Math.floor(diffInMilliseconds / millisecondsPerHour);
  diffInMilliseconds -= hours * millisecondsPerHour;

  const minutes = Math.floor(diffInMilliseconds / millisecondsPerMinute);

  return {
    hours,
    minutes,
  };
}

function getDayFromDate(dateString) {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const date = new Date(dateString);
  const dayOfWeek = date.getDay();
  const dayName = daysOfWeek[dayOfWeek];
  return dayName;
}

function extractTimeFromDate(dateString) {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

function convertMinutesToHours(minutes) {
  const hours = Math.floor(minutes / 60); // Get the whole number of hours
  const remainingMinutes = minutes % 60; // Get the remaining minutes

  // Create a formatted string for the result
  let result = `${hours} h `;

  if (remainingMinutes > 0) {
    result += `${remainingMinutes} m`;
  }

  return result;
}

// Function to check if the age is more than 18 years
const isOver18Years = (date) => {
  const today = new Date();
  const birthDate = new Date(date);
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1 >= 18;
  }

  return age >= 18;
};


module.exports = {
  calculateDateTimeDifferenceInMinutes,
  calculateDateTimeDifference,
  jsonToFormData,
  convertDateTimeFormat,
  formatDate,
  convertBase64,
  capitalize,
  calculateTimeDifference,
  extractTimeFromDate,
  convertMinutesToHours,
  getDayFromDate,
  isOver18Years,
};
