//  app/premium-request/loading.js

import React from 'react';

const Loading = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f4f4f4'
    }}>
      <p style={{
        fontSize: '24px',
        color: '#555555'
      }}>Loading premium request...</p>
    </div>
  );
};

export default Loading;