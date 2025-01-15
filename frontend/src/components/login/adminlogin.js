import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pinwheel } from 'ldrs';

pinwheel.register(); // loading icon 

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    //clear error msg
    setErrorMessage('');
    setFieldError('');

    // empty field check
    if (!username || !password) {
      setFieldError('Both fields are required.');
      return;
    }

    //admin detail check
    if (username === 'admin' && password === 'admin') {
      setSuccessMessage('Login successful! Redirecting to admin dashboard...');
      setIsLoading(true); //loading icon 

      setTimeout(() => {
        setIsLoading(false);
        navigate('/adminfp');
      }, 2000); //2 sec gap
    } else {
      //error msg 
      setErrorMessage('Invalid username or password');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.header}>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputContainer}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.inputContainer}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
          </div>
          {fieldError && <p style={styles.errorText}>{fieldError}</p>}
          {errorMessage && <p style={styles.errorText}>{errorMessage}</p>}
          {successMessage && (
            <p style={styles.successText}>
              {successMessage}{' '}
              {isLoading && (
                <l-pinwheel size="20" stroke="2" speed="0.9" color="#5cb85c"></l-pinwheel>
              )}
            </p>
          )}
          <button type="submit" style={styles.submitButton}>Login</button>
        </form>
      </div>
    </div>
  );
}

// CSS
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5', 
  },
  formContainer: {
    width: '350px',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  inputContainer: {
    marginBottom: '20px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '5px',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s',
  },
  inputFocus: {
    borderColor: '#007bff',
  },
  errorText: {
    color: '#d9534f',
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '10px',
  },
  successText: {
    color: '#5cb85c',
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '10px',
  },
  submitButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default AdminLogin;
