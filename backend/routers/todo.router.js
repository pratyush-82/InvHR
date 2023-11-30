const express = require("express");
const router = express.Router();
const controller = require("../controllers/Todo.controller");

//post method
router.post("/create", controller.create);

// get method
router.get("/list", controller.list);
router.get("/:id", controller.todoById);

// put method
router.put("/update", controller.update);

// delete method
router.delete("/delete", controller.Delete);

module.exports = router;
