import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Home () {
  return (
    <div className='home-container'>
      <h1>Welcome to bigbrain</h1>
      <div className='button-container'>
        <Link to='/login' className="btn btn-primary">Login</Link>
        <Link to='/register' className="btn btn-primary">Register</Link>
      </div>
    </div>
  )
}

export default Home;
