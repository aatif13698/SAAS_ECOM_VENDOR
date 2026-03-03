// src/components/NetworkModal.js
import React from 'react';
import Modal from 'react-modal';

const NetworkModal = ({ isOpen }) => {
  return (
    <Modal
      isOpen={isOpen}
      ariaHideApp={false} // For testing; set to true in prod with Modal.setAppElement('#root')
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          zIndex: 9999, // High to cover everything
        },
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          padding: '20px',
          border: 'none',
          background: '#fff',
          borderRadius: '8px',
        },
      }}
      shouldCloseOnOverlayClick={false} // Prevent closing by clicking outside
      shouldCloseOnEsc={false} // Prevent ESC close
    >
      <h2>Network Disconnected</h2>
      <p>Your internet connection is lost. Please check your network and try again.</p>
      <p>The app will resume automatically when connected.</p>
      {/* Optional: Loading spinner if desired */}
    </Modal>
  );
};

export default NetworkModal;