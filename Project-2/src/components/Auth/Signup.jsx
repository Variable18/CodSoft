import { useState } from 'react';
import Button from '../Button';
import Input from '../Input';

export default function Signup({ onSignup }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  try {
    const res = await fetch('/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Signup failed');
    } else {
      // Optionally log in or redirect after successful signup
      // If backend returns a token here, store it or call onSignup(data.token)
      // Otherwise, you may want to navigate user to login page
      onSignup('Signup successful, please log in');
    }
  } catch (err) {
    setError('Server error during signup');
  }
};

  return (
    <main className="main-content">
      <section className="content-area">
        <div className="card" style={{ maxWidth: 400, margin: 'auto' }}>
          <h2>Sign Up</h2>
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
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <Button type="submit">Sign Up</Button>
          </form>
        </div>
      </section>
    </main>
  );
}
