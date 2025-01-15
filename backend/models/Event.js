// models/Event.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  contact: { type: String },
  category: { type: String, required: true }, 
  teamRequired: { type: Boolean, default: false },
  teamMembers: { type: Number, default: 0 },
  substitutes: { type: Number, default: 0 },
  teams: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Event", eventSchema);
