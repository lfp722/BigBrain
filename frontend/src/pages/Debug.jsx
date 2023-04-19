import React, { useState } from 'react';
import Modal from 'react-modal';

function Debug () {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  }

  return (
    <div>
      <button type="button" className="btn btn-primary" onClick={togglePopup}>Open Modal</button>
      <Modal isOpen={showPopup} onRequestClose={togglePopup}>
        <div className="modal-header">
          <h5 className="modal-title">Modal title</h5>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={togglePopup}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <p>Modal body text goes here.</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary">Save changes</button>
          <button type="button" className="btn btn-secondary" onClick={togglePopup}>Close</button>
        </div>
      </Modal>
    </div>
  );
}

export default Debug;
