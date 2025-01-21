const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "paid"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

// 🔍 **Ensure One Payment Per User Per Event**
paymentSchema.index({ eventId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Payment", paymentSchema);
