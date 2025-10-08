import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [form, setForm] = useState({ name: '', username: '', email: '', phone: '', password: '' });
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL;

  const submit = async (e) => {
    e.preventDefault();
    setErr('');

    try {
      if (!API) throw new Error('API base URL is missing (VITE_API_URL not set in .env)');

      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        throw new Error('Invalid response from server');
      }

      if (!res.ok) throw new Error(data?.error || `Sign up failed (${res.status})`);

      localStorage.setItem('token', data.token);
      navigate('/');         // Redirect to home
      window.location.reload();  // Reload page to refresh App state
    } catch (error) {
      setErr(error.message);
    }
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <main className="min-h-screen bg-black text-green-400 flex items-center justify-center p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-zinc-900/60 p-8 rounded-xl border border-green-500/20 space-y-4"
      >
        <h1 className="text-3xl font-semibold text-center">Create account</h1>
        <input
          placeholder="Full name"
          value={form.name}
          onChange={set('name')}
          className="w-full p-3 bg-black border border-green-500/30 rounded"
        />
        <input
          placeholder="Username"
          value={form.username}
          onChange={set('username')}
          className="w-full p-3 bg-black border border-green-500/30 rounded"
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={set('email')}
          className="w-full p-3 bg-black border border-green-500/30 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={set('password')}
          className="w-full p-3 bg-black border border-green-500/30 rounded"
        />
        {err && <p className="text-red-400">{err}</p>}
        <button
          type="submit"
          className="w-full py-3 bg-green-500 text-black rounded font-semibold hover:bg-green-400"
        >
          Sign Up
        </button>
      </form>
    </main>
  );
}
