import React, { useState } from 'react';
const url = 'http://localhost:5005';

function PlayJoin () {
  const [playerName, setPlayerName] = useState('');
  const [sessionId, setSessionId] = useState('');

  const handleSubmit = async () => {
    try {
      const name = {
        name: playerName
      }
      const response = await fetch(url + `/play/join/${sessionId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(name)
      })
      const data = await response.json();
      const playerId = data.playerId;
    } catch (error) {
      throw new Error(error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="container mt-5">
      <div className="form-group">
        <label htmlFor="playerNameInput">Name:</label>
        <input
          type="text"
          className="form-control"
          id="playerNameInput"
          value={playerName}
          onChange={(event) => setPlayerName(event.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="sessionId">Name:</label>
        <input
          type="number"
          className="form-control"
          id="sessionId"
          value={sessionId}
          onChange={(event) => setSessionId(event.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary">Login!</button>
    </form>
  )
}

export default PlayJoin;
