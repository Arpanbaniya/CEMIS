import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './button.css';
function UserFP() {
  const navigate = useNavigate();

  useEffect(() => {
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

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/userlogin");
      } else if (!response.ok) {
        throw new Error("Token validation failed");
      }
    } catch (error) {
      console.error("Error validating token:", error);
      localStorage.removeItem("token");
      navigate("/userlogin");
    }
  };

  const handleNavigation = (destination) => {
    if (destination === "home") {
      navigate("/userfp");
    } else if (destination === "contact") {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } else if (destination === "about") {
      navigate("/aboutus");
    } else if (destination === "viewRegistrations") {
      navigate("/view"); // Navigate to View Registrations page
    } else if (destination === "logout") {
      localStorage.removeItem("token");
      navigate("/userlogin");
    }
  };

  return (
    <div className="UserFP">
      <header style={headerStyles}>
        <div className="logo" style={logoStyles}>STARK</div>
        <nav>
          <ul style={navStyles}>
            
            
            <li>
              <button  onClick={() => handleNavigation("viewRegistrations")}>
                View Registrations
              </button>
            </li>
            <li>
              <button  onClick={() => handleNavigation("logout")}>Logout</button>
            </li>
          </ul>
        </nav>
      </header>

      <main style={mainStyles}>
        <h2 style={mainHeadingStyles}>Find Your Next Event</h2>
        <div style={boxContainerStyles}>
          <div style={{ ...boxStyles, backgroundColor: "#ffcccb" }} onClick={() => navigate("/register/w")}>
            <h2>Welcome Events</h2>
            <p style={boxDescriptionStyles}>Discover events welcoming new members with joy and enthusiasm.</p>
          </div>
          <div style={{ ...boxStyles, backgroundColor: "#add8e6" }} onClick={() => navigate("/register/f")}>
            <h2>Farewell Events</h2>
            <p style={boxDescriptionStyles}>Celebrate memories and bid goodbye with love and grace.</p>
          </div>
        </div>

        <div style={boxContainerStyles}>
          <div style={{ ...boxStyles, backgroundColor: "#90ee90" }} onClick={() => navigate("/register/s")}>
            <h2>Sport Events</h2>
            <p style={boxDescriptionStyles}>Join thrilling sports events and show your competitive spirit.</p>
          </div>
          <div style={{ ...boxStyles, backgroundColor: "#ffa07a" }} onClick={() => navigate("/register/t")}>
            <h2>Tech Events</h2>
            <p style={boxDescriptionStyles}>Innovate, explore, and stay ahead with the latest tech events.</p>
          </div>
        </div>

        <div style={boxContainerStyles}>
          <div style={{ ...boxStyles, backgroundColor: "#f5deb3" }} onClick={() => navigate("/register/o")}>
            <h2>Other Events</h2>
            <p style={boxDescriptionStyles}>Explore other exciting events happening near you.</p>
          </div>
        </div>
      </main>

      <footer style={footerStyles}>
    <p style={footerTextStyles}>© 2024 Events. All rights reserved.</p>
  </footer>
    </div>
  );
}

// Styles
// (Keep your existing styles intact as provided in your code
// Styles
const headerStyles = {
  backgroundColor: "#333",
  color: "#fff",
  padding: "0.5rem 2rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const logoStyles = {
  fontSize: "22px",
  fontWeight: "bold",
};

const navStyles = {
  listStyle: "none",
  display: "flex",
  gap: "15px",
};


const mainStyles = {
  textAlign: "center",
  padding: "4rem 0",
  backgroundColor: "#f4f4f4",
};

const mainHeadingStyles = {
  fontSize: "2rem",
  marginBottom: "1rem",
};

const boxContainerStyles = {
  display: "flex",
  justifyContent: "center",
  gap: "20px",
  flexWrap: "wrap",
  marginBottom: "30px",
};

const boxStyles = {
  width: "300px",
  height: "auto",
  backgroundColor: "#f4f4f4",
  color: "#000",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "1.2rem",
  fontWeight: "bold",
  border: "1px solid #ccc",
  borderRadius: "5px",
  margin: "10px",
  padding: "1rem",
  textAlign: "center",
  transition: "transform 0.3s, box-shadow 0.3s",
  cursor: "pointer",
};

const boxDescriptionStyles = {
  marginTop: "10px",
  fontSize: "1rem",
  color: "#555",
};

const footerStyles = {
  backgroundColor: "#333",
  color: "#fff",
  textAlign: "center",
  padding: "1rem 2rem",
  boxShadow: "0 -4px 6px rgba(0, 0, 0, 0.1)",
};
const footerTextStyles = {
  margin: '0',
  fontSize: '1rem'
};

const footerContentStyles = {
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  padding: "1rem",
};

const contactSectionStyles = {
  textAlign: "left",
  padding: "0 1rem",
};

const contactHeaderStyles = {
  fontSize: "1.5rem",
  marginBottom: "0.5rem",
};

const contactTextStyles = {
  fontSize: "1rem",
};

const socialSectionStyles = {
  textAlign: "center",
  padding: "0 1rem",
};

const largeIconStyles = {
  width: "48px",
  height: "48px",
  margin: "10px auto",
};

export default UserFP;
