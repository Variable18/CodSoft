import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL;

  const submit = async (e) => {
    e.preventDefault();
    setErr('');

    try {
      if (!API) throw new Error('API base URL is missing (VITE_API_URL not set in .env)');

      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        throw new Error('Invalid response from server');
      }

      if (!res.ok) throw new Error(data?.error || `Login failed (${res.status})`);

      localStorage.setItem('token', data.token);
      navigate('/');         // Redirect to home
      window.location.reload();  // Reload page so App reads new token and updates UI
    } catch (error) {
      setErr(error.message);
    }
  };

  return (
    <main className="min-h-screen bg-black text-green-400 flex items-center justify-center p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-zinc-900/60 p-8 rounded-xl border border-green-500/20 space-y-4"
      >
        <h1 className="text-3xl font-semibold text-center">Sign in</h1>
        <input
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Username or Email"
          className="w-full p-3 bg-black border border-green-500/30 rounded text-green-400"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-3 bg-black border border-green-500/30 rounded text-green-400"
        />
        {err && <p className="text-red-400">{err}</p>}
        <button
          type="submit"
          className="w-full py-3 bg-green-500 text-black rounded font-semibold hover:bg-green-400"
        >
          Continue
        </button>
        <button
          type="button"
          onClick={() => navigate('/signup')}
          className="w-full mt-4 py-3 rounded-lg bg-transparent border border-green-500/40 text-green-400 hover:bg-green-500/10 transition"
        >
          Create a new account
        </button>
      </form>
    </main>
  );
}
