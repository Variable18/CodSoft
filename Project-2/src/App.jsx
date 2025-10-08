import axios from 'axios';
import { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { TrackProgressProvider } from './TrackProgressContext.jsx';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import MyProjectsPage from './pages/MyProjectsPage';
import ProjectDetails from './pages/ProjectDetails';
import SignupPage from './pages/SignupPage';
import TrackProgress from './pages/TrackProgress';

import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem('loggedIn') === 'true');
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (loggedIn) {
      localStorage.setItem('loggedIn', 'true');
      // Fetch real projects from backend
      const fetchProjects = async () => {
        try {
          const response = await axios.get('/api/projects'); // Example API URL, replace with real one
          // Assumes backend returns array of projects in response.data
          setProjects(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
          console.error('Error fetching projects:', error);
          setProjects([]);
        }
      };
      fetchProjects();
    } else {
      localStorage.removeItem('loggedIn');
      setProjects([]);
    }
  }, [loggedIn]);

  const handleLogin = () => setLoggedIn(true);
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setLoggedIn(false);
  };

  return (
    <TrackProgressProvider>
    <Router>
      <Routes>
        <Route path="/login" element={!loggedIn ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/" />} />
        <Route path="/signup" element={!loggedIn ? <SignupPage onSignup={handleLogin} /> : <Navigate to="/" />} />

        <Route path="/" element={loggedIn ? <LandingPage onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/project/:id" element={loggedIn ? <ProjectDetails /> : <Navigate to="/login" />} />
        <Route path="/projects" element={loggedIn ? <MyProjectsPage /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={loggedIn ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/trackprogress" element={loggedIn ? <TrackProgress projects={projects} /> : <Navigate to="/login" />} />

        <Route path="*" element={<Navigate to={loggedIn ? "/" : "/login"} />} />
      </Routes>
    </Router>
    </TrackProgressProvider>
  );
}

export default App;
