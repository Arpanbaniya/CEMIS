// models/Registration.js
const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  rollNo: { type: String, required: true },
  program: { type: String, required: true },
  semester: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  teamName: { type: String, required: false },
  teams: { type: Number, default: 0 },
  teamMembers: { type: Number, default: 0 },
  substitutes: { type: Number, default: 0 },
  paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
  // Ensure we store gender so the tie sheet can split into Male / Female brackets
  gender: { 
    type: String, 
    enum: ["Male", "Female", ""], 
    required: false 
  },
  // Added role field to allow toggling between "main" and "sub"
  role: { 
    type: String, 
    enum: ["main", "sub"], 
    default: "main" 
  },
  createdAt: { type: Date, default: Date.now },
});

// Prevent duplicate registration for the same event + team
registrationSchema.index({ email: 1, eventId: 1, teamName: 1 }, { unique: true });

module.exports = mongoose.model("Registration", registrationSchema);
