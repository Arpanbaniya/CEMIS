import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AboutUs() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/userlogin"); // Redirect to login if no token
    } else {
      validateToken(token);
    }
  }, [navigate]);

  const validateToken = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/api/users/protected", {
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
    } else if (destination === "logout") {
      navigate("/userlogin");
    }
  };

  return (
    <div className="AboutUs">
      <header style={headerStyles}>
        <div className="logo" style={logoStyles}>STARK</div>
        <nav>
          <ul style={navStyles}>
            <li><button style={buttonStyles} onClick={() => handleNavigation("home")}>Home</button></li>
            <li><button style={buttonStyles} onClick={() => handleNavigation("about")}>About Us</button></li>
            <li><button style={buttonStyles} onClick={() => handleNavigation("contact")}>Contact</button></li>
            <li><button style={buttonStyles} onClick={() => handleNavigation("logout")}>Logout</button></li>
          </ul>
        </nav>
      </header>

      <main style={mainStyles}>
        <p style={paragraphStyles}>Welcome to the About Us page. Learn more about our mission and values.</p>
        <p style={paragraphStyles}>
          STARK, affiliated to Nepal College of Information Technology (NCIT), Balkumari, Lalitpur, was developed in 
          order to manage the events in college. This visionary group is committed to developing STARK as a paradigm.
        </p>
        <p style={paragraphStyles}>
          We facilitate online registration and ticketing, providing a convenient way for participants to sign up for 
          events and secure their attendance. As a secure and accessible solution, the college event management 
          system enhances the overall experience for both organizers and participants, fostering a vibrant and 
          engaging campus community.
        </p>
        <p style={paragraphStyles}>We would like everyone to participate cheerfully in every event.</p>
      </main>

      <footer style={footerStyles}>
        <div style={footerContentStyles}>
          <div style={contactSectionStyles}>
            <h4 style={contactHeaderStyles}>Contact</h4>
            <p style={contactTextStyles}>Email: info@stark.com</p>
            <p style={contactTextStyles}>Phone: 123-456-7890</p>
          </div>
          <div style={socialSectionStyles}>
            <div>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/images/instagram.png"
                  alt="Instagram"
                  style={largeIconStyles}
                />
              </a>
              <p>Instagram</p>
            </div>
            <div>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/images/facebook.png"
                  alt="Facebook"
                  style={largeIconStyles}
                />
              </a>
              <p>Facebook</p>
            </div>
          </div>
        </div>
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

const buttonStyles = {
  padding: "10px 15px",
  fontSize: "16px",
  backgroundColor: "#fff",
  border: "1px solid #ccc",
  borderRadius: "5px",
  cursor: "pointer",
  textTransform: "uppercase",
};

const mainStyles = {
  textAlign: "center",
  padding: "4rem 0",
  backgroundColor: "#f4f4f4",
  minHeight: "calc(100vh - 160px)",
};

const paragraphStyles = {
  fontSize: "1.2rem",
  margin: "2rem auto",
  maxWidth: "600px",
  lineHeight: "1.6",
};

const footerStyles = {
  backgroundColor: "#333",
  color: "#fff",
  textAlign: "center",
  padding: "1rem 2rem",
  boxShadow: "0 -4px 6px rgba(0, 0, 0, 0.1)",
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

export default AboutUs;
