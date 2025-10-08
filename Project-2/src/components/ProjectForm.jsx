import { useState } from 'react';

export default function ProjectForm({ onCreate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [teamMembers, setTeamMembers] = useState('');
  const [status, setStatus] = useState('Planning');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Project name is required');
      return;
    }
    setError('');
    const projectData = {
      title,
      description,
      startDate,
      deadline,
      priority,
      teamMembers: teamMembers.split(',').map(n => n.trim()).filter(Boolean),
      status,
    };
    if (onCreate) onCreate(projectData);
    setTitle('');
    setDescription('');
    setStartDate('');
    setDeadline('');
    setPriority('Medium');
    setTeamMembers('');
    setStatus('Planning');
  };

  return (
    <form onSubmit={handleSubmit} className="form-card-modern">
      <h2 style={{ textAlign: 'center', marginBottom: 10, fontWeight: 700 }}>Create New Project</h2>
      {error && <div style={{ color: "#ef4444", marginBottom: 13 }}>{error}</div>}

      <label htmlFor="project-title" style={{ fontWeight: 500, marginBottom: 4 }}>Project Name</label>
      <input id="project-title" type="text" value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Enter project name"
        required
        className="input-field-modern"
      />

      <label htmlFor="project-desc" style={{ fontWeight: 500, marginBottom: 4, marginTop: 10 }}>Description</label>
      <textarea id="project-desc" value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Short project description"
        className="input-field-modern"
        style={{ minHeight: "60px" }}
      />

      <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
        <div style={{ flex: 1 }}>
          <label htmlFor="project-start" style={{ fontWeight: 500, marginBottom: 4 }}>Start Date</label>
          <input id="project-start" type="date" value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="input-field-modern"
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label htmlFor="project-deadline" style={{ fontWeight: 500, marginBottom: 4 }}>Deadline</label>
          <input id="project-deadline" type="date" value={deadline}
            onChange={e => setDeadline(e.target.value)}
            className="input-field-modern"
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <label htmlFor="project-priority" style={{ fontWeight: 500, marginBottom: 4, marginTop: 10 }}>Priority</label>
      <select id="project-priority" value={priority}
        onChange={e => setPriority(e.target.value)}
        className="input-field-modern"
        style={{ marginTop: 4 }}
      >
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>

      <label htmlFor="project-team" style={{ fontWeight: 500, marginBottom: 4, marginTop: 10 }}>Team Members</label>
      <input id="project-team" type="text" value={teamMembers}
        onChange={e => setTeamMembers(e.target.value)}
        placeholder="e.g. Alice, Bob, Charlie"
        className="input-field-modern"
      />

      <label htmlFor="project-status" style={{ fontWeight: 500, marginBottom: 4, marginTop: 10 }}>Status</label>
      <select id="project-status" value={status}
        onChange={e => setStatus(e.target.value)}
        className="input-field-modern"
        style={{ marginTop: 4 }}
      >
        <option value="Planning">Planning</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      <button type="submit" className="submit-btn-modern" style={{ marginTop: 18 }}>
        Create Project
      </button>
    </form>
  );
}
