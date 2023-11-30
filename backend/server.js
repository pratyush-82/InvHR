require("dotenv").config();
const express = require("express");
const ExpressUrlList = require("./helpers/ExpressUrlList.helper");
const bodyParser = require("body-parser");
const cors = require("cors");
var app = express();
app.use(express.json({ limit: "100mb" }));
app.use(express.text({ limit: "100mb" }));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 100000,
  })
);

const ip = require("ip");
const PORT = process.env.APP_PORT || 5107;

global.app_url = `http://${ip.address()}:${PORT}`;

require("./configs/express.config")(app);

require("./database/database")();
require("./jobs")();

//mb in megabytes 1MB = 8mb

app.use(cors());

app.listen(PORT, () => {
  if (process.env.APP_ENIVERMENT != "production") {
    ExpressUrlList(app);
  }
  console.log(`Server started on port => ${PORT}, API URL: ${global.app_url}`);
});
