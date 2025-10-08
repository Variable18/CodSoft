import { createContext, useContext, useEffect, useState } from 'react';
import api from './api/api';

const TrackProgressContext = createContext();

export function useTrackProgress() {
  return useContext(TrackProgressContext);
}

export function TrackProgressProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  const refreshData = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/projects')
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
    } catch (error) {
      console.error('Failed to refresh tasks and projects', error);
    }
  };

  // INITIAL FETCH ON MOUNT (this is the fix)
  useEffect(() => {
    refreshData();
  }, []);

  return (
    <TrackProgressContext.Provider value={{ tasks, setTasks, projects, setProjects, refreshData }}>
      {children}
    </TrackProgressContext.Provider>
  );
}
