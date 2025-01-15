const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("../utils/sendgrid");
const User = require("../models/User");

// Middleware for protected routes
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired. Please log in again." });
    }
    console.error("Invalid token:", error);
    return res.status(400).json({ message: "Invalid token." });
  }
};

// Signup Route
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, verified: false });
    await newUser.save();

    try {
      await sendVerificationEmail(email);
      res.status(200).json({ message: "Verification email sent. Please verify your account." });
    } catch (emailError) {
      console.error("Error sending verification email:", emailError);
      return res.status(500).json({ message: "Error sending verification email." });
    }
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ message: "Error signing up." });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password." });
    }
    if (!user.verified) {
      return res.status(400).json({ message: "Please verify your email to log in." });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1hr",
    });

    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in." });
  }
});

// Verification Route
router.get("/verify/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOneAndUpdate({ email }, { verified: true }, { new: true });
    if (!user) {
      return res.status(400).send("User not found.");
    }
    res.status(200).send("Your account has been successfully verified!");
  } catch (error) {
    console.error("Error verifying account:", error);
    res.status(500).send("Error verifying account.");
  }
});

// Protected Route for UserFP
router.get("/userfp", authMiddleware, async (req, res) => {
  try {
    res.status(200).json({
      message: "Access granted to UserFP page.",
      user: req.user,
    });
  } catch (error) {
    console.error("Error accessing UserFP:", error);
    res.status(500).json({ message: "Error accessing UserFP page." });
  }
});

// Example Protected Route
router.get("/protected", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Access granted to protected route.", user: req.user });
});

module.exports = router;
