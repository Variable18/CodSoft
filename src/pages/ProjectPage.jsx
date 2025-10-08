import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000';

export default function ProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('tasks');
  const [editedTaskId, setEditedTaskId] = useState(null);
  const [editedTaskTitle, setEditedTaskTitle] = useState('');
  const [editedTaskDescription, setEditedTaskDescription] = useState('');

  useEffect(() => {
    async function fetchProjectAndTasks() {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');

        const projectRes = await fetch(`${API_BASE_URL}/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!projectRes.ok) throw new Error('Failed to load project');
        const projectData = await projectRes.json();
        setProject(projectData);

        const tasksRes = await fetch(`${API_BASE_URL}/tasks?projectId=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!tasksRes.ok) throw new Error('Failed to load tasks');
        const tasksData = await tasksRes.json();
        setTasks(tasksData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProjectAndTasks();
  }, [id]);

  const startEditTask = (task) => {
    setEditedTaskId(task._id);
    setEditedTaskTitle(task.title);
    setEditedTaskDescription(task.description || '');
  };

  const saveTaskEdit = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/tasks/${editedTaskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editedTaskTitle,
          description: editedTaskDescription,
        }),
      });
      if (!response.ok) throw new Error('Failed to update task');
      const updatedTask = await response.json();
      setTasks((prev) =>
        prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
      );
      setEditedTaskId(null);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading project data...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!project) return <p>Project not found.</p>;

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>{project.title}</h1>
      <p>{project.description || 'This is a sample project description.'}</p>

      <div style={{ marginTop: 30, borderBottom: '1px solid #ddd' }}>
        <button
          className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          Tasks
        </button>
        <button
          className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Details
        </button>
      </div>

      {activeTab === 'tasks' ? (
        <div style={{ marginTop: 20 }}>
          {tasks.length === 0 && <p>No tasks yet.</p>}
          {tasks.map((task) => (
            <div
              key={task._id}
              className="task-card"
              style={{
                marginBottom: 16,
                padding: 15,
                borderRadius: 9,
                boxShadow: '0 3px 14px rgb(0 0 0 / 0.07)',
                backgroundColor: '#fafafa',
              }}
            >
              {editedTaskId === task._id ? (
                <>
                  <input
                    value={editedTaskTitle}
                    onChange={(e) => setEditedTaskTitle(e.target.value)}
                    style={{ fontSize: 18, width: '100%', marginBottom: 8 }}
                  />
                  <textarea
                    value={editedTaskDescription}
                    onChange={(e) => setEditedTaskDescription(e.target.value)}
                    rows={3}
                    style={{ width: '100%', marginBottom: 10, fontSize: 14 }}
                    placeholder="Enter task description"
                  />
                  <button onClick={saveTaskEdit}>Save</button>
                  <button onClick={() => setEditedTaskId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <h3>{task.title}</h3>
                  <p>Status: {task.status || 'Not Started'}</p>
                  <p>Description: {task.description || 'No description'}</p>
                  <p>Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'None'}</p>
                  <button onClick={() => startEditTask(task)}>Edit Task</button>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ marginTop: 20 }}>
          <h2>Project Details</h2>
          <p>More details about the project can go here...</p>
        </div>
      )}

      <style>{`
        .tab-btn {
          background: none;
          border: none;
          color: #555;
          padding: 10px 15px;
          margin-right: 8px;
          font-size: 15px;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.3s;
        }
        .tab-btn:hover {
          color: #2563eb;
        }
        .tab-btn.active {
          color: #2563eb;
          border-bottom: 2px solid #2563eb;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
