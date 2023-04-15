import { useParams, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import LogoutButton from '../components/Logout';
import '../styles/DashboardStyle.css';
const url = 'http://localhost:5005';

function Dashboard () {
  const { token } = useParams();
  const [quizzes, setQuizzes] = useState([]);
  const [newQuizName, setQuizName] = useState('');
  const [showGameEnd, setShowGameEnd] = useState(false);
  const [showGameStart, setShowGameStart] = useState(false);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    const getQuizzes = async () => {
      try {
        const response = await fetch(url + '/admin/quiz', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          alert(response.status);
          throw new Error('Error');
        }
        const data = await response.json();
        setQuizzes(data.quizzes); // update state with fetched quizzes
      } catch (error) {
        alert('This is error inside error catch');
        throw new Error(`Error: ${error}`);
      }
    };
    getQuizzes(); // call the function to fetch quizzes
  }, [token]); // only re-fetch quizzes when the token changes

  const addQuiz = async () => {
    try {
      const data = {
        name: newQuizName
      }
      const response = await fetch(url + '/admin/quiz/new', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        alert(response.status);
        throw new Error('Error');
      }
    } catch (error) {
      alert('This is error inside error catch');
      throw new Error(`Error: ${error}`);
    }
  }
  async function startGame (quizId) {
    try {
      const response = await fetch(url + `/admin/quiz/${quizId}/start`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) {
        alert(`Could not start the game\nError: ${response.status}`);
        throw new Error(response.status);
      }
    } catch (error) {
      throw new Error(error);
    }
    try {
      const response = await fetch(url + `/admin/quiz/${quizId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        alert(`Could not retrieve the session ID\nError: ${response.status}`);
        throw new Error(response.status);
      }
      const data = await response.json();
      setSessionId(data.active);
      setShowGameStart(true);
    } catch (error) {
      throw new Error(error);
    }
  }

  async function endGame (quizId) {
    try {
      const response = await fetch(url + `/admin/quiz/${quizId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        alert(`Could not retrieve the session ID\nError: ${response.status}`);
        throw new Error(response.status);
      }
      const data = await response.json();
      setSessionId(data.active);
    } catch (error) {
      throw new Error(error);
    }
    try {
      const response = await fetch(url + `/admin/quiz/${quizId}/end`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) {
        alert(`Could not end the game\nError: ${response.status}`);
        throw new Error(response.status);
      }
      setShowGameEnd(true);
    } catch (error) {
      throw new Error(error);
    }
    setSessionId('');
  }

  async function deleteGame (quizId) {
    try {
      const response = await fetch(url + `/admin/quiz/${quizId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) {
        alert(response.status);
        throw new Error('Error');
      }
    } catch (error) {
      alert('This is error inside error catch');
      throw new Error(`Error: ${error}`);
    }
    try {
      const response = await fetch(url + '/admin/quiz', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        alert(response.status);
        throw new Error('Error');
      }
      const data = await response.json();
      setQuizzes(data.quizzes); // update state with fetched quizzes
    } catch (error) {
      alert('This is error inside error catch');
      throw new Error(`Error: ${error}`);
    }
  }

  const toggleGameStart = () => {
    setShowGameStart(!showGameStart);
    setSessionId('');
  }

  const toggleGameEnd = () => {
    setShowGameEnd(!showGameEnd);
  }

  const handleCopy = (sid) => {
    const link = `/playGame/${sid}`;
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      < LogoutButton token={ token }/>
      <form onSubmit={addQuiz} className="container mt-5">
        <div className="form-group">
          <label htmlFor="quizTitleInput">Title of new Game: </label>
          <input type="text" className="form-control" id="quizTitleInput" value={newQuizName}
            onChange={(event) => setQuizName(event.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">Add Quiz!</button>
      </form>
      {quizzes.map((quiz) => (
      <div key={quiz.id} className="container quiz-container">
        <div className="row">
          <div className="col">
            <h2 className="fs-4 fw-bold">{quiz.name}</h2>
            <p className="text-muted">Created by: {quiz.owner}</p>
            <a href={`/editGame/${token}/${quiz.id}`} className="btn btn-primary">Edit Question</a>
            <br></br>
            <br></br>
            <button type="button" className="btn btn-success" onClick={() => startGame(quiz.id)}>Start Game</button>
            <br></br>
            <br></br>
            <button type="button" className="btn btn-danger" onClick={() => endGame(quiz.id)}>End Game</button>
          </div>
          <div className="col-4">
            <img src={quiz.thumbnail} alt={quiz.name} className="img-fluid" />
          </div>
        </div>
        <button onClick={() => deleteGame(quiz.id)} className="btn btn-danger">Delete</button>
        <Modal isOpen={showGameStart} sessionId={sessionId}>
        <div className="modal-header">
          <h5 className="modal-title">Game Started</h5>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={toggleGameStart}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <p>The game has started.</p>
          <p>Copy Link to the Game</p>
          <button onClick={() => handleCopy(sessionId)}>Copy Link</button>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={toggleGameStart}>Close</button>
        </div>
      </Modal>
      <Modal isOpen={showGameEnd}>
        <div className="modal-header">
          <h5 className="modal-title">Game Ended</h5>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={toggleGameEnd}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <p>The game has ended.</p>
          <p>Would you like to view the result?</p>
          <Link to={{
            pathname: `/gameResult/${token}/${sessionId}`
          }}
          >View Result</Link>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={toggleGameEnd}>Close</button>
        </div>
      </Modal>
      </div>
      ))}
    </div>
  );
}

export default Dashboard;
