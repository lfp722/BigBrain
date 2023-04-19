import React from 'react';
import Modal from 'react-modal';

export default function GameStartedModal ({ isOpen, onRequestClose, handleCopy }) {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
        <div className="modal-header">
          <h5 className="modal-title">Game Started</h5>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={onRequestClose}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <p>The game has started.</p>
          <p>Copy Link to the Game</p>
          <button onClick={() => handleCopy()}>Copy Link</button>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onRequestClose}>Close</button>
        </div>
    </Modal>
  );
}
