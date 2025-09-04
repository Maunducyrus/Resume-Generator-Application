import { Request, Response } from 'express';
import { OpenAIService } from '../services/openaiService';
import { logger } from '../utils/logger';

export const generateSummary = async (req: Request, res: Response) => {
  try {
    const { personalInfo, workExperience, profession } = req.body;

    if (!personalInfo || !workExperience) {
      return res.status(400).json({
        success: false,
        message: 'Personal info and work experience are required'
      });
    }

    const summary = await OpenAIService.generateProfessionalSummary(
      personalInfo, 
      workExperience, 
      profession || 'Professional'
    );

    res.json({
      success: true,
      data: { summary }
    });
  } catch (error) {
    logger.error('Generate Summary Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate summary'
    });
  }
};

export const optimizeExperience = async (req: Request, res: Response) => {
  try {
    const { experience, profession } = req.body;

    if (!experience) {
      return res.status(400).json({
        success: false,
        message: 'Experience data is required'
      });
    }

    const optimizedExperience = await OpenAIService.optimizeWorkExperience(
      experience, 
      profession || 'Professional'
    );

    res.json({
      success: true,
      data: { experience: optimizedExperience }
    });
  } catch (error) {
    logger.error('Optimize Experience Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to optimize experience'
    });
  }
};

export const generateCoverLetter = async (req: Request, res: Response) => {
  try {
    const { cvData, jobDescription, profession } = req.body;

    if (!cvData || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: 'CV data and job description are required'
      });
    }

    const coverLetter = await OpenAIService.generateCoverLetter(
      cvData, 
      jobDescription, 
      profession || 'Professional'
    );

    res.json({
      success: true,
      data: { coverLetter }
    });
  } catch (error) {
    logger.error('Generate Cover Letter Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate cover letter'
    });
  }
};

export const generateInterviewQuestions = async (req: Request, res: Response) => {
  try {
    const { profession, jobDescription, experienceLevel } = req.body;

    if (!profession) {
      return res.status(400).json({
        success: false,
        message: 'Profession is required'
      });
    }

    const questions = await OpenAIService.generateInterviewQuestions(
      profession, 
      jobDescription, 
      experienceLevel
    );

    res.json({
      success: true,
      data: { questions }
    });
  } catch (error) {
    logger.error('Generate Interview Questions Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate interview questions'
    });
  }
};

export const calculateATSScore = async (req: Request, res: Response) => {
  try {
    const { cvData, profession } = req.body;

    if (!cvData) {
      return res.status(400).json({
        success: false,
        message: 'CV data is required'
      });
    }

    const result = await OpenAIService.calculateATSScore(
      cvData, 
      profession || 'Professional'
    );

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Calculate ATS Score Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate ATS score'
    });
  }
};

export const optimizeForJob = async (req: Request, res: Response) => {
  try {
    const { cvData, jobDescription, profession } = req.body;

    if (!cvData || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: 'CV data and job description are required'
      });
    }

    const optimization = await OpenAIService.optimizeForJob(
      cvData, 
      jobDescription, 
      profession || 'Professional'
    );

    res.json({
      success: true,
      data: optimization
    });
  } catch (error) {
    logger.error('Optimize for Job Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to optimize CV for job'
    });
  }
};

export const generateSkillSuggestions = async (req: Request, res: Response) => {
  try {
    const { profession, experience } = req.body;

    if (!profession) {
      return res.status(400).json({
        success: false,
        message: 'Profession is required'
      });
    }

    const skills = await OpenAIService.generateSkillSuggestions(profession, experience || []);

    res.json({
      success: true,
      data: { skills }
    });
  } catch (error) {
    logger.error('Generate Skill Suggestions Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate skill suggestions'
    });
  }
};