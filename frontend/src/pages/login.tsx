import { useState } from 'react';
import Link from 'next/link';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (res.status === 200) {
        window.location.href = '/dashboard';
      } else {
        const { message } = await res.json();
        setError(message);
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl">Login</h1>
      {error && <div className="text-red-500">{error}</div>}
      <form onSubmit={handleSubmit} className="mt-5">
        <input
          className="bg-gray-800 text-white p-3 rounded-md w-full mb-4"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="bg-gray-800 text-white p-3 rounded-md w-full mb-4"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <Link href="/signup">
        <a className="text-blue-500 hover:underline mt-4 inline-block">
          Don&apos;t have an account? Sign up
        </a>
      </Link>
    </div>
  );
};

export default Login;
