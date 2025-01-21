const express = require("express");
const router = express.Router();
const { processPayment } = require("../controllers/paymentController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/pay", authMiddleware, processPayment);

module.exports = router;
