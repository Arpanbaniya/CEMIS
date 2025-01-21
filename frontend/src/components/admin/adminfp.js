import React, { useState } from 'react';
import './button.css'; 
import { useNavigate } from 'react-router-dom';

function AdminFP() {
  const navigate = useNavigate();

  const handleNavigation = (destination) => {
    if (destination === 'sport') {
      setShowSportsOptions(true);
    }else if (destination === 'tech') {
      setShowtechOptions(true);
    }
    else {
      navigate(`/events/${destination}`);
    }
  };
  const [showSportsOptions, setShowSportsOptions] = useState(false);
  const [showtechOptions, setShowtechOptions] = useState(false);
  return (
    <div className="App">
      <Header onNavigate={handleNavigation} />
      <Hero />
      <main id="manageEvents" style={mainStyles}>
        <h1 style={mainTextStyles}>Manage Events</h1>

        {/* Welcome and Farewell in one row */}
        <div style={boxContainerStyles}>
          <div 
            style={{ ...boxStyles, backgroundColor: '#ffcccb' }}
            onClick={() => handleNavigation('wc')}
          >
            <h2>Welcome Programs</h2>
            <p style={boxDescriptionStyles}>
              Hey there!  
              Thanks for joining. We’re thrilled to have you.  
              Welcome! Get ready for some amazing updates and experiences. 😊
            </p>
          </div>

          <div 
            style={{ ...boxStyles, backgroundColor: '#add8e6' }}
            onClick={() => handleNavigation('fare')}
          >
            <h2>Farewell Programs</h2>
            <p style={boxDescriptionStyles}>
              Every goodbye makes the next hello closer.  
              Celebrate the journey and bid farewell with grace and joy. 🥂
            </p>
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
              onClick={() => navigate('/events/sport')}
            >
              <h2>Team Events</h2>
              <p style={boxDescriptionStyles}>Compete in team-based sporting events! 🏆</p>
            </div>

            <div 
              style={{ ...boxStyles1, backgroundColor: 'rgb(241 236 234)' }}
              onClick={() => navigate('/events/sport1')}
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
              onClick={() => navigate('/events/tech')}
            >
              <h2>Team Events</h2>
              <p style={boxDescriptionStyles}>Compete in team-based sporting events! 🏆</p>
            </div>

            <div 
              style={{ ...boxStyles1, backgroundColor: 'rgb(241 236 234)' }}
              onClick={() => navigate('/events/tech1')}
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
          onClick={() => handleNavigation('other')}
        >
          <h2>Other Events</h2>
          <p style={boxDescriptionStyles}>
            Something unique awaits you!  
            Stay tuned for more engaging and surprising events. 🌟
          </p>
        </div>

        
          </div>
      </main>
      <Footer />
    </div>
  );
}

/* ---------------- HEADER ---------------- */
const Header = ({ onNavigate }) => {
  

  return (
    <header style={headerStyles}>
      <div className="logo" style={logoStyles}>STARK</div>

    </header>
  );
};

/* ---------------- HERO ---------------- */
const Hero = () => {
  // Smooth scroll to "Manage Events"
  const handleGetStarted = () => {
    document.getElementById('manageEvents')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section style={heroStyles}>
      <div style={heroTextStyles}>
        <h1 style={heroHeadingStyles}>Find Your Next Event</h1>
        
        <button style={heroButtonStyles} onClick={handleGetStarted}>
          Get Started
        </button>
      </div>
    </section>
  );
};

/* ---------------- FOOTER ---------------- */
const Footer = () => (
  <footer style={footerStyles}>
    <p style={footerTextStyles}>© 2024 Events. All rights reserved.</p>
  </footer>
);

/* ---------------- STYLES ---------------- */

// HEADER
const headerStyles = {
  backgroundColor: '#333',
  color: '#fff',
  padding: '1rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const logoStyles = {
  fontSize: '22px',
  fontWeight: 'bold',
};




// HERO
const heroStyles = {
  background: 'url(https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZXZlbnRzfGVufDB8fDB8fHww) no-repeat center center',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '70vh', // Full screen height
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  color: '#fff',
};

const heroTextStyles = {
  maxWidth: '600px',
  margin: '0 auto',
};

const heroHeadingStyles = {
  fontSize: '3rem',
  marginBottom: '0.5rem'
};

const heroSubTextStyles = {
  fontSize: '1.2rem',
  marginBottom: '1rem'
};

const heroButtonStyles = {
  padding: '10px 20px',
  fontSize: '1rem',
  backgroundColor: '#ff5f57',
  color: '#fff',
  border: 'none',
  cursor: 'pointer'
};

// MAIN
const mainStyles = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem 0',
  textAlign: 'center',
};

const mainTextStyles = {
  fontSize: '3rem',
  fontWeight: 'bold',
  color: '#000',
  marginBottom: '2rem',
};

// BOXES
const boxDescriptionStyles = {
  marginTop: '10px',
  fontSize: '1rem',
  color: '#555',
  lineHeight: '1.5',
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
  width: '300px',            // Set a fixed width that allows two boxes to fit in one row
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
const boxHoverStyles = {
  transform: 'scale(1.05)',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
};

// FOOTER
const footerStyles = {
  backgroundColor: '#333',
  color: '#fff',
  textAlign: 'center',
  padding: '1rem'
};

const footerTextStyles = {
  margin: '0',
  fontSize: '1rem'
};

export default AdminFP;
