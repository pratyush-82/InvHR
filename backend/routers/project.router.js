const express = require("express");
const router = express.Router();
const controller = require("../controllers/Project.controller");

// Post method
router.post("/create", controller.create);

// get Method
router.get("/list", controller.list);
router.get("/projectHead", controller.projectHead);
router.get("/:id", controller.projectById);

// put method
router.put("/update", controller.update);

module.exports = router;
