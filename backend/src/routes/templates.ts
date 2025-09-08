import express from 'express';
import { getTemplates, getTemplateById } from '../controllers/templateController';

const router = express.Router();

// Get all templates
router.get('/', getTemplates);

// Get template by ID
router.get('/:id', getTemplateById);

export default router;