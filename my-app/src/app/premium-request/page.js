import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const PremiumRequestPage = () => {
  const searchParams = useSearchParams();
  const userEmail = searchParams.get('userEmail') || 'N/A';
  const userMobile = searchParams.get('userMobile') || 'N/A';
  const approveLink = searchParams.get('approveLink') || '#';
  const rejectLink = searchParams.get('rejectLink') || '#';

  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState(null); // 'approved', 'rejected', 'alreadyProcessed'

  const handleActionClick = async (type) => {
    if (isProcessing || status) return;

    setIsProcessing(true);
    const url = type === 'approve' ? approveLink : rejectLink;

    try {
      const response = await fetch(url, { method: 'POST' });

      if (response.status === 409) {
        setStatus('alreadyProcessed');
        return;
      }
      if (!response.ok) throw new Error(`Failed to ${type} request`);

      setStatus(type);
    } catch (error) {
      console.error(error);
      alert(`Error: Could not ${type} premium request.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const getButtonStyle = (btnType) => ({
    backgroundColor: btnType === 'approve' ? '#4CAF50' : '#f44336',
    color: 'white',
    padding: '12px 25px',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    marginRight: btnType === 'approve' ? '10px' : '0px',
    opacity: isProcessing ? 0.6 : 1,
    pointerEvents: isProcessing || status ? 'none' : 'auto',
    cursor: isProcessing || status ? 'not-allowed' : 'pointer',
    border: 'none',
  });

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f4f4f4',
        padding: '20px',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          padding: '30px',
          textAlign: 'center',
        }}
      >
        <h2 style={{ color: '#333', marginBottom: '20px' }}>
          Premium Request Notification
        </h2>
        <p style={{ color: '#555', fontSize: '16px', marginBottom: '30px' }}>
          User <strong>{userEmail}</strong> with mobile <strong>{userMobile}</strong> requested premium.
        </p>

        {/* Buttons */}
        {!status && (
          <div>
            <button
              onClick={() => handleActionClick('approve')}
              style={getButtonStyle('approve')}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Approve'}
            </button>
            <button
              onClick={() => handleActionClick('reject')}
              style={getButtonStyle('reject')}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Reject'}
            </button>
          </div>
        )}

        {/* Confirmation messages */}
        {status === 'approved' && (
          <p style={{ marginTop: '20px', color: '#4CAF50', fontSize: '18px', fontWeight: 'bold' }}>
            ✅ Request Approved Successfully!
          </p>
        )}
        {status === 'rejected' && (
          <p style={{ marginTop: '20px', color: '#f44336', fontSize: '18px', fontWeight: 'bold' }}>
            ❌ Request Rejected Successfully!
          </p>
        )}
        {status === 'alreadyProcessed' && (
          <p style={{ marginTop: '20px', color: '#999', fontSize: '16px' }}>
            ⚠ This request has already been processed.
          </p>
        )}
      </div>
    </div>
  );
};

export default PremiumRequestPage;
