import React, { useState, useEffect } from "react";

function F() {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    date: "",
    time: "",
    contact: "",
    category: "farewell",
  });
  const [isCreating, setIsCreating] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [viewingEventId, setViewingEventId] = useState(null);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/events?category=farewell");
      if (!response.ok) throw new Error("Failed to fetch events");
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingEvent
        ? `http://localhost:5000/api/events/${editingEvent._id}`
        : "http://localhost:5000/api/events";
      const method = editingEvent ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(editingEvent ? "Failed to modify event" : "Failed to create event");
      }

      alert(editingEvent ? "Event modified successfully!" : "Event created successfully!");

      setFormData({
        name: "",
        location: "",
        date: "",
        time: "",
        contact: "",
        category: "farewell",
      });
      setIsCreating(false);
      setEditingEvent(null);
      fetchEvents();
    } catch (error) {
      console.error("Error submitting event:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete event");
      }
      alert("Event deleted successfully!");
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleEdit = (eventObj) => {
    setEditingEvent(eventObj);
    setFormData(eventObj);
    setIsCreating(true);
  };

  const handleViewParticipants = async (eventId) => {
    setViewingEventId(eventId);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/registrations/event/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch participants");

      const data = await response.json();
      // data might be an array OR an object of teams. Flatten if object:
      if (Array.isArray(data)) {
        // The backend returned a simple array of participants
        setParticipants(data);
      } else {
        // The backend returned an object like { "Team 1": [...], "Team 2": [...] }
        let flattened = [];
        for (const teamName in data) {
          flattened = flattened.concat(data[teamName]);
        }
        setParticipants(flattened);
      }
    } catch (error) {
      console.error("Error fetching participants:", error);
      setParticipants([]);
    }
  };

  const styles = {
    container: {
      width: "100%",
      maxWidth: "600px",
      margin: "20px auto",
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
    },
    header: {
      fontSize: "2rem",
      marginBottom: "20px",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },
    input: {
      padding: "10px",
      fontSize: "16px",
      border: "1px solid #ccc",
      borderRadius: "5px",
    },
    button: {
      padding: "1em 2em",
      fontSize: "9px",
      textTransform: "uppercase",
      letterSpacing: "2.5px",
      fontWeight: "500",
      color: "#000",
      backgroundColor: "#fff",
      border: "none",
      borderRadius: "20px",
      boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease 0s",
      cursor: "pointer",
      outline: "none",
      margin: "5px",
    },
    buttonHover: {
      backgroundColor: "#ff5f57",
      boxShadow: "0px 15px 20px rgba(229, 67, 46, 0.4)",
      color: "#fff",
      transform: "translateY(-7px)",
    },
    eventList: {
      marginTop: "20px",
      textAlign: "left",
    },
    eventItem: {
      marginBottom: "20px",
      border: "1px solid #ccc",
      padding: "15px",
      borderRadius: "5px",
      backgroundColor: "#f9f9f9",
    },
    participantsContainer: {
      marginTop: "20px",
    },
    participantsTable: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "10px",
    },
    tableHeader: {
      backgroundColor: "#f4f4f4",
      fontWeight: "bold",
    },
    tableCell: {
      border: "1px solid #ddd",
      padding: "8px",
      textAlign: "left",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Farewell Program Events</h1>
      <button
        style={styles.button}
        onMouseEnter={(e) => Object.assign(e.target.style, styles.buttonHover)}
        onMouseLeave={(e) => Object.assign(e.target.style, styles.button)}
        onClick={() => {
          setIsCreating(!isCreating);
          if (editingEvent) {
            setEditingEvent(null);
            setFormData({
              name: "",
              location: "",
              date: "",
              time: "",
              contact: "",
              category: "farewell",
            });
          }
        }}
      >
        {isCreating ? "Close Form" : "Create Event"}
      </button>

      {isCreating && (
        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="text"
            name="name"
            placeholder="Event Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            style={styles.input}
            type="text"
            name="location"
            placeholder="Location/Venue"
            value={formData.location}
            onChange={handleInputChange}
            required
          />
          <input
            style={styles.input}
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
          <input
            style={styles.input}
            type="time"
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            required
          />
          <input
            style={styles.input}
            type="text"
            name="contact"
            placeholder="Contact"
            value={formData.contact}
            onChange={handleInputChange}
            required
          />
          <button type="submit" style={styles.button}>
            {editingEvent ? "Update Event" : "Create Event"}
          </button>
        </form>
      )}

      <h2>View Created Events</h2>
      <ul style={styles.eventList}>
        {events.map((evt) => (
          <li key={evt._id} style={styles.eventItem}>
            <strong>{evt.name}</strong> <br />
            Time: {evt.time} <br />
            Location: {evt.location} <br />
            Date: {evt.date} <br />
            Contact: {evt.contact} <br />
            <button
              style={styles.button}
              onMouseEnter={(e) => Object.assign(e.target.style, styles.buttonHover)}
              onMouseLeave={(e) => Object.assign(e.target.style, styles.button)}
              onClick={() => handleEdit(evt)}
            >
              Modify
            </button>
            <button
              style={styles.button}
              onMouseEnter={(e) => Object.assign(e.target.style, styles.buttonHover)}
              onMouseLeave={(e) => Object.assign(e.target.style, styles.button)}
              onClick={() => handleDelete(evt._id)}
            >
              Delete
            </button>
            <button
              style={styles.button}
              onMouseEnter={(e) => Object.assign(e.target.style, styles.buttonHover)}
              onMouseLeave={(e) => Object.assign(e.target.style, styles.button)}
              onClick={() => handleViewParticipants(evt._id)}
            >
              View Participants
            </button>

            {viewingEventId === evt._id && (
              <div style={styles.participantsContainer}>
                <h4>Participants</h4>
                {participants.length === 0 ? (
                  <p>No participants found for this event.</p>
                ) : (
                  <table style={styles.participantsTable}>
                    <thead>
                      <tr style={styles.tableHeader}>
                        <th style={styles.tableCell}>Name</th>
                        <th style={styles.tableCell}>Email</th>
                        <th style={styles.tableCell}>Program</th>
                        <th style={styles.tableCell}>Semester</th>
                        <th style={styles.tableCell}>Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participants.map((p) => (
                        <tr key={p._id}>
                          <td style={styles.tableCell}>{p.name}</td>
                          <td style={styles.tableCell}>{p.email}</td>
                          <td style={styles.tableCell}>{p.program}</td>
                          <td style={styles.tableCell}>{p.semester}</td>
                          <td style={styles.tableCell}>{p.phone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default F;
