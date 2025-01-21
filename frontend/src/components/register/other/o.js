import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function O() {
  const [events, setEvents] = useState([]);
  const [isRegistering, setIsRegistering] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    program: "",
    semester: "",
    phone: "",
    email: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Welcome Events";
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/userlogin");
    } else {
      validateToken(token);
    }
  }, [navigate]);

  const validateToken = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/api/users/userfp", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        setFormData((prevData) => ({ ...prevData, email: decodedToken.email || "" }));
        fetchEvents(token);
      } else {
        localStorage.removeItem("token");
        navigate("/userlogin");
      }
    } catch (error) {
      console.error("Error validating token:", error);
      localStorage.removeItem("token");
      navigate("/userlogin");
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
        ...prevData,
        [name]: value,
    }));
};


  const fetchEvents = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/api/events?category=Other", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        console.error("Failed to fetch events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleRegister = (event) => {
    if (isRegistering && isRegistering._id === event._id) {
        setIsRegistering(null); // Hide form if already open
    } else {
        setIsRegistering(event); // Store full event object
    }
  };
  

const handleSubmit = async (e, event) => {
  e.preventDefault();

  if (isProcessing) return; // Prevent duplicate submissions
  setIsProcessing(true);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user._id : null;
  const email = user ? user.email : null;

  if (!userId) {
    alert("User ID is missing. Please log in again.");
    setIsProcessing(false);
    return;
  }

  try {
    let paymentSuccess = true;

    // 💳 **Process Payment First (If Required)**
    if (event.paymentRequired) {
      const paymentResponse = await axios.post(
        "http://localhost:5000/api/payments/pay",
        {
          eventId: event._id,
          userId,
          email,
          name: formData.name,
          phone: formData.phone,
          rollNo: formData.rollNo,
          program: formData.program,
          semester: formData.semester,
          amount: event.amount || 0,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("DEBUG: Payment Response:", paymentResponse.data);

      if (!paymentResponse.data.success) {
        alert("Payment failed: " + paymentResponse.data.message);
        setIsProcessing(false);
        return;
      }
    }

    // ✅ **Update UI immediately before sending request**
    setRegisteredEvents((prev) => [...prev, event._id]);
    setIsRegistering(null); 

    // 📝 **Proceed with Registration After Successful Payment**
    const registrationResponse = await axios.post(
      "http://localhost:5000/api/registrations",
      { ...formData, eventId: event._id, userId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("DEBUG: Registration Response:", registrationResponse.data);

    if (registrationResponse.data.success) {
      setRegisteredEvents((prev) => [...prev, event._id]); // Ensure state updates
      console.log("DEBUG: Registration Successful!");

    } else {
      console.error("Error:", registrationResponse.data.message);
    
    }
  } catch (error) {
    console.error("Error registering for the event:", error);
    alert(error.response?.data?.message || "Registration failed.");
  }

  setIsProcessing(false);
};



  const styles = {
    page: {
      padding: '2rem',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f4f4f4',
      minHeight: '100vh',
    },
    heading: {
      textAlign: 'center',
      fontSize: '2.5rem',
      marginBottom: '2rem',
    },
    eventContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '20px',
      justifyContent: 'center',
    },
    eventBox: {
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      padding: '1rem',
      width: '300px',
      textAlign: 'center',
    },
    registerButton: {
      padding: '10px 15px',
      backgroundColor: '#007BFF',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      marginTop: '1rem',
    },
    form: {
      marginTop: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    submitButton: {
      padding: '10px',
      backgroundColor: '#28a745',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Other Events</h1>
      <div style={styles.eventContainer}>
        {events.map((event) => (
          <div key={event._id} style={styles.eventBox}>
            <h3>{event.name}</h3>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Date:</strong> {event.date}</p>
            <p><strong>Time:</strong> {event.time}</p>
            <p><strong>Contact:</strong> {event.contact}</p>
            <p><strong>Payment Amt:</strong> {event.amount+"$"}</p>
            
            <p><strong>Event Information:</strong> {event.info}</p> {/* New info field */}

            {!registeredEvents.includes(event._id) ? (
              <button style={styles.registerButton} onClick={() => handleRegister(event)}>
              {isRegistering && isRegistering._id === event._id ? "Cancel" : "Register"}
            </button>
            
            ) : (
              <p style={{ color: "green", fontWeight: "bold" }}>Registered</p>
            )}
            
            {isRegistering && isRegistering._id === event._id && (

  <form style={styles.form} onSubmit={(e) => handleSubmit(e, event)}>
    <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} required />
    <input type="text" name="rollNo" placeholder="Roll Number" value={formData.rollNo} onChange={handleInputChange} required />

    <select name="program" value={formData.program} onChange={handleInputChange} required>
      <option value="">Select Program</option>
      <option value="BE CE">BE CE</option>
      <option value="BE CIVIL">BE CIVIL</option>
      <option value="BE SOFTWARE">BE SOFTWARE</option>
      <option value="BCA">BCA</option>
      <option value="BBA">BBA</option>
      <option value="IT">IT</option>
    </select>

    <select name="semester" value={formData.semester} onChange={handleInputChange} required>
      <option value="">Select Semester</option>
      {[...Array(8)].map((_, i) => (
        <option key={i + 1} value={i + 1}>{i + 1}</option>
      ))}
    </select>

    <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} required />
    <input type="email" name="email" placeholder="Email" value={formData.email} readOnly />

    {/* ✅ Payment Fields (Only if Payment is Required) */}
    {event.paymentRequired && (
      <>
        <h3>Payment Details</h3>
        <p><strong>Amount:</strong> ${event.amount}</p>
        
        <input
          type="text"
          name="cardNumber"
          placeholder="Card Number (Only 4242 4242 4242 4242 Allowed)"
          value={formData.cardNumber}
          onChange={handleInputChange}
          required
        />
        
        <div style={{ display: "flex", gap: "10px" }}>
          <input type="text" name="expiryMonth" placeholder="MM" value={formData.expiryMonth} onChange={handleInputChange} required />
          <input type="text" name="expiryYear" placeholder="YY" value={formData.expiryYear} onChange={handleInputChange} required />
          <input type="text" name="cvv" placeholder="CVV" value={formData.cvv} onChange={handleInputChange} required />
        </div>
      </>
    )}

    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <button type="button" onClick={() => setIsRegistering(null)} style={styles.cancelButton}>Cancel</button>
      <button type="submit" style={styles.submitButton}>Submit</button>
    </div>
  </form>
)}

          </div>
        ))}
      </div>
    </div>
  );
}

export default O;
