import { useEffect, useState } from 'react';
import Header from '../components/Header.jsx'; // Adjust path as needed

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No auth token, please login.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('http://localhost:8080/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch profile');

        const data = await res.json();
        setUser(data);
      } catch (e) {
        setError(e.message || 'Unknown error');
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  return (
    <>
      <Header />
      <main
        className="min-h-screen flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #101820 60%, #06ffc7 100%)',
          boxShadow: '0 0 100px 40px rgba(6,255,199,0.05) inset',
        }}
      >
        <div className="max-w-lg w-full px-8 py-10 rounded-xl shadow-2xl bg-zinc-900/90 backdrop-blur-md">
          <h1 className="text-3xl font-bold mb-6 text-white">Profile</h1>

          {loading && (
            <p className="text-white p-4">Loading profile...</p>
          )}

          {error && (
            <p className="text-red-500 p-4">Error: {error}</p>
          )}

          {!loading && !error && user && (
            <>
              {user.avatarUrl && (
                <img
                  src={user.avatarUrl}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover mb-6 mx-auto border-2 border-green-400"
                />
              )}
              <div className="space-y-3 text-lg text-white">
                <p>
                  <span className="font-semibold">Name:</span> {user.name || 'N/A'}
                </p>
                <p>
                  <span className="font-semibold">Username:</span> {user.username || 'N/A'}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {user.email || 'N/A'}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span> {user.phone || 'N/A'}
                </p>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
