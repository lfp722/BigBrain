import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EditGame from './pages/EditGame';
import EditQuestion from './pages/EditQuestion';

function App () {
  return (
    <Router>
      <Routes>
        <Route exact path="/login" element={ <Login /> } />
        <Route exact path="/register" element={ <Register />} />
        <Route exact path='/dashboard/:token' element={ <Dashboard />} />
        <Route exact path='/editGame/:token/:quizId' element={ <EditGame />} />
        <Route exact path='/editQuestion/:token/:questionId/:quizId' element={ <EditQuestion />} />
      </Routes>
    </Router>
  );
}

export default App;
