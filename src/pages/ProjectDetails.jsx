import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTrackProgress } from '../TrackProgressContext'; // Adjust path as needed

const API_BASE_URL = 'http://localhost:5000';

function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('tasks');
  const [error, setError] = useState(null);

  const { tasks, setTasks } = useTrackProgress();

  // Add Task form state
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assignee: '',
    dueDate: '',
    priority: 'Medium',
    status: 'Not Started',
  });

  // Fetch project details and sync tasks to context
  useEffect(() => {
    async function fetchProject() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch project details');
        const data = await response.json();
        setProject(data.project || data);
        setTasks((data.project || data).tasks || []);
      } catch (err) {
        setError('Failed to load project details');
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [id, setTasks]);

  // Mark an individual task as complete and sync context
  const handleCompleteTask = async (taskId) => {
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/complete`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to mark task complete');
      // Update task locally
      const updatedTasks = project.tasks.map((task) =>
        task._id === taskId ? { ...task, status: 'Completed' } : task
      );
      setProject((prev) => ({ ...prev, tasks: updatedTasks }));
      setTasks(updatedTasks);  // Sync context
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle input changes for task form
  const handleTaskFormChange = (e) => {
    setTaskForm({ ...taskForm, [e.target.name]: e.target.value });
  };

  // Submit new task and sync context
  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...taskForm, project: project._id }),
      });
      if (!response.ok) throw new Error('Failed to create task');
      const newTask = await response.json();
      const updatedTasks = [...(project.tasks || []), newTask];
      setProject((prev) => ({ ...prev, tasks: updatedTasks }));
      setTasks(updatedTasks);  // Sync context
      setShowTaskForm(false);
      setTaskForm({
        title: '',
        description: '',
        assignee: '',
        dueDate: '',
        priority: 'Medium',
        status: 'Not Started',
      });
    } catch (err) {
      alert(err.message);
    }
  };

  // Render Loading/Error states
  if (loading) return <p>Loading project...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!project) return <p>Project not found</p>;

  return (
    <div className="project-details-main">
      <header>
        <h1 className="title">{project.title}</h1>
        <p className="desc">{project.description}</p>
      </header>

      <div className="tab-bar">
        <button className={tab === 'tasks' ? 'active' : ''} onClick={() => setTab('tasks')}>
          Tasks
        </button>
        <button className={tab === 'details' ? 'active' : ''} onClick={() => setTab('details')}>
          Details
        </button>
      </div>

      <div style={{ marginTop: 28 }}>
        {tab === 'tasks' && (
          <section>
            <button className="add-task-btn" onClick={() => setShowTaskForm(true)}>
              + Add Task
            </button>

            {showTaskForm && (
              <form className="task-form-modern" onSubmit={handleAddTask}>
                <div className="form-row">
                  <label htmlFor="title">Task Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Task Title"
                    value={taskForm.title}
                    onChange={handleTaskFormChange}
                    required
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      fontSize: "16px",
                      marginBottom: "18px",
                      border: "1px solid #d1d5db",
                      background: "#f9fafb",
                      color: "#222",
                    }}
                  />
                </div>

                <div className="form-row">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Description"
                    value={taskForm.description}
                    onChange={handleTaskFormChange}
                    style={{
                      width: "100%",
                      minHeight: "82px",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      fontSize: "16px",
                      marginBottom: "18px",
                      border: "1px solid #d1d5db",
                      background: "#f9fafb",
                      color: "#222",
                    }}
                  />
                </div>

                <div className="form-row-half" style={{ display: "flex", gap: "16px" }}>
                  <div style={{ flex: 1 }}>
                    <label htmlFor="assignee">Assignee</label>
                    <input
                      type="text"
                      id="assignee"
                      name="assignee"
                      placeholder="Assignee"
                      value={taskForm.assignee}
                      onChange={handleTaskFormChange}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        fontSize: "16px",
                        marginBottom: "18px",
                        border: "1px solid #d1d5db",
                        background: "#f9fafb",
                        color: "#222",
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label htmlFor="dueDate">Due Date</label>
                    <input
                      type="date"
                      id="dueDate"
                      name="dueDate"
                      value={taskForm.dueDate}
                      onChange={handleTaskFormChange}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        fontSize: "16px",
                        marginBottom: "18px",
                        border: "1px solid #d1d5db",
                        background: "#f9fafb",
                        color: "#222",
                      }}
                    />
                  </div>
                </div>

                <div className="form-row-half" style={{ display: "flex", gap: "16px" }}>
                  <div style={{ flex: 1 }}>
                    <label htmlFor="priority">Priority</label>
                    <select
                      id="priority"
                      name="priority"
                      value={taskForm.priority}
                      onChange={handleTaskFormChange}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        fontSize: "16px",
                        marginBottom: "18px",
                        border: "1px solid #d1d5db",
                        background: "#f9fafb",
                        color: "#222",
                      }}
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      name="status"
                      value={taskForm.status}
                      onChange={handleTaskFormChange}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        fontSize: "16px",
                        marginBottom: "18px",
                        border: "1px solid #d1d5db",
                        background: "#f9fafb",
                        color: "#222",
                      }}
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="form-btn-row">
                  <button type="submit">Save Task</button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowTaskForm(false)}
                    style={{ marginLeft: "12px" }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {!project.tasks || project.tasks.length === 0 ? (
              <div style={{ marginTop: 16, color: '#666' }}>No tasks yet.</div>
            ) : (
              <div className="task-list">
                {project.tasks.map((task) => (
                  <div
                    key={task._id}
                    className="task-card"
                    style={{
                      background: "#f8fafc",
                      padding: "20px",
                      borderRadius: "10px",
                      marginBottom: "18px",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                    }}
                  >
                    <h3 style={{ marginBottom: 8 }}>{task.title}</h3>
                    <p style={{ marginBottom: 8 }}>{task.description}</p>
                    <div style={{ fontSize: "14px", color: "#555", marginBottom: 8 }}>
                      Status: {task.status} | Priority: {task.priority} | Assignee: {task.assignee} | Due: {task.dueDate}
                    </div>
                    {task.status !== 'Completed' && (
                      <button
                        style={{
                          padding: "7px 15px",
                          background: "#2563eb",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "15px",
                        }}
                        onClick={() => handleCompleteTask(task._id)}
                      >
                        Mark as Complete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {tab === 'details' && (
          <section>
            <div className="project-field">
              <b>Description:</b> {project.description || '-'}
            </div>
            <div className="project-field">
              <b>Start Date:</b> {project.startDate || '-'}
            </div>
            <div className="project-field">
              <b>Deadline:</b> {project.deadline || '-'}
            </div>
            <div className="project-field">
              <b>Priority:</b> {project.priority || '-'}
            </div>
            <div className="project-field">
              <b>Status:</b> {project.status || '-'}
            </div>
            <div className="project-field">
              <b>Team:</b>{' '}
              {Array.isArray(project.teamMembers)
                ? project.teamMembers.join(', ')
                : project.teamMembers || '-'}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default ProjectDetails;
