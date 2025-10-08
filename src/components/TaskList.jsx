import PropTypes from 'prop-types';
import { useState } from 'react';
import { markTaskComplete } from '../api'; // Adjust path if api.js is elsewhere

function TaskList({ tasks: initialTasks }) {
  const [tasks, setTasks] = useState(initialTasks);

  const handleCompleteClick = async (taskId) => {
    try {
      const updatedTask = await markTaskComplete(taskId);
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );
    } catch (e) {
      alert('Failed to mark task complete');
    }
  };

  if (!tasks || tasks.length === 0) {
    return <p>No tasks available.</p>;
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {tasks.map((task) => (
        <li
          key={task._id}
          style={{
            border: '1px solid #ddd',
            padding: '1rem',
            marginBottom: '0.5rem',
            borderRadius: '6px',
            backgroundColor: '#fafafa',
          }}
        >
          <h4 style={{ margin: '0 0 0.5rem 0' }}>{task.title}</h4>
          <p>Status: {task.status}</p>
          <p>Description: {task.description || 'No description'}</p>
          <p>
            Deadline:{' '}
            {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'None'}
          </p>
          <button
            onClick={() => handleCompleteClick(task._id)}
            disabled={task.status === 'Completed'}
          >
            Mark Complete
          </button>
        </li>
      ))}
    </ul>
  );
}

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      deadline: PropTypes.string,
      status: PropTypes.string,
    }),
  ).isRequired,
};

export default TaskList;
