import { useParams, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/DashboardStyle.css';
const url = 'http://localhost:5005';

function Dashboard () {
  const { token } = useParams();
  const [quizzes, setQuizzes] = useState([]);
  const [newQuizName, setQuizName] = useState('');

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

  return (
    <div>
      <h1>Dashboard</h1>
      <form onSubmit={addQuiz} className="container mt-5">
        <div className="form-group">
          <label htmlFor="quizTitleInput">Title of new Game: </label>
          <input
            type="text"
            className="form-control"
            id="quizTitleInput"
            value={newQuizName}
            onChange={(event) => setQuizName(event.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Quiz!</button>
      </form>
      {quizzes.map((quiz) => (
      <div key={quiz.id} className="container quiz-container">
        <div className="row">
          <div className="col">
            <h2 className="fs-4 fw-bold">{quiz.name}</h2>
            <p className="text-muted">Created by: {quiz.owner}</p>
            <Link to={`/editGame/${token}/${quiz.id}`} className="btn btn-primary">Edit Question</Link>
          </div>
          <div className="col-4">
            <img src={quiz.thumbnail} alt={quiz.name} className="img-fluid" />
          </div>
        </div>
      </div>
      ))}
    </div>
  );
}

export default Dashboard;
