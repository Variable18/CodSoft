import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectForm from '../components/ProjectForm';
import { useTrackProgress } from '../TrackProgressContext';

const API_BASE_URL = 'http://localhost:5000';

export default function MyProjectsPage() {
  const { projects, refreshData } = useTrackProgress();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Directly rely on context's refresh for consistent state
  const handleCreateProject = async (projectData) => {
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectData),
      });
      if (!response.ok) throw new Error('Failed to create project');
      await refreshData();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleCompleteProject = async (id) => {
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'Completed' }),
      });
      if (!response.ok) throw new Error('Failed to mark project complete');
      await refreshData();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const trackProgress = () => {
    if (!projects || projects.length === 0) return 0;
    const completed = projects.filter(p => p.status === 'Completed').length;
    return Math.round((completed / projects.length) * 100);
  };

  return (
    <div className="scroll-hidden">
      <div className="split-main">
        <div className="split-left">
          <header style={{ textAlign: "center", marginBottom: 12 }}>
            <h1 className="projects-header">My Projects</h1>
            <p>Organize, create, and manage all your projects in one dashboard.</p>
          </header>
          <ProjectForm onCreate={handleCreateProject} />
          {error && <div className="projects-error">{error}</div>}
          <div className="projects-progress-bar">
            <div style={{
              width: "100%",
              background: "#eee",
              borderRadius: "6px",
              overflow: "hidden",
              height: "18px",
              margin: "16px 0"
            }}>
              <div
                style={{
                  width: `${trackProgress()}%`,
                  background: "#90e868",
                  height: "100%",
                  transition: "width 0.4s"
                }}
              />
            </div>
            <div style={{ textAlign: "center", fontSize: 13 }}>
              {trackProgress()}% completed
            </div>
          </div>
        </div>
        <div className="split-right">
          <h2 style={{ textAlign: "center" }}>Your Projects</h2>
          {loading ? (
            <div className="projects-loader">Loading projects...</div>
          ) : (
            <div className="project-card-list">
              {(projects && projects.length === 0) ? (
                <div className="projects-empty">
                  <div className="projects-empty-icon">📁</div>
                  <div>No projects yet.<br />Get started by creating your first project!</div>
                </div>
              ) : (
                projects && projects.map(project => (
                  <div
                    key={project._id}
                    className="project-card-modern"
                    onClick={() => navigate(`/project/${project._id}`)}
                    tabIndex={0}
                  >
                    <h3 style={{ marginBottom: 10, color: "#2563eb" }}>
                      {project.title}
                    </h3>
                    <div style={{ color: "#555", fontSize: 15 }}>
                      {project.description?.slice(0, 48) || '(No description)'}
                    </div>
                    <div style={{ marginTop: 16, fontSize: 13, color: "#777" }}>
                      {project.status} &middot; {project.priority}
                    </div>
                    {project.status !== 'Completed' && (
                      <button
                        className="complete-btn"
                        style={{
                          marginTop: 12,
                          padding: "7px 16px",
                          background: "#8b5cf6",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                        onClick={e => {
                          e.stopPropagation();
                          handleCompleteProject(project._id);
                        }}
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
