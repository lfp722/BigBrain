import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import fileToDataUrl from '../helper/helper'
const url = 'http://localhost:5005';

function CreateQuestion () {
  const { token, questionId } = useParams();
  const [question, setQuestion] = useState();
  const [quizTitle, setQuizTitle] = useState('');
  const [quizType, setQuizType] = useState('single-choice');
  const [quizTimeLimit, setQuizTimeLimit] = useState(10);
  const [quizPoint, setQuizPoint] = useState(1);
  // Dropdown of Quiz, none, video, image
  const [dropdownOption, setdropdownOption] = useState('none');
  const [videoUrl, setVideoUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [quizAnswer, setQuizAnswer] = useState([]);

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
      } catch (error) {
        throw new Error(`Error: ${error}`);
      }
    };
    getQuestionData();
  }, [token, questionId]);

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
    const updatedAnswers = [...quizAnswer];
    updatedAnswers[index][field] = field === 'correct' ? value === 'true' : value;
    setQuizAnswer(updatedAnswers);
  };

  const addAnswer = () => {
    const newAnswer = { text: '', correct: false };
    setQuizAnswer([...quizAnswer, newAnswer]);
  };

  const deleteAnswer = (index) => {
    const updatedAnswers = [...quizAnswer];
    updatedAnswers.splice(index, 1);
    setQuizAnswer(updatedAnswers);
  };

  const addQuiz = async (event) => {
    event.preventDefault();
    let numOfAns = 0;
    if (quizAnswer.length > 6 || quizAnswer.length < 2) {
      alert('Number of options should be between 2 to 6!');
      return;
    }
    quizAnswer.forEach(a => {
      if (a.correct === true) {
        numOfAns += 1;
      }
    })
    if (numOfAns === 0) {
      alert('There is no answer to this question!');
      return;
    }
    if (quizType === 'single-choice' && numOfAns > 1) {
      alert('Single Answer Question should not have more than one answer!');
      return;
    }
    if (quizType === 'multiple-choice' && numOfAns === 1) {
      alert('Multiple answer question should not have more than one answer!');
      return;
    }
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
    const updatedQuestions = [...question.questions, {
      id: question.questions.length,
      type: quizType,
      question: quizTitle,
      timeLimit: quizTimeLimit,
      points: quizPoint,
      media: newMedia,
      answers: quizAnswer
    }];
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
      setQuestion(updatedGame);
      window.location.href = `/editGame/${token}/${questionId}`;
    } catch (error) {
      alert(`Error: ${error}`);
      throw new Error(`Error: ${error}`);
    }
  }

  return (
    <div>
    <form onSubmit={addQuiz} className='container mt-5'>
      <div className='form-group'>
        <label htmlFor='questionInput'>Question: </label>
        <input
          type="text"
          className="form-control"
          id="questionInput"
          placeholder="Enter Question Title"
          value={quizTitle}
          onChange={(event) => setQuizTitle(event.target.value)}
        />
      </div>
      <div className='form-group'>
        <label>Question Type: </label>
        <select
          className='form-control'
          value={quizType}
          onChange={(event) => setQuizType(event.target.value)}
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
          value={quizTimeLimit}
          onChange={(event) => setQuizTimeLimit(event.target.value)}
        />
      </div>
      <div className='form-group'>
        <label htmlFor='quizPoints'>Points: </label>
        <input
          type="number"
          className="form-control"
          id="quizPoints"
          value={quizPoint}
          onChange={(event) => setQuizPoint(event.target.value)}
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
      {quizAnswer.map((answer, index) => (
        <div key={index}>
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
          <button onClick={() => deleteAnswer(index)}>Delete Answer</button>
        </div>
      ))}
      <br></br>
      <button type="submit" className="btn btn-primary">Add Question!</button>
    </form>
    <button className="btn btn-primary" onClick={addAnswer} type='click'>Add Answer</button>
    </div>
  )
}

export default CreateQuestion;
