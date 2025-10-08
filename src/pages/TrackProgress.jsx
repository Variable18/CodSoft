import { motion } from "framer-motion";
import { CheckCircle, ClipboardList, FolderCheck } from "lucide-react";
import { useTrackProgress } from '../TrackProgressContext';
import './TrackProgress.css';

const TrackProgress = () => {
  // Use context to get tasks and projects
  const { tasks, projects } = useTrackProgress();

  // Validate arrays
  const validTasks = Array.isArray(tasks) ? tasks : [];
  const validProjects = Array.isArray(projects) ? projects : [];

  // Task progress calculation
  const totalTasks = validTasks.length;
  const completedTasks = validTasks.filter(
    task => task.status === 'Completed' || task.done === true
  ).length;
  const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Project progress calculation
  const totalProjects = validProjects.length;
  const completedProjects = validProjects.filter(
    proj => proj.status === 'Completed'
  ).length;
  const projectProgress = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0;

  // Fallback if loading or no data
  if (!Array.isArray(tasks) && !Array.isArray(projects)) {
    return (
      <div className="loading-message">
        Loading projects or invalid data received...
      </div>
    );
  }

  return (
    <motion.div
      className="progress-container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="progress-card">
        <div className="progress-header">
          <ClipboardList size={28} color="#FBE9D0" />
          <h2>Track Progress</h2>
        </div>

        <div className="progress-section">
          <p>
            <strong>Tasks Completed:</strong> {completedTasks} / {totalTasks}
          </p>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${taskProgress}%` }}
            ></div>
          </div>
          {taskProgress === 100 && totalTasks > 0 && (
            <motion.div
              className="completion-badge"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <CheckCircle size={20} color="#2ecc71" />
              <span>All tasks completed! 🎉</span>
            </motion.div>
          )}
        </div>

        <div className="progress-section" style={{ marginTop: '2rem' }}>
          <p>
            <strong>Projects Completed:</strong> {completedProjects} / {totalProjects}
          </p>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${projectProgress}%`,
                background: '#6f9ceb'
              }}
            ></div>
          </div>
          {projectProgress === 100 && totalProjects > 0 && (
            <motion.div
              className="completion-badge"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <FolderCheck size={20} color="#4682B4" />
              <span>All projects completed! 🚀</span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TrackProgress;
