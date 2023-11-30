const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const handlebars = require("handlebars");
const fs = require("fs");
require("dotenv").config();

const getHtmlFile = function (path, callback) {
  fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
    if (err) {
      callback(err);
    } else {
      callback(null, html);
    }
  });
};

const sendMail = (template, emailConfig = {}, data = {}) => {
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
      `${__dirname}/../assets/templates/${template}`,

      function (err, html) {
        if (err) return false;

        let template = handlebars.compile(html);

        mailTransporter.sendMail(
          {
            from: process.env.SMTP_USER,
            to: emailConfig.to,
            subject: emailConfig.subject,
            html: template(data),
          },
          function (error, response) {
            console.log(error);
            return error ? false : true;
          }
        );
      }
    );
  } catch (error) {
    return error ? false : true;
  }
};

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

// Employee Password create

function userAccountCreate(data) {
  // Admin side
  // {
  //   to:"",
  //   dashboardLink:"",
  //   userName:"",
  //   userEmail:"",
  //   password:""
  // }

  let to = data.to;
  delete data.to;
  // console.log(process.env.DASHBOARD_LINK, "process.env.DASHBOARD_LINK");
  // print(process.env.DASHBOARD_LINK);
  sendMail(
    "user_temp_password.template.html",
    {
      to,
      subject: `You are Invited as a InviHR Member.`,
    },
    {
      dashboardLink: process.env.DASHBOARD_LINK ?? "",
      ...data,
    }
  );
  console.log(data, "mail data");
}

const passwordEmail = async (email, subject, text) => {
  try {
    let mailTransporter = nodemailer.createTransport(
      smtpTransport({
        host: process.env.HOST,
        service: process.env.SERVICE,
        port: 587,
        auth: {
          user: process.env.GMAILUSER,
          pass: process.env.PASS,
        },
      })
    );
    readHTMLFile(
      __dirname + "/../assets/templates/password.template.html",
      function (err, html) {
        let template = handlebars.compile(html);
        let replacements = {
          verificationcode: text,
        };
        let htmlToSend = template(replacements);
        let mailOptions = {
          from: process.env.GMAILUSER,
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
        host: process.env.HOST,
        service: process.env.SERVICE,
        port: 465,
        secure: true,
        auth: {
          user: process.env.GMAILUSER,
          pass: process.env.PASS,
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
            from: process.env.GMAILUSER,
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
        host: process.env.HOST,
        service: process.env.SERVICE,
        port: 465,
        secure: true,
        auth: {
          user: process.env.GMAILUSER,
          pass: process.env.PASS,
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
            from: process.env.GMAILUSER,
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
        host: process.env.HOST,
        service: process.env.SERVICE,
        port: 465,
        secure: true,
        auth: {
          user: process.env.GMAILUSER,
          pass: process.env.PASS,
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
            from: process.env.GMAILUSER,
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
        host: process.env.HOST,
        service: process.env.SERVICE,
        port: 465,
        secure: true,
        auth: {
          user: process.env.GMAILUSER,
          pass: process.env.PASS,
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
            from: process.env.GMAILUSER,
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
function sendLeave(data) {
  try {
    let mailTransporter = nodemailer.createTransport(
      smtpTransport({
        host: process.env.HOST,
        service: process.env.SERVICE,
        port: 465,
        secure: true,
        auth: {
          user: process.env.GMAILUSER,
          pass: process.env.PASS,
        },
      })
    );

    if (!mailTransporter) return false;

    getHtmlFile(
      __dirname + "/../assets/templates/leave_request.template.html",

      function (err, html) {
        if (err) return false;

        let template = handlebars.compile(html);
        let mailArray = [data.email, data.reportingPersonEmail];

        mailTransporter.sendMail(
          {
            from: process.env.GMAILUSER,
            to: mailArray,
            subject: "leave Application",
            html: template({
              Id: data.Id,
              empId: data.empId,
              name: data.name,
              leaveCause: data.leaveCause,
              daysForLeave: data.daysForLeave,
              email: data.reportingPersonEmail,
              reportingPersonName: data.reportingPersonName,
              reportingPersonEmail: data.reportingPersonEmail,
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

function sendApprovedLeave(data) {
  try {
    let mailTransporter = nodemailer.createTransport(
      smtpTransport({
        host: process.env.HOST,
        service: process.env.SERVICE,
        port: 465,
        secure: true,
        auth: {
          user: process.env.GMAILUSER,
          pass: process.env.PASS,
        },
      })
    );

    if (!mailTransporter) return false;

    getHtmlFile(
      __dirname + "/../assets/templates/leave_approved.template.html",

      function (err, html) {
        if (err) return false;

        let template = handlebars.compile(html);
        let mailArray = [data.email, data.reportingPersonEmail];

        mailTransporter.sendMail(
          {
            from: process.env.GMAILUSER,
            to: mailArray,
            subject: "Leave Application Updatation",
            html: template({
              Id: data.Id,
              empId: data.empId,
              name: data.name,
              leaveCause: data.leaveCause,
              comment: data.comment,
              LeaveDays: data.LeaveDays,
              email: data.reportingPersonEmail,
              reportingPersonName: data.reportingPersonName,
              reportingPersonEmail: data.reportingPersonEmail,
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

function sendRejectedLeave(data) {
  try {
    let mailTransporter = nodemailer.createTransport(
      smtpTransport({
        host: process.env.HOST,
        service: process.env.SERVICE,
        port: 465,
        secure: true,
        auth: {
          user: process.env.GMAILUSER,
          pass: process.env.PASS,
        },
      })
    );

    if (!mailTransporter) return false;

    getHtmlFile(
      __dirname + "/../assets/templates/leave_rejected.template.html",

      function (err, html) {
        if (err) return false;

        let template = handlebars.compile(html);
        let mailArray = [data.email, data.reportingPersonEmail];

        mailTransporter.sendMail(
          {
            from: process.env.GMAILUSER,
            to: mailArray,
            subject: "Leave Application Updatation",
            html: template({
              Id: data.Id,
              empId: data.empId,
              name: data.name,
              leaveCause: data.leaveCause,
              comment: data.comment,
              LeaveDays: data.LeaveDays,
              email: data.reportingPersonEmail,
              reportingPersonName: data.reportingPersonName,
              reportingPersonEmail: data.reportingPersonEmail,
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

module.exports = {
  passwordEmail,
  sendOTP,
  welcome,
  userAccountCreate,
  sendForgetOTP,
  sendInvite,
  sendLeave,
  sendApprovedLeave,
  sendRejectedLeave,
};
