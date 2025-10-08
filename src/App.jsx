import { useState } from 'react';
import { Link, Navigate, Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';
import Cart from './components/Cart';
import CompleteProfile from './pages/CompleteProfile.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import PaymentPage from './pages/PaymentPage.jsx';
import CompletedProfile from './pages/Profile.jsx';
import SignUp from './pages/SignUp.jsx';

function getToken() {
  return localStorage.getItem('token');
}

function Header({ token, setToken }) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-black text-green-400">
      <Link to="/" className="text-xl font-bold">GameStore</Link>
      <nav className="space-x-6">
        {!token ? (
          <>
            <Link to="/login" className="hover:text-green-400">Login</Link>
            <Link to="/signup" className="hover:text-green-400">Sign Up</Link>
          </>
        ) : (
          <>
            <Link to="/" className="hover:text-green-400">Home</Link>
            <Link to="/sell" className="hover:text-green-400">Sell</Link>
            <Link to="/complete-profile" className="hover:text-green-400">Profile</Link>
            <Link to="/cart" className="hover:text-green-400">Cart</Link>
            <button
              onClick={handleLogout}
              className="hover:text-green-400 bg-transparent border-none cursor-pointer"
              style={{ outline: 'none' }}
            >
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

export default function App() {
  const [token, setToken] = useState(getToken());

  return (
    <Router>
      <Header token={token} setToken={setToken} />
      <Routes>
        {!token ? (
          <>
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/completed-profile" element={<CompletedProfile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/checkout" element={<PaymentPage />} />
          </>
        )}
      </Routes>
    </Router>
  );
}
