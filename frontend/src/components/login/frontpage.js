import React from 'react';
import { Link } from 'react-router-dom';


function FrontPage() {
  return (
    <div style={styles.pageContainer}>
      <div style={styles.frontpageContainer}>
        <div style={styles.welcomeContainer}>
          <h1>Welcome to College Portal</h1>
          <p>Access the admin or student panel to manage your tasks and events.</p>
        </div>

        <div style={styles.panels}>
          <div style={styles.panelButton}>
            <Link to="/adminlogin">
              <button style={styles.panelBtn}>Admin Panel</button>
            </Link>
          </div>
          <div style={styles.panelButton}>
            <Link to="/userlogin">
              <button style={styles.panelBtn}>Student Panel</button>
            </Link>
          </div>
        </div>

        
      </div>
    </div>
  );
}

const styles = {

  pageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',  
    backgroundColor: '#f4f4f9',
  },
  

  frontpageContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '20px',
    width: '80%',
    maxWidth: '600px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  },

  welcomeContainer: {
    marginBottom: '30px',
  },
  h1: {
    fontSize: '2.5em',
    color: '#4caf50',
  },
  p: {
    color: '#555',
    marginTop: '10px',
  },
  panels: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: '40px',
  },
  panelButton: {
    width: '45%',
  },
  panelBtn: {
    width: '100%',
    padding: '15px',
    fontSize: '1.2em',
    backgroundColor: '#ff5f57',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  panelBtnHover: {
    backgroundColor: '#45a049',
  },
  contactInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  contactItem: {
    margin: '10px 0',
    fontSize: '1.1em',
    color: '#555',
  },
  contactItemImg: {
    width: '30px',
    height: '30px',
    margin: '5px',
  },
  logo: {
    width: '100px',
    height: '100px',
    objectFit: 'contain',
    margin: '5px',
  },
  socialIcon: {
    width: '50px',
    height: '50px',
    objectFit: 'contain',
    margin: '5px',
  },
  websiteLogo: {
    width: '50px',
    height: '50px',
    objectFit: 'contain',
    margin: '5px',
  },
};

export default FrontPage;
