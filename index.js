import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { serve } from 'inngest/express';
import { inngest } from './inngest/client.js';
import { onSignup, onTicketCreate } from './inngest/functions/index.js';
import 'dotenv/config';
// Import routes 
import userRoutes from './routes/user.js';
import ticketRoutes from './routes/ticket.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(cors({
  origin: process.env.APP_URL || 'http://localhost:5173',
  credentials: true
})); 
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes);

// Inngest endpoint
app.use('/api/inngest', serve({
  client: inngest,
  functions: [onSignup, onTicketCreate]
}));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});