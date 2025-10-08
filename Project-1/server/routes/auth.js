import bcrypt from 'bcryptjs';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();

function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

router.post('/register', async (req, res) => {
  const { username, email, phone, name, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'Missing fields' });

  const existing = await User.findOne({ $or: [{ username }, { email }] });
  if (existing) return res.status(409).json({ error: 'Username or email already in use' });

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt); // bcrypt hashing[7][16]

  const user = await User.create({ username, email, phone, name, passwordHash });
  const token = signToken(user._id.toString());
  res.status(201).json({ token, user: { id: user._id, username: user.username, email: user.email, name: user.name, phone: user.phone } });
});

router.post('/login', async (req, res) => {
  const { identifier, password } = req.body; // identifier can be username or email
  if (!identifier || !password) return res.status(400).json({ error: 'Missing fields' });

  const user = await User.findOne({
    $or: [{ username: identifier }, { email: identifier }]
  });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const token = signToken(user._id.toString());
  res.json({ token, user: { id: user._id, username: user.username, email: user.email, name: user.name, phone: user.phone } });
});

export default router;
