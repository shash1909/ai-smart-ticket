import express from 'express';
import { 
  signup, 
  login, 
  verifyEmail, 
  getProfile, 
  getAllUsers, 
  updateUserRole 
} from '../controllers/user.js';
import { authenticateToken, requireRole } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/verify/:token', verifyEmail);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.get('/all', authenticateToken, requireRole(['admin']), getAllUsers);
router.put('/:userId/role', authenticateToken, requireRole(['admin']), updateUserRole);

export default router;