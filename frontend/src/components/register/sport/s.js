import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function S() {
  const [events, setEvents] = useState([]);
  const [isRegistering, setIsRegistering] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    program: "",
    semester: "",
    phone: "",
    email: "",
    gender: "Male", 
    role: "main", 
  });

  // Track which team is currently expanded for each event
  const [activeTeam, setActiveTeam] = useState({});
  // Stores the list of registered team members for each (eventId-teamName)
  const [registeredTeamMembers, setRegisteredTeamMembers] = useState({});
  // Track user’s existing registrations to disable repeated event registration
  const [userRegistrations, setUserRegistrations] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Sports Events";
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Decode the token to get email
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        setFormData((prevData) => ({
          ...prevData,
          email: decodedToken.email || "",
        }));
        fetchEvents(token);
        fetchUserRegistrations(token);
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
      const response = await fetch("http://localhost:5000/api/events?category=sports", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  const fetchUserRegistrations = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/api/registrations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserRegistrations(data); // Array of registrations
      }
    } catch (error) {
      console.error("Error fetching user registrations:", error);
    }
  };

  const fetchTeamMembers = async (eventId, teamName) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/registrations/team/${eventId}/${teamName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const teamMembers = await response.json();
        setRegisteredTeamMembers((prev) => ({
          ...prev,
          [`${eventId}-${teamName}`]: teamMembers,
        }));
      } else {
        console.error("Failed to fetch team members");
      }
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  // Toggle the registration form for a specific event
  const handleRegister = (eventId) => {
    setIsRegistering((prev) => (prev === eventId ? null : eventId));
  };
  

  const toggleTeamExpansion = (eventId, team) => {
    setActiveTeam((prev) => {
      const isSameTeam = prev[eventId] === team;
      if (!isSameTeam) fetchTeamMembers(eventId, team);
      return isSameTeam ? { ...prev, [eventId]: null } : { ...prev, [eventId]: team };
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e, eventId, eventName, teamName) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/registrations",
        {
          ...formData,
          eventId,
          eventName,
          teamName,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message);

      // Refresh the team members list immediately
      fetchTeamMembers(eventId, teamName);
      // Re-fetch user registrations so we can disable future registrations for this event
      fetchUserRegistrations(token);

      // Close the registration form once done
      setIsRegistering(null);
    } catch (error) {
      console.error("Error registering for the event:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Registration failed.");
    }
  };

  const styles = {
    page: {
      padding: "2rem",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f4f4f4",
      minHeight: "100vh",
    },
    heading: {
      textAlign: "center",
      fontSize: "2.5rem",
      marginBottom: "2rem",
    },
    eventContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "20px",
      justifyContent: "center",
    },
    eventBox: {
      backgroundColor: "#fff",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      padding: "1rem",
      width: "300px",
      textAlign: "center",
    },
    registerButton: {
      padding: "10px 15px",
      backgroundColor: "#007BFF",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginTop: "1rem",
    },
    disabledButton: {
      padding: "10px 15px",
      backgroundColor: "#aaa",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "not-allowed",
      marginTop: "1rem",
    },
    teamList: {
      textAlign: "left",
      marginTop: "1rem",
    },
    teamItem: {
      cursor: "pointer",
      color: "#007BFF",
      textDecoration: "underline",
      marginBottom: "10px",
    },
    formContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      padding: "10px",
      backgroundColor: "#fff",
      borderRadius: "10px",
    },
    formLabel: {
      fontWeight: "bold",
    },
    submitButton: {
      padding: "10px",
      backgroundColor: "#28a745",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
    },
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Sports Events</h1>
      <div style={styles.eventContainer}>
        {events.map((event) => {
          // Check if user is already registered for this event:
          const userIsRegistered = userRegistrations.some(
            (reg) => reg.eventId && reg.eventId._id === event._id
          );

          return (
            <div key={event._id} style={styles.eventBox}>
              <h3>{event.name}</h3>
              <p>Location: {event.location}</p>
              <p>Date: {event.date}</p>
              <p>Time: {event.time}</p>
              <p>Contact: {event.contact}</p>
              <p>Info: {event.info}</p>

              {/* Disable the register button if user is already registered */}
              <button
                style={userIsRegistered ? styles.disabledButton : styles.registerButton}
                onClick={() => !userIsRegistered && handleRegister(event._id)}
                disabled={userIsRegistered}
              >
                {userIsRegistered
                  ? "Already Registered"
                  : isRegistering === event._id
                  ? "Close Registration"
                  : "Register"}
              </button>

              {isRegistering === event._id && !userIsRegistered && (
                <div style={styles.teamList}>
                  {Array.from({ length: event.teams }, (_, i) => `Team ${i + 1}`).map((team) => (
                    <div key={team}>
                      <div
                        style={styles.teamItem}
                        onClick={() => toggleTeamExpansion(event._id, team)}
                      >
                        {activeTeam[event._id] === team ? `▼ ${team}` : `▶ ${team}`}
                      </div>

                      {activeTeam[event._id] === team && (
                        <div>
                          <p>Registered Team Members:</p>
                          <ul>
                            {registeredTeamMembers[`${event._id}-${team}`]?.length > 0 ? (
                              registeredTeamMembers[`${event._id}-${team}`].map((member, index) => (
                                <li key={index}>{member.name}</li>
                              ))
                            ) : (
                              <li>No members registered yet.</li>
                            )}
                          </ul>

                          <div style={styles.formContainer}>
                            <form
                              onSubmit={(e) => handleSubmit(e, event._id, event.name, team)}
                            >
                              <label style={styles.formLabel}></label>
                              <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                              />

                              <label style={styles.formLabel}></label>
                              <input
                                type="text"
                                name="rollNo"
                                placeholder="Roll Number"
                                value={formData.rollNo}
                                onChange={handleInputChange}
                                required
                              />

<label style={styles.formLabel}></label>
                              <input
                                type="text"
                                name="phone"
                                placeholder="Phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                              />
<label style={styles.formLabel}></label>
                              <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                readOnly
                              />

                              <label style={styles.formLabel}></label>
                              <select
                                name="program"
                                value={formData.program}
                                onChange={handleInputChange}
                                required
                              >
                                <option value="">Select Program</option>
                                <option value="BE CE">BE CE</option>
                                <option value="BE CIVIL">BE CIVIL</option>
                                <option value="BE SOFTWARE">BE SOFTWARE</option>
                                <option value="BCA">BCA</option>
                                <option value="BBA">BBA</option>
                                <option value="IT">IT</option>
                              </select>
<br></br>
                              <label style={styles.formLabel}></label>
                              <select
                                name="semester"
                                value={formData.semester}
                                onChange={handleInputChange}
                                required
                              >
                                <option value="">Select Semester</option>
                                {[...Array(8)].map((_, i) => (
                                  <option key={i + 1} value={i + 1}>
                                    {i + 1}
                                  </option>
                                ))}
                              </select>
                              <br></br>
                              <label style={styles.formLabel}>Gender:</label>
                              <div>
                                <label>
                                  <input
                                    type="radio"
                                    name="gender"
                                    value="Male"
                                    checked={formData.gender === "Male"}
                                    onChange={handleInputChange}
                                  />
                                  Male
                                </label>
                                <label>
                                  <input
                                    type="radio"
                                    name="gender"
                                    value="Female"
                                    checked={formData.gender === "Female"}
                                    onChange={handleInputChange}
                                  />
                                  Female
                                </label>
                              </div>

                              

                              

                              <label style={styles.formLabel}>Role:</label>
                              <select
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                required
                              >
                                <option value="main">Main</option>
                                <option value="sub">Sub</option>
                              </select>
                              <br></br><br></br>
                              <button type="submit" style={styles.submitButton}>
                                Submit
                              </button>
                            </form>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default S;
