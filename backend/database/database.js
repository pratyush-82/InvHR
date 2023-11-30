const mongoose = require("mongoose");
require("dotenv").config();

function initializeMongoDB() {
  const MONGO_DB_URL =
    process.env.APP_ENIVERMENT == "production"
      ? `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_CLUSTER}.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`
      : `mongodb://0.0.0.0:27017/${
          process.env.MONGO_DB_NAME || "local_template_db"
        }`;

  mongoose.connect(MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.set("strictQuery", false);
  
//create database by mongoose
/* Connecting to the database. */
// mongoose.connect(MONGO_DB_URL, {
//   useNewUrlParser: "true",
// })
// mongoose.connection.on("error", err => {
//   console.log("err", err)
// })
// mongoose.connection.on("connected", (err, res) => {
//   console.log("mongoose is connected")
// })


  mongoose.connection
    .on("error", console.error.bind(console, "connection error: "))
    .once("open", function () {
      console.log(
        `Application connected to database successfully ${mongoose.connection.name}`
      );
    });
}

module.exports = initializeMongoDB;
