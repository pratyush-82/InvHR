const cors = require("cors");
const express = require("express");
const whitelist = require("./white-list-origin.config");

require("dotenv").config();
/**
 * It sets up the Express server to use the CORS middleware, parses the request body, and sets up the
 * routes
 * @param app - The express app object
 */
function ExpressConfigs(app) {
  /* A middleware that allows cross-origin resource sharing, which means we can access our API from a
 domain other than it’s own. */
  let corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  };

  corsOptions = {};

  app.use(cors(corsOptions));

  // parse requests of content-type - application/json
  app.use(express.json());

  app.use(function (req, res, next) {
    global.currentHttpRequest = req;
    global.currentHttpResponse = res;
    next();
  });

  //file acccess
  app.use("/uploads", express.static("uploads"));

  // parse requests of content-type - application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: true }));

  // Start lesition on http request
  app.get("/", (req, res) => {
    res.json({ message: `Welcome to ${process.env.APP_NAME}` });
  });

  app.use("/api", require("../routers/")(app));
}

module.exports = ExpressConfigs;
