const Payment = require("../models/Payment");
const Registration = require("../models/Registration");

const processPayment = async (req, res) => {
    try {
      const { eventId, userId, name, email, phone, rollNo, program, semester, amount } = req.body;
  
      if (!eventId || !userId || !amount || !name || !email || !phone || !rollNo || !program || !semester) {
        return res.status(400).json({ success: false, message: "Missing required registration details." });
      }
  
      // 🔍 **Check if the user has already made a payment for this event**
      const existingPayment = await Payment.findOne({ eventId, userId });
  
      if (existingPayment) {
        return res.status(400).json({ success: false, message: "Already Paid and Registered." });
      }
  
      // 💳 **Save Payment First**
      const payment = new Payment({
        eventId,
        userId,
        amount,
        status: "paid",
      });
  
      await payment.save();
  
      // 📝 **Check registration AFTER payment is saved**
      const existingRegistration = await Registration.findOne({ email, eventId });
  
      if (existingRegistration) {
        return res.status(400).json({ success: false, message: "You have already registered for this event." });
      }
  
      // 📝 **Save Registration After Payment**
      const registration = new Registration({
        eventId,
        userId,
        name,
        email,
        phone,
        rollNo,
        program,
        semester,
        paymentStatus: "paid",
      });
  
      await registration.save();
  
      return res.status(200).json({ success: true, message: "Payment and Registration Successful!" });
  
    } catch (error) {
      console.error("Error processing payment:", error);
      return res.status(500).json({ success: false, message: "Payment processing failed." });
    }
  };
  
module.exports = { processPayment };
