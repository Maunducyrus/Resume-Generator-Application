import express from 'express';
import { body, param } from 'express-validator';
import {
  createCV,
  getUserCVs,
  getCVById,
  updateCV,
  deleteCV,
  shareCV,
  getSharedCV
} from '../controllers/cvController';
import { auth } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';


const router = express.Router();

// Create CV validation
const createCVValidation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('CV name must be between 1 and 200 characters'),
  body('templateId')
    .notEmpty()
    .withMessage('Template ID is required'),
  body('data')
    .notEmpty()
    .withMessage('CV data is required'),
  body('profession')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Profession cannot exceed 100 characters')
];

// Update CV validation
const updateCVValidation = [
  param('id').isMongoId().withMessage('Invalid CV ID'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('CV name must be between 1 and 200 characters'),
  body('templateId')
    .optional()
    .notEmpty()
    .withMessage('Template ID cannot be empty'),
  body('atsScore')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('ATS score must be between 0 and 100')
];

// Routes
router.post('/', auth, createCVValidation, validateRequest, createCV);
router.get('/', auth, getUserCVs);
router.get('/:id', auth, [param('id').isMongoId()], validateRequest, getCVById);
router.put('/:id', auth, updateCVValidation, validateRequest, updateCV);
router.delete('/:id', auth, [param('id').isMongoId()], validateRequest, deleteCV);
router.put('/:id/share', auth, [
  param('id').isMongoId().withMessage('Invalid CV ID'),
  body('isPublic').isBoolean().withMessage('isPublic must be a boolean')
], validateRequest, shareCV);

// Public route for shared CVs
router.get('/shared/:shareUrl', getSharedCV);

export default router;