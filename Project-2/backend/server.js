const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

// Notification Schema and model
const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  read: { type: Boolean, default: false },
});

const Notification = mongoose.model('Notification', notificationSchema);

// Middleware setup
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// User schema and model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
});

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.passwordHash);
};

const User = mongoose.model('User', userSchema);

// Project and Task Schemas and models
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  startDate: Date,
  deadline: Date,
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  teamMembers: [String], // array of names like ["Alice", "Bob"]
  status: { type: String, enum: ['Planning', 'In Progress', 'Completed'], default: 'Planning' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  createdAt: { type: Date, default: Date.now },
})


const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  deadline: Date,
  status: { type: String, default: 'Not Started' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' }, // Optional enhancement
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  createdAt: { type: Date, default: Date.now },
});

const Project = mongoose.model('Project', projectSchema);
const Task = mongoose.model('Task', taskSchema);

// MongoDB connection with explicit logging and graceful failure exit
console.log('Attempting MongoDB connection to:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes

app.get('/', (req, res) => res.send('API is running'));

// Signup
app.post('/auth/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) return res.status(400).json({ error: 'Username or email already exists' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({ username, email, passwordHash });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

// Login
app.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'Invalid username or password' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid username or password' });

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    console.error('Login error caught:', err);  // <--- Add this line for detailed logs
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Projects CRUD

// Create Project
app.post('/projects', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      startDate,
      deadline,
      priority,
      teamMembers,
      status
    } = req.body;
    const userId = req.user.id;

    const project = new Project({
      title,
      description,
      startDate: startDate ? new Date(startDate) : undefined,
      deadline: deadline ? new Date(deadline) : undefined,
      priority: priority || 'Medium',
      teamMembers: Array.isArray(teamMembers)
        ? teamMembers
        : typeof teamMembers === 'string'
        ? teamMembers.split(',').map(n => n.trim())
        : [],
      status: status || 'Planning',
      createdBy: userId,
      tasks: []
    });

    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get Projects by user
app.get('/projects', authenticateToken, async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user.id }).populate('tasks');
    res.json(projects);
  } catch (err) {
    console.error('Get projects error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get single project
app.get('/projects/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, createdBy: req.user.id }).populate('tasks');
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    console.error('Get project error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update project
app.put('/projects/:id', authenticateToken, async (req, res) => {
  const { title, description, status } = req.body;
  const updateFields = {};
  if (title !== undefined) updateFields.title = title;
  if (description !== undefined) updateFields.description = description;
  if (status !== undefined) updateFields.status = status;

  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      updateFields,
      { new: true }
    );
    if (!project) return res.status(404).json({ message: 'Project not found' });

    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Delete project and tasks
app.delete('/projects/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    await Task.deleteMany({ project: req.params.id });

    res.json({ message: 'Project and associated tasks deleted' });
  } catch (err) {
    console.error('Delete project error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Tasks CRUD

// Create Task
app.post('/tasks', authenticateToken, async (req, res) => {
  try {
    const { title, description, deadline, status, priority, assignedTo, project } = req.body;

    // TODO: Verify that project belongs to user or user has access (security)

    const task = new Task({ title, description, deadline, status, priority, assignedTo, project });
    await task.save();

    await Project.findByIdAndUpdate(project, { $push: { tasks: task._id } });

    res.status(201).json(task);
  } catch (err) {
    console.error('Create task error:', err);
    res.status(400).json({ error: err.message });
  }
});

// Get all tasks for user's projects
app.get('/tasks', authenticateToken, async (req, res) => {
  try {
    // Could filter tasks belonging to user projects
    const tasks = await Task.find().populate('project assignedTo');
    res.json(tasks);
  } catch (err) {
    console.error('Get tasks error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get a single task
app.get('/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('project assignedTo');
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error('Get task error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update task
app.put('/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const { title, description, deadline, status, priority, assignedTo, project } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, deadline, status, priority, assignedTo, project },
      { new: true }
    );

    if (!task) return res.status(404).json({ error: 'Task not found' });

    res.json(task);
  } catch (err) {
    console.error('Update task error:', err);
    res.status(400).json({ error: err.message });
  }
});

// Delete task
app.delete('/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    await Project.findByIdAndUpdate(task.project, { $pull: { tasks: task._id } });

    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error('Delete task error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Notifications API
app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ date: -1 })
      .limit(50);
    res.json(notifications);
  } catch (err) {
    console.error('Get notifications error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Mark a task as complete
app.patch('/tasks/:id/complete', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: 'Completed' },
      { new: true }
    );
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error('Mark task complete error:', err);
    res.status(500).json({ error: err.message });
  }
});


// Mark notification read
app.put('/api/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    res.json(notification);
  } catch (err) {
    console.error('Update notification error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
