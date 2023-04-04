/* eslint-disable no-unused-vars */
import { json, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import fileToDataUrl from '../helper/helper'
const url = 'http://localhost:5005';

function EditQuestion () {
  const { token, questionId, quizId } = useParams();
  const [question, setQuestion] = useState();
  const [currentQuestion, setCurrentQuestion] = useState();
  const [currentQuiz, setCurrentQuiz] = useState();
  // Title Of Quiz
  const [currentQuizTitle, setCurrentQuizTitle] = useState();
  // Type of Quiz
  const [currentQuizType, setCurrentQuizType] = useState();
  // Time Limit of the quiz
  const [currentQuizTimeLimit, setCurrentQuizTimeLimit] = useState();
  // points of the quiz
  const [currentQuizPoint, setCurrentQuizPoint] = useState();
  // Dropdown of Quiz, none, video, image
  const [dropdownOption, setdropdownOption] = useState('none');
  const [videoUrl, setVideoUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  // Quiz answers
  const [currentQuizAnswer, setCurrentQuizAnswer] = useState([]);
  // Fetch question data
  useEffect(() => {
    const getQuestionData = async () => {
      try {
        const response = await fetch(url + `/admin/quiz/${questionId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          alert(response.status);
          throw new Error(`Error ${response.status}`);
        }
        const data = await response.json();
        setQuestion(data);
        setCurrentQuestion(data.questions);
      } catch (error) {
        throw new Error(`Error: ${error}`);
      }
    };

    getQuestionData();
  }, [token, questionId]);

  // Update currentQuiz state variable
  useEffect(() => {
    const setCurrentQuizFromQuestion = () => {
      if (currentQuestion && currentQuestion.length > 0) {
        const question = currentQuestion.find(q => parseInt(q.id) === parseInt(quizId));
        if (question) {
          setCurrentQuiz(question);
          setCurrentQuizType(question.type);
          setCurrentQuizTitle(question.question);
          setdropdownOption(question.media.type);
          setCurrentQuizTimeLimit(question.timeLimit);
          setCurrentQuizPoint(question.points);
          setCurrentQuizAnswer(question.answers);
        }
      }
    };
    setCurrentQuizFromQuestion();
  }, [currentQuestion, quizId]);

  const handleDropdownChange = (event) => {
    setdropdownOption(event.target.value);
  };

  const renderDropdownField = () => {
    if (dropdownOption === 'none') {
      return null;
    } else if (dropdownOption === 'video') {
      return (
        <input
          type="text"
          placeholder="Paste video link here"
          value={videoUrl}
          onChange={(event) => setVideoUrl(event.target.value)}
        />
      );
    } else if (dropdownOption === 'image') {
      return (
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setImageFile(event.target.files[0])}
        />
      );
    }
  };

  const handleAnswerChange = (index, field, value) => {
    const updatedAnswers = [...currentQuizAnswer];
    updatedAnswers[index][field] = value;
    setCurrentQuizAnswer(updatedAnswers);
  };

  const editQuiz = async (event) => {
    event.preventDefault();
    let newMedia;
    if (dropdownOption === 'none') {
      newMedia = {
        type: dropdownOption
      }
    } else if (dropdownOption === 'video') {
      newMedia = {
        type: dropdownOption,
        url: videoUrl
      }
    } else {
      fileToDataUrl(imageFile).then((dataUrl) => {
        setImageUrl(dataUrl);
      })
      newMedia = {
        type: dropdownOption,
        img: imageUrl
      }
    }
    const quiz = {
      id: quizId,
      type: currentQuizType,
      question: currentQuizTitle,
      timeLimit: currentQuizTimeLimit,
      points: currentQuizPoint,
      media: newMedia,
      answers: currentQuizAnswer
    }
    const updatedQuestions = question.questions.map(q => {
      if (parseInt(q.id) === parseInt(quizId)) {
        return {
          ...q,
          type: currentQuizType,
          question: currentQuizTitle,
          timeLimit: currentQuizTimeLimit,
          points: currentQuizPoint,
          media: newMedia,
          answers: currentQuizAnswer
        };
      }
      return q;
    });
    const updatedGame = {
      ...question,
      questions: updatedQuestions
    };
    try {
      const response = await fetch(url + `/admin/quiz/${questionId}`, {
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
      const data = await response.json();
      setCurrentQuestion(data.questions);
      alert(`Success: ${response.status} \n`);
    } catch (error) {
      alert(`Error: ${error}`);
      throw new Error(`Error: ${error}`);
    }
  }

  if (currentQuiz) {
    return (
      <form onSubmit={editQuiz} className='container mt-5'>
        <div className='form-group'>
          <label htmlFor='questionInput'>Question: </label>
          <input
            type="text"
            className="form-control"
            id="questionInput"
            value={currentQuizTitle}
            onChange={(event) => setCurrentQuizTitle(event.target.value)}
          />
        </div>
        <div className='form-group'>
          <label>Question Type: </label>
          <select
            className='form-control'
            value={currentQuizType}
            onChange={(event) => setCurrentQuizType(event.target.value)}
          >
            <option value='single-choice'>Single Choice</option>
            <option value='multiple-choice'>Multiple Choice</option>
          </select>
        </div>
        <div className='form-group'>
          <label htmlFor='quizTimeLimit'>Time Limit: </label>
          <input
            type="number"
            className="form-control"
            id="quizTimeLimit"
            value={currentQuizTimeLimit}
            onChange={(event) => setCurrentQuizTimeLimit(event.target.value)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='quizPoints'>Points: </label>
          <input
            type="number"
            className="form-control"
            id="quizPoints"
            value={currentQuizPoint}
            onChange={(event) => setCurrentQuizPoint(event.target.value)}
          />
        </div>
        <div>
          <select value={dropdownOption} onChange={handleDropdownChange}>
            <option value="none">None</option>
            <option value="video">Video</option>
            <option value="image">Image</option>
          </select>
          {renderDropdownField()}
        </div>
        {currentQuizAnswer.map((answer, index) => (
          <div key={answer.text}>
            <label>Text: </label>
            <input
              type="text"
              className="form-control"
              value={answer.text}
              onChange={(event) => handleAnswerChange(index, 'text', event.target.value)}
            />
            <label>Answer: </label>
            <select
              className='form-control'
              value={answer.correct}
              onChange={(event) => handleAnswerChange(index, 'correct', event.target.value)}
            >
              <option value='true'>true</option>
              <option value='false'>false</option>
            </select>
          </div>
        ))}
        <br></br>
        <button type="submit" className="btn btn-primary">Edit Question!</button>
      </form>
    );
  }
  return <div>Loading...</div>;
}

export default EditQuestion;
