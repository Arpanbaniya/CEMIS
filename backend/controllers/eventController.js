// controllers/eventController.js

const Event = require("../models/Event");

// Fetch all events or filter by category
const getEvents = async (req, res) => {
  const { category } = req.query;
  try {
    const events = category
      ? await Event.find({ category })
      : await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
};

// Create a new event
const createEvent = async (req, res) => {
  const {
    name,
    location,
    date,
    time,
    contact,
    category,
    teamRequired,
    teamMembers,
    substitutes,
    teams,
  } = req.body;

  if (!category) {
    return res.status(400).json({ message: "Category is required" });
  }

  if (teamRequired && (!teamMembers || !substitutes || !teams)) {
    return res.status(400).json({
      message: "If teams are required, teamMembers, substitutes, and teams must be specified",
    });
  }

  try {
    const newEvent = new Event({
      name,
      location,
      date,
      time,
      contact,
      category,
      teamRequired,
      teamMembers,
      substitutes,
      teams,
    });
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: "Error creating event", error });
  }
};

// Update an existing event
const updateEvent = async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.teamRequired && (!req.body.teamMembers || !req.body.substitutes || !req.body.teams)) {
      return res.status(400).json({
        message: "If teams are required, teamMembers, substitutes, and teams must be specified",
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Error updating event", error });
  }
};

// Delete an event
const deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error });
  }
};

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };
