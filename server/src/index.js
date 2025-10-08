import bcrypt from 'bcryptjs';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import fetch from 'node-fetch'; // if not installed, run npm i node-fetch@2

// Wrap async initialization inside an async function
async function startServer() {
  const MONGODB_URI = process.env.MONGODB_URI;
  const DB_NAME = 'Users'; // Plural database name as per your setup
  await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
  console.log('MongoDB connected:', DB_NAME);

  const userSchema = new mongoose.Schema(
    {
      username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
      email: { type: String, required: true, unique: true, lowercase: true, trim: true },
      phone: { type: String },
      name: { type: String },
      passwordHash: { type: String, required: true },
      avatarUrl: { type: String },
      isComplete: { type: Boolean, default: false }
    },
    { collection: 'data', timestamps: true }
  );
  const User = mongoose.model('User', userSchema);

  const profileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
    name: String,
    username: String,
    phone: String,
    avatarUrl: String,
    isComplete: Boolean,
  },
  { collection: 'profile', timestamps: true }
);

const cartItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  gameId: { type: String, required: true },
  name: String,
  coverUrl: String,
  price: Number,
}, { collection: 'cartItems', timestamps: true });

const CartItem = mongoose.model('CartItem', cartItemSchema);


const Profile = mongoose.model('Profile', profileSchema);


  const app = express();
  app.use('/images', express.static('../public/images'));
  app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
  app.use(express.json());

app.get('/api/games/sponsored', (_req, res) => {
  const sponsoredGames = [
    {
      id: 'elden-ring',
      name: 'Elden Ring',
      coverUrl: 'https://media.rawg.io/media/screenshots/ece/ece8cc7b249d9b06815bdb56461075d2.jpg',   // local relative URL
      description: 'A vast world awaits in Elden Ring.',
    },
    {
      id: 'spider-man-2',
      name: 'Spider Man 2',
      coverUrl: 'https://media.rawg.io/media/screenshots/89b/89b077deb2a3ce38e071fdb5caae69c0.jpg',  // local relative URL
      description: 'Swing through New York City in Spider-Man 2.',
    },
    {
      id: 'red-dead-redemption-2',
      name: 'Red Dead Redemption 2',
      coverUrl: 'https://media.rawg.io/media/screenshots/0f4/0f490d644f01f0aad6b0728350fec87d.jpg',
      description: 'Experience the Wild West in Red Dead Redemption 2.',
    },
    {
      id: 'god-of-war',
      name: 'God of War',
      coverUrl: 'https://media.rawg.io/media/screenshots/a54/a549a06ebe89c570cabb57308c4c42a5.jpeg',
      description: 'Kratos returns in God of War.',
    },
    {
      id: 'god-of-war-ragnarok',
      name: 'God of War Ragnarok',
      coverUrl: 'https://media.rawg.io/media/screenshots/1b9/1b91adb1b1ca70f006fc5942cff6fd36.jpg',
      description: 'The epic finale of God of War series.',
    },
  ];

  res.json(sponsoredGames);
});


  app.get('/api/health', (_req, res) => res.json({ ok: true }));

  app.post('/api/auth/register', async (req, res) => {
    try {
      const { username, email, phone, name, password, avatarUrl } = req.body;
      if (!username || !email || !password) {
        return res.status(400).json({ error: 'username, email, and password are required' });
      }

      const existing = await User.findOne({ $or: [{ username }, { email }] });
      if (existing) return res.status(409).json({ error: 'Username or email already in use' });

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const doc = await User.create({ username, email, phone, name, passwordHash, avatarUrl, isComplete: false });
      const token = jwt.sign({ sub: doc._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' });

      console.log('Registered:', doc._id);
      return res.status(201).json({
        token,
        user: {
          id: doc._id,
          username: doc.username,
          email: doc.email,
          name: doc.name,
          phone: doc.phone,
          avatarUrl: doc.avatarUrl,
          isComplete: doc.isComplete
        }
      });
    } catch (e) {
      console.error('Register error:', e);
      return res.status(500).json({ error: 'Server error' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { identifier, password } = req.body;
      if (!identifier || !password) return res.status(400).json({ error: 'identifier and password are required' });

      const user = await User.findOne({ $or: [{ username: identifier }, { email: identifier }] });
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });

      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

      const token = jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          name: user.name,
          phone: user.phone,
          avatarUrl: user.avatarUrl,
          isComplete: user.isComplete
        }
      });
    } catch (e) {
      console.error('Login error:', e);
      return res.status(500).json({ error: 'Server error' });
    }
  });

  app.get('/api/users/me', async (req, res) => {
    try {
      const auth = req.headers.authorization || '';
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
      if (!token) return res.status(401).json({ error: 'Missing token' });

      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const me = await User.findById(payload.sub).select('-passwordHash');
      return res.json(me || null);
    } catch (e) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  });

  // Update/complete profile (requires Bearer token)
  app.post('/api/users/upsert', async (req, res) => {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing token' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { name, username, phone, avatarUrl, isComplete } = req.body;

    // Optional: Check username uniqueness in profile collection
    if (username) {
      const clash = await Profile.findOne({ username, userId: { $ne: payload.sub } });
      if (clash) return res.status(409).json({ error: 'Username already in use' });
    }

    const updated = await Profile.findOneAndUpdate(
      { userId: payload.sub },
      { $set: { name, username, phone, avatarUrl, isComplete: !!isComplete } },
      { new: true, upsert: true }
    );

    res.json(updated);
  } catch (e) {
    console.error('Profile upsert error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/users/profile', async (req, res) => {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing token' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const profile = await Profile.findOne({ userId: payload.sub });
    res.json(profile || {});
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Middleware to get user ID from JWT
function authenticate(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Add game to cart
app.post('/api/cart/add', authenticate, async (req, res) => {
  const { gameId, name, coverUrl, price } = req.body;
  if (!gameId) return res.status(400).json({ error: 'gameId required' });

  // Check if already in cart
  const exists = await CartItem.findOne({ userId: req.userId, gameId });
  if (exists) return res.status(409).json({ error: 'Game already in cart' });

  const newItem = await CartItem.create({
    userId: req.userId,
    gameId,
    name,
    coverUrl,
    price,
  });

  res.json(newItem);
});

// Get cart items for logged in user
app.get('/api/cart', authenticate, async (req, res) => {
  const items = await CartItem.find({ userId: req.userId });
  res.json(items);
});

// Remove item from cart
app.post('/api/cart/remove', authenticate, async (req, res) => {
  const { gameId } = req.body;
  if (!gameId) return res.status(400).json({ error: 'gameId required' });

  await CartItem.deleteOne({ userId: req.userId, gameId });
  res.json({ success: true });
});



  app.get('/api/games/popular', async (req, res) => {
    try {
      const apiKey = process.env.RAWG_API_KEY;
      if (!apiKey) return res.status(500).json({ error: 'RAWG_API_KEY not set' });

      const publisher = req.query.publisher || '';
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.page_size) || 10;
      const ordering = req.query.ordering || '-rating';

      const url = new URL('https://api.rawg.io/api/games');
      url.searchParams.append('key', apiKey);
      url.searchParams.append('ordering', ordering);
      url.searchParams.append('page', page);
      url.searchParams.append('page_size', pageSize);

      if (publisher) {
        url.searchParams.append('publishers', publisher);
      }

      const response = await fetch(url.toString());
      if (!response.ok) return res.status(502).json({ error: 'Failed to fetch from RAWG' });

      const data = await response.json();

      const games = data.results.map(game => ({
        id: game.id,
        name: game.name,
        coverUrl: game.background_image,
        released: game.released,
        rating: game.rating,
        description: game.description_raw
      }));

      res.json(games);
    } catch (error) {
      console.error('RAWG fetch error:', error);
      res.status(500).json({ error: 'Server error fetching popular games' });
    }
  });

  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => console.log(`API running on :${PORT}`));
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});


