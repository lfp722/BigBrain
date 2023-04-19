import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function ErrorPage () {
  return (
    <div className='home-container'>
      <h1>Oops! This page does not exist</h1>
      <div className='button-container'>
        <Link to='/' className="btn btn-primary">Go back to Home Page</Link>
      </div>
    </div>
  )
}

export default ErrorPage;
