import React, { useState } from 'react';
import { FormEvent } from 'react';
import { useRouter } from 'next/router';

const { Level } = require('level')

const db = new Level('mydb', { valueEncoding: 'json' })

export default function LoginPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const isAuthenticated = await authenticate(email, password);
      if (isAuthenticated) {
        router.push('/profile');
      } else {
        setErrorMessage('Informations de connexion invalides');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setErrorMessage('Une erreur est survenue lors de l\'authentification');
    }
  }

  async function authenticate(email: string, password: string): Promise<boolean> {
    const user = await getUser(email);
    if (!user || user.password !== password) {
      return false;
    }
    return !user.blocked;
  }

  async function getUser(email: string): Promise<{ password: string; blocked: boolean } | null> {
    const data = await db.get(email);
    return data ? JSON.parse(data) : null;
  }

  return (
    <div className="login-container">
      <div className="background-image flex flex-1 overflow-hidden">
        {/* Replace with your background image URL */}
        <img src="static/background-image.PNG" alt="Login background" className="w-full h-full object-cover object-center" />
      </div>
      <div className="form-container flex flex-col items-center justify-center px-10 py-20 bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-white mb-10">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-white mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
