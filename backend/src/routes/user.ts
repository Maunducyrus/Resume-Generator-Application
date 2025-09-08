import express from 'express';
import { body } from 'express-validator';
import { getUserProfile, updateUserProfile } from '../controllers/userController';
import { auth } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';

const router = express.Router();

// All user routes require authentication
router.use(auth);

// Get user profile
router.get('/profile', getUserProfile);

// Update user profile
router.put('/profile', [
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('profession').optional().trim().isLength({ max: 100 })
], validateRequest, updateUserProfile);

export default router;