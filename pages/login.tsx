import React, { useState } from 'react';
import { FormEvent } from 'react';
import { useRouter } from 'next/router';
import './../static/login.css';

const { Level } = require('level')

const db = new Level('mydb', { valueEncoding: 'json' })

export default function LoginPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
      const isAuthenticated = await authenticate(username, password);
      if (isAuthenticated) {
        router.push('/listphotos');
      } else {
        const user = await getUser(username);
        setErrorMessage(user?.blocked ? 'Ce compte a été bloqué.' : 'Informations de connexion invalides');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setErrorMessage('Une erreur est survenue lors de l\'authentification');
    }
  }

  async function authenticate(username: string, password: string): Promise<boolean> {
    const user = await getUser(username);
    return user && user.password === password && !user.blocked;
  }

  async function getUser(username: string): Promise<{ password: string; blocked: boolean } | null> {
    const userData = {
      muser1: { password: 'mpassword1', blocked: false },
      muser2: { password: 'mpassword2', blocked: false },
      muser3: { password: 'mpassword3', blocked: true },
    };

    return userData[username] || null;
  }

  return (
    <div className="login-container grid grid-cols-2">
      <div className="form-container flex items-center justify-center px-10 py-20 bg-gray-800 rounded-lg shadow-md">
        <div>
          <h1 className="text-3xl font-bold text-white mb-10">Welcome Back</h1>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="flex flex-col">
  <label htmlFor="username" className="text-white mb-2">Username</label>
  <input
    type="text"
    id="username"
    name="username"
    placeholder="Enter your username"
    required
    className="input-field"
  />
</div>
<div className="flex flex-col">
  <label htmlFor="password" className="text-white mb-2">Password</label>
  <input
    type="password"
    id="password"
    name="password"
    placeholder="Enter your password"
    required
    className="input-field"
  />
</div>

<button type="submit" style={{
  backgroundColor: '#000', /* Light orange */
  color: '#fff', /* White text */
  padding: '10px 20px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px', /* Optional: adjust font size */
}}>
  Sign In
</button>

          </form>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </div>
      </div>
      <div className="background-image">
        {/* Replace with your background image URL */}
        <img
          src="static/background-image.PNG"
          alt="Login background"
          className="w-full h-full object-cover object-center"
        />
      </div>
    </div>
  );
}
