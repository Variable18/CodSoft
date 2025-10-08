import { useState } from 'react';

function TaskForm({ initialData = {}, onSubmit }) {
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [deadline, setDeadline] = useState(
    initialData.deadline ? initialData.deadline.split('T')[0] : '',
  );
  const [status, setStatus] = useState(initialData.status || 'Not Started');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ title, description, deadline, status });
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <label style={styles.label}>Title</label>
      <input
        type="text"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={styles.input}
      />

      <label style={styles.label}>Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={styles.textarea}
      />

      <label style={styles.label}>Deadline</label>
      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        style={styles.input}
      />

      <label style={styles.label}>Status</label>
      <select value={status} onChange={(e) => setStatus(e.target.value)} style={styles.select}>
        <option value="Not Started">Not Started</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      <button type="submit" style={styles.button}>Save Task</button>
    </form>
  );
}

const styles = {
  form: {
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '6px',
    marginTop: '10px',
  },
  input: {
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  textarea: {
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    resize: 'vertical',
  },
  select: {
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  button: {
    marginTop: '15px',
    padding: '10px 0',
    borderRadius: '6px',
    backgroundColor: '#2a68ff',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1rem',
    border: 'none',
    cursor: 'pointer',
  },
};

export default TaskForm;
