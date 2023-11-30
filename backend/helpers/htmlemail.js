var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
var handlebars = require("handlebars");
var fs = require("fs");

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
const sendHtmlEmail = async (email, subject, text) => {
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
    readHTMLFile(__dirname + "\\..\\public\\sanaat.html", function (err, html) {
      var template = handlebars.compile(html);
      var replacements = {
        verificationcode: text,
      };
      var htmlToSend = template(replacements);
      var mailOptions = {
        from: process.env.GMAILUSER,
        to: email,
        subject: subject,
        html: htmlToSend,
      };
      mailTransporter.sendMail(mailOptions, function (error, response) {
        if (error) {
          console.log(error);
          callback(error);
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendHtmlEmail;
