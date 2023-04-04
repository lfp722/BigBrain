import { useParams, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
const url = 'http://localhost:5005';

function EditGame () {
  const { token, quizId } = useParams();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const getQuizData = async () => {
      try {
        const response = await fetch(url + `/admin/quiz/${quizId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          alert(response.status);
          throw new Error(`Error ${response.status}`);
        }
        const data = await response.json();
        setQuestions(data.questions);
      } catch (error) {
        alert('This is error inside error catch');
        throw new Error(`Error: ${error}`);
      }
    };
    getQuizData();
  }, [token]);

  return (
    <div>
      <h1>Edit your Game!</h1>
      {questions.map((question) => (
        <div key={question.id} className="container quiz-container">
          <div className="row">
            <div className="col">
              <h2 className="fs-4 fw-bold">{question.question}</h2>
              <Link to={{
                pathname: `/editQuestion/${token}/${quizId}/${question.id}`,
              }}
              ><div>{question.question}</div></Link>
            </div>
            <div className="col-4">
              <img src={question.thumbnail} alt={question.name} className="img-fluid" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default EditGame;
