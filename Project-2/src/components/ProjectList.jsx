import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { markProjectComplete } from '../api/api'; // Adjust this based on your setup
import { useTrackProgress } from '../TrackProgressContext';

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { refreshData } = useTrackProgress();

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await api.get('/projects');
        setProjects(response.data);
      } catch (err) {
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const handleMarkComplete = async (projectId) => {
    try {
      await markProjectComplete(projectId);
      await refreshData();  // Refresh updated projects/tasks data
    } catch (err) {
      console.error('Failed to mark project complete', err);
    }
  };

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h3>Your Projects</h3>
      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <ul style={{ paddingLeft: '1rem' }}>
          {projects.map((project) => (
            <li key={project._id} style={{ margin: '0.5rem 0' }}>
              <Link to={`/project/${project._id}`} style={{ color: '#2563eb', textDecoration: 'underline' }}>
                {project.title}
              </Link>
              <button
                disabled={project.status === 'Completed'}
                onClick={() => handleMarkComplete(project._id)}
                style={{ marginLeft: '1rem' }}
              >
                Mark Complete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProjectList;
