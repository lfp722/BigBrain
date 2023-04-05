import { useParams, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import fileToDataUrl from '../helper/helper'
const url = 'http://localhost:5005';

function EditGame () {
  const { token, quizId } = useParams();
  const [game, setGame] = useState();
  const [gameQuestions, setGameQuestions] = useState([]);
  const [questionName, setQuestionName] = useState();
  const [questionThumbnail, setQuestionThumbnail] = useState();
  const [imageUrl, setImageUrl] = useState();

  useEffect(() => {
    const getGameData = async () => {
      try {
        const response = await fetch(url + `/admin/quiz/${quizId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }
        const data = await response.json();
        setGame(data);
        setGameQuestions(data.questions);
        setQuestionName(game.name);
      } catch (error) {
        throw new Error(`Error: ${error}`);
      }
    };
    getGameData();
  }, [token, quizId]);

  const editGame = async (event) => {
    event.preventDefault();
    const dataUrl = await fileToDataUrl(questionThumbnail);
    setImageUrl(dataUrl);
    const updatedGame = {
      ...game,
      name: questionName,
      thumbnail: imageUrl
    };
    try {
      const response = await fetch(url + `/admin/quiz/${quizId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedGame)
      });
      if (!response.ok) {
        alert(response.status);
        throw new Error(`Error ${response.status}`);
      }
      setGame(updatedGame);
    } catch (error) {
      alert(`Error: ${error}`);
      throw new Error(`Error: ${error}`);
    }
  };

  if (game) {
    return (
      <div>
        <h1>Edit your Game!</h1>
        <form onSubmit={editGame} className='container mt-5'>
          <div className='form-group'>
            <label htmlFor='questionInput'>Name: </label>
            <input
              type="text"
              className="form-control"
              id="questionInput"
              placeholder={questionName}
              value={questionName}
              onChange={(event) => setQuestionName(event.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setQuestionThumbnail(event.target.files[0])}
            />
          </div>
          <button type="submit" className="btn btn-primary">Edit Question!</button>
        </form>
        <Link to={{
          pathname: `/createQuestion/${token}/${quizId}`
        }}><div>Add Question!</div></Link>
        {gameQuestions.map((question) => (
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
  return <div>Loading...</div>;
}

export default EditGame;
