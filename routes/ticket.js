import express from 'express';
import {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  assignTicket,
  getUserTickets
} from '../controllers/ticket.js';
import { authenticateToken, requireRole } from '../middlewares/auth.js';

const router = express.Router();

// Public routes (for viewing tickets)
router.get('/all', getAllTickets);
router.get('/:id', getTicketById);

// Protected routes
router.post('/create', authenticateToken, createTicket);
router.get('/user/my-tickets', authenticateToken, getUserTickets);
router.put('/:id', authenticateToken, requireRole(['moderator', 'admin']), updateTicket);
router.put('/:id/assign', authenticateToken, requireRole(['admin']), assignTicket);

export default router;