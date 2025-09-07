import { Request, Response } from 'express';
import { logger } from '../utils/logger';

// Mock template data - in production, this would come from a database
const templates = [
  {
    id: 'modern-professional',
    name: 'Modern Professional',
    description: 'Clean, modern design perfect for corporate environments and traditional industries.',
    category: 'Professional',
    preview: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPremium: false,
    professions: ['Manager', 'Consultant', 'Analyst', 'Director', 'Executive'],
    features: ['ATS-Friendly', 'Clean Layout', 'Professional Typography']
  },
  {
    id: 'creative-modern',
    name: 'Creative Modern',
    description: 'Bold, creative design for artistic and design professionals.',
    category: 'Creative',
    preview: 'https://images.pexels.com/photos/590030/pexels-photo-590030.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPremium: false,
    professions: ['Graphic Designer', 'Artist', 'Creative Director', 'Photographer'],
    features: ['Creative Layout', 'Visual Elements', 'Artistic Design']
  },
  {
    id: 'tech-modern',
    name: 'Tech Modern',
    description: 'Modern tech-focused design with clean code aesthetics.',
    category: 'Tech',
    preview: 'https://images.pexels.com/photos/590036/pexels-photo-590036.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPremium: false,
    professions: ['Software Engineer', 'Developer', 'DevOps Engineer', 'Data Scientist'],
    features: ['Tech-Focused', 'Code Aesthetics', 'Modern Layout']
  }
];

export const getTemplates = async (req: Request, res: Response) => {
  try {
    const { category, profession } = req.query;
    
    let filteredTemplates = templates;
    
    if (category && category !== 'All') {
      filteredTemplates = filteredTemplates.filter(template => template.category === category);
    }
    
    if (profession) {
      filteredTemplates = filteredTemplates.filter(template => 
        template.professions.some(p => 
          p.toLowerCase().includes((profession as string).toLowerCase()) || 
          (profession as string).toLowerCase().includes(p.toLowerCase())
        )
      );
    }

    res.json({
      success: true,
      data: { templates: filteredTemplates }
    });
  } catch (error) {
    logger.error('Get Templates Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get templates'
    });
  }
};

export const getTemplateById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const template = templates.find(t => t.id === id);
    
    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    res.json({
      success: true,
      data: { template }
    });
  } catch (error) {
    logger.error('Get Template Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get template'
    });
  }
};