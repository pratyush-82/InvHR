const { requestSuccess } = require("../helpers/RequestResponse.helper");

const router = require("express").Router();

/* This is a function that is exporting a router. */
module.exports = function () {
  router.get("/", () => {
    requestSuccess(res);
  });

  const fs = require("fs");

  fs.readdirSync("./routers").forEach((file) => {
    if (file !== "index.js") {
      try {
        router.use(
          `/${file.split(".")[0].toLowerCase()}`,
          require(`./${file.replace(".js", "")}`)
        );
      } catch (err) {
        console.error(`File Name : ${file.split(".")[0].toLowerCase()} ${err}`);
      }
    }
  });

  return router;
};
