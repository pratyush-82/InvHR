const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const handlebars = require("handlebars");
const fs = require("fs");
require("dotenv").config();

/* Reading the html file and passing it to the callback function. */
var readHTMLFile = function (path, callback) {
  fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
    if (err) {
      callback(err);
      throw err;
    } else {
      callback(null, html);
    }
  });
};

const getHtmlFile = function (path, callback) {
  fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
    if (err) {
      callback(err);
    } else {
      callback(null, html);
    }
  });
};

const passwordEmail = async (email, subject, text) => {
  try {
    let mailTransporter = nodemailer.createTransport(
      smtpTransport({
        host: process.env.SMTP_HOST,
        service: process.env.SMTP_SERVICE,
        port: 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })
    );
    readHTMLFile(
      __dirname + "/../public/passwordInMail.html",
      function (err, html) {
        let template = handlebars.compile(html);
        let replacements = {
          verificationcode: text,
        };
        let htmlToSend = template(replacements);
        let mailOptions = {
          from: process.env.SMTP_USER,
          to: email,
          subject: subject,
          html: htmlToSend,
        };
        mailTransporter.sendMail(mailOptions, function (error, response) {
          if (error) {
            console.log(error);
          }
        });
      }
    );
  } catch (error) {
    console.log(error);
  }
};

// Send OTP start here
function sendOTP(email, otp) {
  try {
    let mailTransporter = nodemailer.createTransport(
      smtpTransport({
        host: process.env.SMTP_HOST,
        service: process.env.SMTP_SERVICE,
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })
    );

    if (!mailTransporter) return false;

    getHtmlFile(
      __dirname + "/../assets/templates/otp_email.template.html",

      function (err, html) {
        if (err) return false;

        let template = handlebars.compile(html);
        mailTransporter.sendMail(
          {
            from: process.env.SMTP_USER,
            to: email,
            subject: "OTP for email verification",
            html: template({
              templateHeading: "Email verification",
              templateText:
                "Email verification is required while creating an account. Please find your OTP below.",
              otpTxt: otp,
            }),
          },
          function (error, response) {
            return error ? false : true;
          }
        );
      }
    );
  } catch (error) {
    return error ? false : true;
  }
}

function welcome(email) {
  console.log(email);
  try {
    let mailTransporter = nodemailer.createTransport(
      smtpTransport({
        host: process.env.SMTP_HOST,
        service: process.env.SMTP_SERVICE,
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })
    );

    if (!mailTransporter) return false;

    getHtmlFile(
      __dirname + "/../assets/templates/welcome.tamplate.html",

      function (err, html) {
        if (err) return false;

        let template = handlebars.compile(html);
        mailTransporter.sendMail(
          {
            from: process.env.SMTP_USER,
            to: email,
            subject: "Welcome to Inevitable Infotech",
            html: template({
              dashboardLink: "#",
            }),
          },
          function (error, response) {
            return error ? false : true;
          }
        );
      }
    );
  } catch (error) {
    return error ? false : true;
  }
}

function sendForgetOTP(email, otp) {
  try {
    let mailTransporter = nodemailer.createTransport(
      smtpTransport({
        host: process.env.SMTP_HOST,
        service: process.env.SMTP_SERVICE,
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })
    );

    if (!mailTransporter) return false;

    getHtmlFile(
      __dirname + "/../assets/templates/otp_email.template.html",

      function (err, html) {
        if (err) return false;

        let template = handlebars.compile(html);
        mailTransporter.sendMail(
          {
            from: process.env.SMTP_USER,
            to: email,
            subject: "Email verification of change password",
            html: template({
              templateHeading: "Email Verification",
              templateText:
                "Email verification is required while changing your account password. Please find your OTP below.",
              otpTxt: otp,
            }),
          },
          function (error, response) {
            return error ? false : true;
          }
        );
      }
    );
  } catch (error) {
    return error ? false : true;
  }
}

function sendInvite(data) {
  try {
    let mailTransporter = nodemailer.createTransport(
      smtpTransport({
        host: process.env.SMTP_HOST,
        service: process.env.SMTP_SERVICE,
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })
    );

    if (!mailTransporter) return false;

    getHtmlFile(
      __dirname + "/../assets/templates/team_invite.template.html",

      function (err, html) {
        if (err) return false;

        let template = handlebars.compile(html);

        mailTransporter.sendMail(
          {
            from: process.env.SMTP_USER,
            to: data.email,
            subject: `${data.invitedby} has invited you to collaborate on ${data.organization}`,
            html: template({
              join_team_link: data.joinLink,
              invitor_name: data.invitedby,
              organization_name: data.organization,
            }),
          },
          function (error, response) {
            return error ? false : true;
          }
        );
      }
    );
  } catch (error) {
    return error ? false : true;
  }
}

module.exports = { passwordEmail, sendOTP, welcome, sendForgetOTP, sendInvite };
