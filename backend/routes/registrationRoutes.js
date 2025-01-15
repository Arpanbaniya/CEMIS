// routes/registrationRoutes.js
const express = require("express");
const router = express.Router();
const Registration = require("../models/Registration");
const Event = require("../models/Event");
const authMiddleware = require("../middlewares/authMiddleware");

// 1) POST /api/registrations
router.post("/", authMiddleware, async (req, res) => {
  const {
    eventId,
    name,
    rollNo,
    program,
    semester,
    phone,
    email,     // possible in req.body, or from token
    role,      // if provided, else defaults to 'main'
    teamName,  // only required for sports/tech
    gender,    // only required for sports/tech
  } = req.body;

  // Basic required fields (common to all events)
  if (!eventId || !rollNo || !name || !program || !semester || !phone) {
    return res
      .status(400)
      .json({ message: "Missing required fields: eventId, rollNo, name, program, semester, phone." });
  }

  try {
    // The authenticated user (from token)
    const userId = req.user.id;
    const userEmail = req.user.email; // Typically the token user’s email
    // Fetch the event to check its category, team capacity, etc.
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    // If this is a sports or tech event, require teamName and gender
    if ((event.category === "sports" || event.category === "tech")) {
      if (!teamName) {
        return res
          .status(400)
          .json({ message: "teamName is required for sports/tech events." });
      }
      if (!gender) {
        return res
          .status(400)
          .json({ message: "gender is required for sports/tech events." });
      }
    }

    // If the event requires teams, validate capacity
    if (event.teamRequired) {
      const totalTeamCapacity = event.teamMembers + event.substitutes;
      const teamRegistrations = await Registration.find({ eventId, teamName });
      if (teamRegistrations.length >= totalTeamCapacity) {
        return res
          .status(400)
          .json({ message: `Team ${teamName} is already full.` });
      }
    }

    // Prevent duplicate registration by same user for the same event
    const existingRegistration = await Registration.findOne({
      eventId,
      email: userEmail,
    });
    if (existingRegistration) {
      return res
        .status(400)
        .json({ message: "You have already registered for this event." });
    }

    // Create a new Registration document
    const newRegistration = new Registration({
      eventId,
      userId,
      name,
      rollNo,
      program,
      semester,
      phone,
      email: userEmail,  // or 'email' from req.body
      teamName: teamName || "", 
      gender: gender || "",      // only set if provided
      role: role || "main",
    });

    await newRegistration.save();
    return res.status(201).json({ message: "Registered successfully!" });
  } catch (error) {
    console.error("Error registering for event:", error);

    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "You have already registered for this event." });
    }
    return res.status(500).json({ message: "Error registering for event." });
  }
});

// 2) GET /api/registrations
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const registrations = await Registration.find({ userId }).populate("eventId");
    res.status(200).json(registrations);
  } catch (error) {
    console.error("Error fetching registrations:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// 3) GET /api/registrations/event/:eventId
router.get("/event/:eventId", authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.params;
    const registrations = await Registration.find({ eventId }).populate("eventId");

    // Group participants by team
    const teams = {};
    registrations.forEach((reg) => {
      if (!teams[reg.teamName]) {
        teams[reg.teamName] = [];
      }
      teams[reg.teamName].push(reg);
    });

    // Sort participants by semester or another field
    Object.keys(teams).forEach((team) => {
      teams[team] = teams[team].sort((a, b) => {
        return parseInt(a.semester, 10) - parseInt(b.semester, 10);
      });
    });

    return res.status(200).json(teams);
  } catch (error) {
    console.error("Error fetching participants for event:", error);
    return res.status(500).json({ message: "Failed to fetch participants." });
  }
});

// 4) GET /api/registrations/team/:eventId/:teamName
router.get("/team/:eventId/:teamName", authMiddleware, async (req, res) => {
  try {
    const { eventId, teamName } = req.params;
    const registrations = await Registration.find({ eventId, teamName });
    res.status(200).json(registrations);
  } catch (error) {
    console.error("Error fetching team members:", error);
    res.status(500).json({ message: "Failed to fetch team members." });
  }
});

// 5) PUT /api/registrations/:participantId/role
router.put("/:participantId/role", authMiddleware, async (req, res) => {
  const { participantId } = req.params;
  const { role } = req.body;
  try {
    const registration = await Registration.findById(participantId);
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }
    registration.role = role;
    await registration.save();
    res.json({ message: "Role updated successfully", registration });
  } catch (error) {
    console.error("Error toggling role:", error);
    res.status(500).json({ message: "Failed to update role." });
  }
});

module.exports = router;
