import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
const url = 'http://localhost:5005';

function GameResult () {
  const { token, sessionId } = useParams();
  const { topScorers, setTopScorers } = useState([]);

  useEffect(() => {
    const getResult = async () => {
      try {
        const response = await fetch(url + `/admin/session/${sessionId}/results`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error(response.status);
        }
        const data = await response.json();
        alert(JSON.stringify(data));
        const scores = data.map(participant => {
          const correctAnswers = participant.answers.filter(answer => answer.correct);
          return {
            name: participant.name,
            score: correctAnswers.length
          };
        });
        const sortedScores = scores.sort((a, b) => b.score - a.score);
        const top5 = sortedScores.slice(0, 5);
        if (top5.length > 0 && JSON.stringify(top5) !== JSON.stringify(topScorers)) {
          setTopScorers(top5);
        }
      } catch (error) {
        throw new Error(error);
      }
    }
    getResult();
  }, [token, sessionId]);
  if (topScorers) {
    return (
      <div>
        <h2>Top Scorers:</h2>
        <ul>
          {topScorers.map((participant, index) => (
            <li key={index}>{participant.name} - {participant.score}</li>
          ))}
          {topScorers.length === 0 && <li>No scores to display.</li>}
        </ul>
      </div>
    );
  }
  return (
    <h1>Loading...</h1>
  )
}

export default GameResult;
