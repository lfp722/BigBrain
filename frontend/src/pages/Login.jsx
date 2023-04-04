import React, { useState } from 'react';
import '../styles/LoginStyle.css'
const url = 'http://localhost:5005';

function Login () {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = {
        email: email,
        password: password
      };
      const response = await fetch(url + '/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        const data = await response.json();
        window.location.href = `/dashboard/${data.token}`;
      } else {
        // Invalid Credentials
        alert(response.status);
        throw new Error('Error');
      }
    } catch (error) {
      alert('Error inside error')
      throw new Error(`Error: ${error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-5">
      <div className="form-group">
        <label htmlFor="emailInput">Email:</label>
        <input
          type="email"
          className="form-control"
          id="emailInput"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="passwordInput">Password:</label>
        <input
          type="password"
          className="form-control"
          id="passwordInput"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary">Login!</button>
    </form>
  );
}

export default Login;
