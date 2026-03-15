import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import studentRoutes from './routes/studentRoutes.js';
import authRoutes from './routes/authRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
// Keep 5001 as fallback because port 5000 is still used by Chrome utility
const PORT = process.env.PORT || 5001;
// If the port from .env is exactly 5000, we'll force 5001 due to the conflict
const serverPort = PORT == 5000 ? 5001 : PORT;

app.use(cors());
app.use(express.json());

// MongoDB Atlas Connection from .env
const MONGO_URI = process.env.MONGODB_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
  });

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/db-status', (req, res) => {
  // Mongoose readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const state = mongoose.connection.readyState;
  res.json({ status: state === 1 ? 'Connected' : 'Disconnected' });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

app.listen(serverPort, () => {
  console.log(`🚀 Server running on http://localhost:${serverPort}`);
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});
