const express = require("express");
const { createEvent, getEvents, updateEvent, deleteEvent } = require("../controllers/eventController");

const router = express.Router();

router.post("/", createEvent);
router.get("/", getEvents); // Accepts a category query parameter
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

module.exports = router;
