import express from 'express';
import { body } from 'express-validator';
import {
  generateSummary,
  optimizeExperience,
  generateCoverLetter,
  generateInterviewQuestions,
  calculateATSScore,
  optimizeForJob,
  generateSkillSuggestions
} from '../controllers/aiController';
import { auth } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';


const router = express.Router();

// All AI routes require authentication
router.use(auth);

// Generate professional summary
router.post('/generate-summary', [
  body('personalInfo').notEmpty().withMessage('Personal info is required'),
  body('workExperience').isArray().withMessage('Work experience must be an array'),
  body('profession').optional().isString().withMessage('Profession must be a string')
], validateRequest, generateSummary);

// Optimize work experience
router.post('/optimize-experience', [
  body('experience').notEmpty().withMessage('Experience data is required'),
  body('profession').optional().isString().withMessage('Profession must be a string')
], validateRequest, optimizeExperience);

// Generate cover letter
router.post('/generate-cover-letter', [
  body('cvData').notEmpty().withMessage('CV data is required'),
  body('jobDescription').notEmpty().withMessage('Job description is required'),
  body('profession').optional().isString().withMessage('Profession must be a string')
], validateRequest, generateCoverLetter);

// Generate interview questions
router.post('/generate-interview-questions', [
  body('profession').notEmpty().withMessage('Profession is required'),
  body('jobDescription').optional().isString(),
  body('experienceLevel').optional().isString()
], validateRequest, generateInterviewQuestions);

// Calculate ATS score
router.post('/calculate-ats-score', [
  body('cvData').notEmpty().withMessage('CV data is required'),
  body('profession').optional().isString().withMessage('Profession must be a string')
], validateRequest, calculateATSScore);

// Optimize for specific job
router.post('/optimize-for-job', [
  body('cvData').notEmpty().withMessage('CV data is required'),
  body('jobDescription').notEmpty().withMessage('Job description is required'),
  body('profession').optional().isString().withMessage('Profession must be a string')
], validateRequest, optimizeForJob);

// Generate skill suggestions
router.post('/generate-skill-suggestions', [
  body('profession').notEmpty().withMessage('Profession is required'),
  body('experience').optional().isArray().withMessage('Experience must be an array')
], validateRequest, generateSkillSuggestions);

export default router;