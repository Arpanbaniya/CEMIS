import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Sports() {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    date: "",
    time: "",
    contact: "",
    category: "sports",
    teamRequired: false,
    teamMembers: 0,
    substitutes: 0,
    teams: 0,
  });
  const [isCreating, setIsCreating] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingEventId, setViewingEventId] = useState(null);

  // Participants object: { teamName: [array of participants] }
  const [participants, setParticipants] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/events?category=sports"
      );
      if (!response.ok) throw new Error("Failed to fetch events");
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
        throw new Error(
          editingEvent ? "Failed to modify event" : "Failed to create event"
        );
      }

      alert(
        editingEvent
          ? "Event modified successfully!"
          : "Event created successfully!"
      );

      setFormData({
        name: "",
        location: "",
        date: "",
        time: "",
        contact: "",
        category: "sports",
        teamRequired: false,
        teamMembers: 0,
        substitutes: 0,
        teams: 0,
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
      const response = await fetch(
        `http://localhost:5000/api/registrations/event/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch participants");

      const data = await response.json(); 
      // Data is an object: { "Team 1": [...], "Team 2": [...], ... }
      setParticipants(data);
    } catch (error) {
      console.error("Error fetching participants:", error);
      setParticipants({});
    }
  };

  const handleGenerateTieSheet = () => {
    if (!participants || Object.keys(participants).length === 0) {
      alert("No participants to generate a tie sheet.");
      return;
    }
    navigate("/events/TieSheet", { state: { participants } });
  };

  // Toggle role between "main" and "sub"
  const toggleRole = async (participantId, currentRole) => {
    const newRole = currentRole === "main" ? "sub" : "main";
    try {
      const response = await fetch(
        `http://localhost:5000/api/registrations/${participantId}/role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update role");
      }

      // Re-fetch participant list for the current event
      if (viewingEventId) {
        handleViewParticipants(viewingEventId);
      }
    } catch (error) {
      console.error("Error toggling role:", error);
    }
  };

  // --- STYLES (Note: container width and maxWidth updated) ---
  const styles = {
    container: {
      width: "80%", // expanded from 100%/600px to allow more table room
      maxWidth: "1200px",
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
    toggleButton: {
      padding: "5px 10px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    toggleButtonActive: {
      backgroundColor: "#28a745",
      color: "#fff",
    },
    toggleButtonInactive: {
      backgroundColor: "#dc3545",
      color: "#fff",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Sports Program Events</h1>
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
              category: "sports",
              teamRequired: false,
              teamMembers: 0,
              substitutes: 0,
              teams: 0,
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
          <div>
            <label>
              <input
                type="checkbox"
                name="teamRequired"
                checked={formData.teamRequired}
                onChange={handleInputChange}
              />
              Team Required?
            </label>
          </div>
          {formData.teamRequired && (
            <>
              <div>
                <label>Number of Main Team Members:</label>
                <select
                  name="teamMembers"
                  value={formData.teamMembers}
                  onChange={handleInputChange}
                  required
                >
                  <option value="0">0</option>
                  {[...Array(12).keys()].slice(1).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Number of Substitute Members:</label>
                <select
                  name="substitutes"
                  value={formData.substitutes}
                  onChange={handleInputChange}
                  required
                >
                  <option value="0">0</option>
                  {[...Array(12).keys()].slice(1).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Number of Teams:</label>
                <select
                  name="teams"
                  value={formData.teams}
                  onChange={handleInputChange}
                  required
                >
                  <option value="0">0</option>
                  {[...Array(16).keys()].slice(1).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
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
              <div>
                <button
                  style={{ ...styles.button, float: "right" }}
                  onClick={handleGenerateTieSheet}
                >
                  Generate Tie Sheet
                </button>
                {/* Participants grouped by team */}
                {participants && Object.keys(participants).length > 0 ? (
                  <>
                    {Object.entries(participants).map(([team, teamParticipants]) => (
                      <div key={team}>
                        <h3>{team}</h3>
                        <table style={styles.participantsTable}>
                          <thead>
                            <tr style={styles.tableHeader}>
                              <th style={styles.tableCell}>Name</th>
                              <th style={styles.tableCell}>Email</th>
                              <th style={styles.tableCell}>Roll No</th>
                              <th style={styles.tableCell}>Semester</th>
                              {/* NEW GENDER COLUMN */}
                              <th style={styles.tableCell}>Gender</th>
                              <th style={styles.tableCell}>Role</th>
                            </tr>
                          </thead>
                          <tbody>
                            {teamParticipants.map((p) => (
                              <tr key={p._id}>
                                <td style={styles.tableCell}>{p.name}</td>
                                <td style={styles.tableCell}>{p.email}</td>
                                <td style={styles.tableCell}>{p.rollNo}</td>
                                <td style={styles.tableCell}>{p.semester}</td>
                                {/* Show gender */}
                                <td style={styles.tableCell}>{p.gender}</td>
                                <td style={styles.tableCell}>
                                  <button
                                    style={{
                                      ...styles.toggleButton,
                                      ...(p.role === "main"
                                        ? styles.toggleButtonActive
                                        : styles.toggleButtonInactive),
                                    }}
                                    onClick={() => toggleRole(p._id, p.role)}
                                  >
                                    {p.role === "main" ? "Main" : "Sub"}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </>
                ) : (
                  <p>No participants found for this event.</p>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sports;
