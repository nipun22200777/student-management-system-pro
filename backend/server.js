import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import studentRoutes from './routes/studentRoutes.js';

dotenv.config({ path: './backend/.env' });

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

app.get('/api/db-status', (req, res) => {
  // Mongoose readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const state = mongoose.connection.readyState;
  res.json({ status: state === 1 ? 'Connected' : 'Disconnected' });
});

app.listen(serverPort, () => {
  console.log(`🚀 Server running on http://localhost:${serverPort}`);
});
