import React from 'react';

const url = 'http://localhost:5005';

export const logout = async (token) => {
  try {
    const response = await fetch(url + '/admin/auth/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(response.status);
    }
    window.location.href = '/login';
  } catch (error) {
    throw new Error(error);
  }
};

export default function LogoutButton ({ token }) {
  return <button onClick={() => logout(token)}>Logout!</button>;
}
