import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import avatar1 from '../assets/avatar1.png';
import avatar2 from '../assets/avatar2.png';
import avatar3 from '../assets/avatar3.png';
import avatar4 from '../assets/avatar4.png';
import Header from '../components/Header.jsx'; // Adjust import path

const presetAvatars = [avatar1, avatar2, avatar3, avatar4];

export default function CompleteProfile() {
  const [form, setForm] = useState({ name: '', username: '', phone: '', avatarUrl: '' });
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      const response = await fetch('http://localhost:8080/api/users/upsert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, isComplete: true }),
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.error || 'Failed to save profile');
      }

      navigate('/completed-profile');
    } catch (error) {
      setErr(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Header />
      <main
        className="min-h-screen flex items-center justify-center px-6"
        style={{
          background: 'linear-gradient(135deg, #101820 60%, #06ffc7 100%)',
          boxShadow: '0 0 100px 40px rgba(6,255,199,0.05) inset',
        }}
      >
        <form
          onSubmit={submit}
          className="w-full max-w-2xl bg-zinc-900/70 backdrop-blur rounded-xl p-8 shadow-xl border border-green-500/30"
        >
          <h1 className="text-3xl font-semibold mb-6 text-white text-center">Complete your profile</h1>

          {err && <p className="text-red-500 mb-4">{err}</p>}

          {/* Avatar picker */}
          <div className="mb-6">
            <p className="text-zinc-300 mb-2">Choose an avatar</p>
            <div className="grid grid-cols-4 gap-4">
              {presetAvatars.map((src) => (
                <button
                  type="button"
                  key={src}
                  onClick={() => setForm({ ...form, avatarUrl: src })}
                  className={`aspect-square rounded-lg overflow-hidden border transition ${
                    form.avatarUrl === src ? 'border-green-500 ring-2 ring-green-500' : 'border-green-500/20 hover:border-green-500/60'
                  }`}
                >
                  <img src={src} alt="avatar" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Or paste image URL */}
          <div className="mb-6">
            <label className="block text-sm text-zinc-300 mb-1">Or paste image URL</label>
            <input
              value={form.avatarUrl}
              onChange={set('avatarUrl')}
              placeholder="https://example.com/avatar.png"
              className="w-full p-3 bg-black border border-green-500/30 rounded text-green-400"
            />
          </div>

          {/* Form fields */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <input
              className="p-3 bg-black border border-green-500/30 rounded text-white"
              placeholder="Full name"
              value={form.name}
              onChange={set('name')}
              required
            />
            <input
              className="p-3 bg-black border border-green-500/30 rounded text-white"
              placeholder="Username"
              value={form.username}
              onChange={set('username')}
              required
            />
            <input
              className="p-3 bg-black border border-green-500/30 rounded md:col-span-2 text-white"
              placeholder="Phone number"
              value={form.phone}
              onChange={set('phone')}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-lg bg-green-500 text-black font-semibold hover:bg-green-400 transition focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {saving ? 'Saving...' : 'Save and continue'}
          </button>
        </form>
      </main>
    </>
  );
}
