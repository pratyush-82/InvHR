const express = require("express");
const router = express.Router();
const controller = require("../controllers/Policy.controller");

// Post Methods
router.post("/create", controller.create);

//Get Methods
router.get("/list", controller.list);
router.get("/:id", controller.policyById);

// Put Methods
router.put("/update", controller.update);

module.exports = router;
