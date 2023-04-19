import React, { useState } from 'react';
const url = 'http://localhost:5005';

function Register () {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert('Password does not match');
      return;
    }
    try {
      const data = {
        email: email,
        password: password,
        name: name
      }
      const response = await fetch(url + '/admin/auth/register', {
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
        alert(response.status);
        throw new Error('Error');
      }
    } catch (error) {
      alert('This is error inside error catch');
      throw new Error(`Error: ${error}`);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="container">
  <div className="form-group">
    <label htmlFor="email">Email:</label>
    <input
      type="email"
      className="form-control"
      id="email"
      value={email}
      onChange={(event) => setEmail(event.target.value)}
    />
  </div>
  <div className="form-group">
    <label htmlFor="name">Name:</label>
    <input
      type="text"
      className="form-control"
      id="name"
      value={name}
      onChange={(event) => setName(event.target.value)}
    />
  </div>
  <div className="form-group">
    <label htmlFor="password">Password:</label>
    <input
      type="password"
      className="form-control"
      id="password"
      value={password}
      onChange={(event) => setPassword(event.target.value)}
    />
  </div>
  <div className="form-group">
    <label htmlFor="confirmPassword">Confirm Password:</label>
    <input
      type="password"
      className="form-control"
      id="confirmPassword"
      value={confirmPassword}
      onChange={(event) => setConfirmPassword(event.target.value)}
    />
  </div>
  <button type="submit" className="btn btn-primary">Submit</button>
</form>
  );
}

export default Register;
