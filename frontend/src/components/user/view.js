// components/user/view.js (example)

import React, { useState, useEffect } from "react";

function View() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/registrations", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch registrations.");
        }

        const data = await response.json();
        setRegistrations(data); // data will include populated eventId
        setLoading(false);
      } catch (err) {
        console.error("Error fetching registrations:", err);
        setError("Error fetching registrations. Please try again later.");
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  if (loading) {
    return <div style={loadingStyles}>Loading your registered events...</div>;
  }

  if (error) {
    return <div style={errorStyles}>{error}</div>;
  }

  return (
    <div style={viewStyles}>
      <h1>Your Registered Events</h1>
      {registrations.length === 0 ? (
        <p style={noEventsStyles}>You have not registered for any events yet.</p>
      ) : (
        <ul style={listStyles}>
          {registrations.map((registration) => {
            // registration.eventId is now an object with the event fields
            const { name, location, date, time } = registration.eventId || {};

            return (
              <li key={registration._id} style={itemStyles}>
                <h3 style={eventNameStyles}>Event: {name}</h3>
                <p><strong>Location:</strong> {location}</p>
                <p><strong>Date:</strong> {date}</p>
                <p><strong>Time:</strong> {time}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}



// CSS styles remain the same as before


// Styles
const viewStyles = {
  padding: "20px",
  fontFamily: "Arial, sans-serif",
  textAlign: "center",
};

const listStyles = {
  listStyleType: "none",
  padding: 0,
};

const itemStyles = {
  margin: "10px 0",
  padding: "15px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  textAlign: "left",
  backgroundColor: "#f9f9f9",
};

const eventNameStyles = {
  fontSize: "1.5rem",
  marginBottom: "10px",
};

const noEventsStyles = {
  fontSize: "1.2rem",
  color: "#555",
};

const loadingStyles = {
  fontSize: "1.2rem",
  color: "#555",
  textAlign: "center",
  marginTop: "20px",
};

const errorStyles = {
  fontSize: "1.2rem",
  color: "red",
  textAlign: "center",
  marginTop: "20px",
};

export default View;
