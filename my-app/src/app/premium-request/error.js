'use client'; // Error components must be Client Components
 
import { useEffect } from 'react';
 
export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);
 
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f4f4f4'
    }}>
      <h2 style={{
        color: '#f44336',
        marginBottom: '20px'
      }}>Something went wrong!</h2>
      <p style={{
        color: '#555555',
        fontSize: '16px',
        marginBottom: '20px'
      }}>Error: {error.message}</p>
      <button
        onClick={() => reset()}
        style={{
          backgroundColor: '#2196F3',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        Try again
      </button>
    </div>
  );
}
