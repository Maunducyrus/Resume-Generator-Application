"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSkillSuggestions =
  exports.optimizeForJob =
  exports.calculateATSScore =
  exports.generateInterviewQuestions =
  exports.generateCoverLetter =
  exports.optimizeExperience =
  exports.generateSummary =
    void 0;
const openaiService_1 = require("../services/openaiService");
const logger_1 = require("../utils/logger");
const generateSummary = async (req, res) => {
  try {
    const { personalInfo, workExperience, profession } = req.body;
    if (!personalInfo || !workExperience) {
      return res.status(400).json({
        success: false,
        message: "Personal info and work experience are required",
      });
    }
    const summary =
      await openaiService_1.OpenAIService.generateProfessionalSummary(
        personalInfo,
        workExperience,
        profession || "Professional",
      );
    res.json({
      success: true,
      data: { summary },
    });
  } catch (error) {
    logger_1.logger.error("Generate Summary Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate summary",
    });
  }
};
exports.generateSummary = generateSummary;
const optimizeExperience = async (req, res) => {
  try {
    const { experience, profession } = req.body;
    if (!experience) {
      return res.status(400).json({
        success: false,
        message: "Experience data is required",
      });
    }
    const optimizedExperience =
      await openaiService_1.OpenAIService.optimizeWorkExperience(
        experience,
        profession || "Professional",
      );
    res.json({
      success: true,
      data: { experience: optimizedExperience },
    });
  } catch (error) {
    logger_1.logger.error("Optimize Experience Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to optimize experience",
    });
  }
};
exports.optimizeExperience = optimizeExperience;
const generateCoverLetter = async (req, res) => {
  try {
    const { cvData, jobDescription, profession } = req.body;
    if (!cvData || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: "CV data and job description are required",
      });
    }
    const coverLetter = await openaiService_1.OpenAIService.generateCoverLetter(
      cvData,
      jobDescription,
      profession || "Professional",
    );
    res.json({
      success: true,
      data: { coverLetter },
    });
  } catch (error) {
    logger_1.logger.error("Generate Cover Letter Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate cover letter",
    });
  }
};
exports.generateCoverLetter = generateCoverLetter;
const generateInterviewQuestions = async (req, res) => {
  try {
    const { profession, jobDescription, experienceLevel } = req.body;
    if (!profession) {
      return res.status(400).json({
        success: false,
        message: "Profession is required",
      });
    }
    const questions =
      await openaiService_1.OpenAIService.generateInterviewQuestions(
        profession,
        jobDescription,
        experienceLevel,
      );
    res.json({
      success: true,
      data: { questions },
    });
  } catch (error) {
    logger_1.logger.error("Generate Interview Questions Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate interview questions",
    });
  }
};
exports.generateInterviewQuestions = generateInterviewQuestions;
const calculateATSScore = async (req, res) => {
  try {
    const { cvData, profession } = req.body;
    if (!cvData) {
      return res.status(400).json({
        success: false,
        message: "CV data is required",
      });
    }
    const result = await openaiService_1.OpenAIService.calculateATSScore(
      cvData,
      profession || "Professional",
    );
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger_1.logger.error("Calculate ATS Score Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to calculate ATS score",
    });
  }
};
exports.calculateATSScore = calculateATSScore;
const optimizeForJob = async (req, res) => {
  try {
    const { cvData, jobDescription, profession } = req.body;
    if (!cvData || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: "CV data and job description are required",
      });
    }
    const optimization = await openaiService_1.OpenAIService.optimizeForJob(
      cvData,
      jobDescription,
      profession || "Professional",
    );
    res.json({
      success: true,
      data: optimization,
    });
  } catch (error) {
    logger_1.logger.error("Optimize for Job Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to optimize CV for job",
    });
  }
};
exports.optimizeForJob = optimizeForJob;
const generateSkillSuggestions = async (req, res) => {
  try {
    const { profession, experience } = req.body;
    if (!profession) {
      return res.status(400).json({
        success: false,
        message: "Profession is required",
      });
    }
    const skills = await openaiService_1.OpenAIService.generateSkillSuggestions(
      profession,
      experience || [],
    );
    res.json({
      success: true,
      data: { skills },
    });
  } catch (error) {
    logger_1.logger.error("Generate Skill Suggestions Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate skill suggestions",
    });
  }
};
exports.generateSkillSuggestions = generateSkillSuggestions;
//# sourceMappingURL=aiController.js.map
