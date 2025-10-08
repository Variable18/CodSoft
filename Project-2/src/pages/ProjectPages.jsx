import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ProjectList from '../components/ProjectList';

const API_BASE_URL = 'http://localhost:5000';

export default function MyProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/projects`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to load projects');
        const data = await response.json();
        setProjects(data.projects || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      setError('Project name cannot be empty');
      return;
    }
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newProjectName.trim() }),
      });
      if (!response.ok) throw new Error('Failed to create project');
      const createdProject = await response.json();
      setProjects((prev) => [...prev, createdProject]);
      setNewProjectName('');

      navigate(`/project/${createdProject._id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1>My Projects</h1>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="New Project Name"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          style={{
            flexGrow: 1,
            padding: '0.7rem 1rem',
            fontSize: '1rem',
            borderRadius: '8px',
            border: '1.5px solid #cbd5e1',
          }}
        />
        <Button onClick={handleCreateProject}>Create</Button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <ProjectList projects={projects} />
      )}
    </div>
  );
}
