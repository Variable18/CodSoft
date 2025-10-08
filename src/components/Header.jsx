import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function Header() {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem('token');
      if (!token) {
        setAvatarUrl(null);
        return;
      }
      try {
        const res = await fetch('http://localhost:8080/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed fetching profile data');
        const data = await res.json();
        setAvatarUrl(data.avatarUrl);
      } catch (error) {
        console.error('Error fetching profile in Header:', error);
        setAvatarUrl(null);
      }
    }
    fetchProfile();
  }, []);

  const handleProfileClick = async () => {
    console.log('Profile button clicked');
    const token = localStorage.getItem('token');
    console.log('Token:', token);
    if (!token) {
      console.log('No token found, redirecting to login');
      navigate('/login');
      return;
    }
    try {
      const res = await fetch('http://localhost:8080/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Profile status response:', res.status);
      if (!res.ok) throw new Error('Failed to fetch user profile');
      const user = await res.json();
      console.log('Fetched user for profile click:', user);
      if (user.isComplete) {
        navigate('/completed-profile');
      } else {
        navigate('/complete-profile');
      }
    } catch (error) {
      console.error('Error fetching profile on profile click:', error);
      navigate('/complete-profile');
    }
  };

  const onSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // Implement search logic or debounce here
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 bg-black bg-opacity-90 backdrop-blur-md z-50 flex items-center justify-between px-6 py-3"
      style={{ height: 60 }}
    >
      <div className="flex items-center space-x-6 cursor-pointer select-none text-green-400 text-2xl font-extrabold"
        onClick={() => navigate('/')}
      >
        GameStore
      </div>

      {/* Search box */}
      <input
        type="search"
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search games..."
        className="rounded-md px-3 py-1 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
        style={{ minWidth: 250 }}
      />

      <nav className="flex items-center space-x-6 text-green-400 font-semibold">

        {/* Cart */}
        <button
          className="relative focus:outline-none"
          aria-label="Go to cart"
          onClick={() => navigate('/cart')}
        >
          Cart
        </button>

        {/* Library */}
        <button
          className="focus:outline-none"
          aria-label="Go to your library"
          onClick={() => navigate('/library')}
        >
          Library
        </button>

        {/* Profile with avatar */}
        <button
          onClick={handleProfileClick}
          className="flex items-center space-x-2 focus:outline-none cursor-pointer"
          aria-label="Go to profile"
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="User Avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-black font-bold">
              U
            </div>
          )}
        </button>

        {/* Logout */}
        <button
          className="focus:outline-none"
          aria-label="Logout"
          onClick={handleLogout}
        >
          Logout
        </button>
      </nav>
    </header>
  );
}
