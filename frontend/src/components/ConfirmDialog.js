import React from 'react';

const ConfirmDialog = ({ open, onClose, onConfirm, message }) => {
  if (!open) return null;

 return (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.4)',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <div
      style={{
        backgroundColor: '#1f1f1f',
        color:'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: '384px',
      }}
    >
      <p style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '16px', textAlign: 'center' }}>{message}</p>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
        <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: '4px', backgroundColor: '#ccc' }}>Cancel</button>
        <button onClick={onConfirm} style={{ padding: '8px 16px', borderRadius: '4px', backgroundColor: '#ef4444', color: 'white' }}>Confirm</button>
      </div>
    </div>
  </div>
);

};

export default ConfirmDialog;
