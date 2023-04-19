import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EditGame from './pages/EditGame';
import EditQuestion from './pages/EditQuestion';
import CreateQuestion from './pages/CreateQuestion';
import Debug from './pages/Debug';
import GameResult from './pages/GameResult';
import Home from './pages/Home';
import ErrorPage from './pages/ErrorPage';

function App () {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={ <Home /> } />
        <Route exact path="/login" element={ <Login /> } />
        <Route exact path="/register" element={ <Register />} />
        <Route exact path='/dashboard/:token' element={ <Dashboard />} />
        <Route exact path='/editGame/:token/:quizId' element={ <EditGame />} />
        <Route exact path='/createQuestion/:token/:questionId' element={ <CreateQuestion />} />
        <Route exact path='/editQuestion/:token/:questionId/:quizId' element={ <EditQuestion />} />
        <Route exact path='/debug' element={ <Debug />} />
        <Route exact path='/gameResult/:token/:sessionId' element={ <GameResult />} />
        <Route path='*' element={ <ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
