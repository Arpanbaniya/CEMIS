import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function W() {
  const [events, setEvents] = useState([]);
  const [isRegistering, setIsRegistering] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    program: "",
    semester: "",
    phone: "",
    email: "",
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

  const fetchEvents = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/api/events?category=welcome", {
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

  const handleRegister = (eventId) => {
    setIsRegistering(eventId);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e, eventId, eventName) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/registrations",
        { ...formData, eventId, eventName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message);
      setRegisteredEvents((prev) => [...prev, eventId]);
      setIsRegistering(null);

      setTimeout(() => {
        setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId));
      }, 5000);
    } catch (error) {
      console.error("Error registering for the event:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Registration failed.");
    }
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
      <h1 style={styles.heading}>Welcome Events</h1>
      <div style={styles.eventContainer}>
        {events.map((event) => (
          <div key={event._id} style={styles.eventBox}>
            <h3>{event.name}</h3>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Date:</strong> {event.date}</p>
            <p><strong>Time:</strong> {event.time}</p>
            <p><strong>Contact:</strong> {event.contact}</p>
            <p><strong>Event Information:</strong> {event.info}</p> {/* New info field */}

            {!registeredEvents.includes(event._id) ? (
              <button style={styles.registerButton} onClick={() => handleRegister(event._id)}>
                Register
              </button>
            ) : (
              <p style={{ color: "green", fontWeight: "bold" }}>Registered</p>
            )}
            
            {isRegistering === event._id && (
              <form style={styles.form} onSubmit={(e) => handleSubmit(e, event._id, event.name)}>
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
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} required />
                <input type="email" name="email" placeholder="Email" value={formData.email} readOnly />
              
                <button type="submit" style={styles.submitButton}>
                  Submit
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default W;
