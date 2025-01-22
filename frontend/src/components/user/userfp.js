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
    if (destination === "sport") {
      setShowSportsOptions(true); // Show sports options
    } else if (destination === "viewRegistrations") {
      navigate("/view"); // Navigate to View Registrations page
    } else if (destination === "logout") {
      localStorage.removeItem("token");
      navigate("/userlogin");
    }else if (destination === 'tech') {
      setShowtechOptions(true);
    } 
    else {
      navigate(`/events/${destination}`); // Default navigation for other events
    }
  };
    const [showSportsOptions, setShowSportsOptions] = useState(false);
  const [showtechOptions, setShowtechOptions] = useState(false);
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
          <div 
            style={{ ...boxStyles, backgroundColor: '#90ee90' }}
            onClick={() => handleNavigation('sport')}
          >
            <h2>Sports Week</h2>
            <p style={boxDescriptionStyles}>
              Game on!  
              Get ready to sweat, cheer, and win.  
              It's time for some sporting excitement! ⚽🏀
            </p>
          

          {showSportsOptions && (
          <div style={boxContainerStyles1}>
            <div 
              style={{ ...boxStyles2, backgroundColor: 'rgb(241 236 234)' }}
              onClick={() => navigate("/register/s")}
            >
              <h2>Team Events</h2>
              <p style={boxDescriptionStyles}>Compete in team-based sporting events! 🏆</p>
            </div>

            <div 
              style={{ ...boxStyles1, backgroundColor: 'rgb(241 236 234)' }}
              onClick={() => navigate("/register/s1")}
            >
              <h2>Individual Events</h2>
              <p style={boxDescriptionStyles}>Challenge yourself in solo competitions! 🏅</p>
            </div>
          </div>
        )}
</div>
<div 
            style={{ ...boxStyles, backgroundColor: '#ffa07a' }}
            onClick={() => handleNavigation('tech')}
          >
            <h2>Tech Events</h2>
            <p style={boxDescriptionStyles}>
              Innovate, create, and inspire.  
              Dive into the latest trends and breakthroughs in tech! 🚀
            </p>
            {showtechOptions && (
          <div style={boxContainerStyles1}>
            <div 
              style={{ ...boxStyles2, backgroundColor: 'rgb(241 236 234)' }}
              onClick={() => navigate("/register/t")}
            >
              <h2>Team Events</h2>
              <p style={boxDescriptionStyles}>Compete in team-based sporting events! 🏆</p>
            </div>

            <div 
              style={{ ...boxStyles1, backgroundColor: 'rgb(241 236 234)' }}
              onClick={() => navigate("/register/t1")}
            >
              <h2>Individual Events</h2>
              <p style={boxDescriptionStyles}>Challenge yourself in solo competitions! 🏅</p>
            </div>
          </div>
        )}
          </div>
        </div>

        
        <div style={boxContainerStyles}> 
          <div 
          style={{ ...boxStyles, backgroundColor: '#f0e68c' }}
          onClick={() => navigate("/register/o")}
        >
          <h2>Other Events</h2>
          <p style={boxDescriptionStyles}>
            Something unique awaits you!  
            Stay tuned for more engaging and surprising events. 🌟
          </p>
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


const boxStyles = {
  width: '45%',
  height: 'auto',
  backgroundColor: '#f4f4f4',
  color: '#000',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  border: '1px solid #ccc',
  borderRadius: '10px',
  margin: '10px',
  padding: '1rem',
  textAlign: 'center',
  transition: 'transform 0.3s, box-shadow 0.3s',
  cursor: 'pointer',
};

const boxContainerStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center', // Aligns items in the same row
  gap: '20px',
  flexWrap: 'wrap',
  marginBottom: '30px',
};


const boxContainerStyles1 = {
  display: 'flex',
  justifyContent: 'center',  // Centers items horizontally
  alignItems: 'center',      // Aligns them in the same row
  gap: '40px',               // Adds space between the boxes
  flexWrap: 'nowrap',        // Ensures they don't wrap into a new line
  width: '100%',             // Ensures full width
};

const boxStyles1 = {
  width: '350px',            // Set a fixed width that allows two boxes to fit in one row
  height: 'auto',
  backgroundColor: '#f4f4f4',
  color: '#000',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  border: '1px solid #ccc',
  borderRadius: '10px',
  padding: '1rem',
  textAlign: 'center',
  transition: 'transform 0.3s, box-shadow 0.3s',
  cursor: 'pointer',
};

const boxStyles2 = {
  width: '350px',            // Set a fixed width that allows two boxes to fit in one row
  height: 'auto',
  backgroundColor: '#f4f4f4',
  color: '#000',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  border: '1px solid #ccc',
  borderRadius: '10px',
  padding: '1rem',
  textAlign: 'center',
  transition: 'transform 0.3s, box-shadow 0.3s',
  cursor: 'pointer',
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



export default UserFP;
