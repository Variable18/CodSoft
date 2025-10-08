import { useState } from 'react';
import Button from '../Button';
import Input from '../Input';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  try {
    const res = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Login failed');
    } else {
      localStorage.setItem('token', data.token); // Save JWT token
      onLogin(data.token);  // Pass token or user info to parent
    }
  } catch (err) {
    setError('Server error');
  }
};


  return (
    <main className="main-content">
      <section className="content-area">
        <div className="card" style={{ maxWidth: 400, margin: 'auto' }}>
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <Input
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <Button type="submit">Login</Button>
          </form>
        </div>
      </section>
    </main>
  );
}
