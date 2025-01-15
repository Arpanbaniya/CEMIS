import React from 'react';

function Tech() {
  return (
    <div style={pageStyles}>
      <h1 style={textStyles}>This is Tech Page</h1>
    </div>
  );
}

const pageStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#f4f4f4',
  textAlign: 'center',
};

const textStyles = {
  fontSize: '2rem',
  fontWeight: 'bold',
  color: '#333',
};

export default Tech;
