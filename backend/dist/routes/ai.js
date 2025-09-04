"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const aiController_1 = require("../controllers/aiController");
const auth_1 = require("../middleware/auth");
const validateRequest_1 = require("../middleware/validateRequest");
const router = express_1.default.Router();
// All AI routes require authentication
router.use(auth_1.auth);
// Generate professional summary
router.post('/generate-summary', [
    (0, express_validator_1.body)('personalInfo').notEmpty().withMessage('Personal info is required'),
    (0, express_validator_1.body)('workExperience').isArray().withMessage('Work experience must be an array'),
    (0, express_validator_1.body)('profession').optional().isString().withMessage('Profession must be a string')
], validateRequest_1.validateRequest, aiController_1.generateSummary);
// Optimize work experience
router.post('/optimize-experience', [
    (0, express_validator_1.body)('experience').notEmpty().withMessage('Experience data is required'),
    (0, express_validator_1.body)('profession').optional().isString().withMessage('Profession must be a string')
], validateRequest_1.validateRequest, aiController_1.optimizeExperience);
// Generate cover letter
router.post('/generate-cover-letter', [
    (0, express_validator_1.body)('cvData').notEmpty().withMessage('CV data is required'),
    (0, express_validator_1.body)('jobDescription').notEmpty().withMessage('Job description is required'),
    (0, express_validator_1.body)('profession').optional().isString().withMessage('Profession must be a string')
], validateRequest_1.validateRequest, aiController_1.generateCoverLetter);
// Generate interview questions
router.post('/generate-interview-questions', [
    (0, express_validator_1.body)('profession').notEmpty().withMessage('Profession is required'),
    (0, express_validator_1.body)('jobDescription').optional().isString(),
    (0, express_validator_1.body)('experienceLevel').optional().isString()
], validateRequest_1.validateRequest, aiController_1.generateInterviewQuestions);
// Calculate ATS score
router.post('/calculate-ats-score', [
    (0, express_validator_1.body)('cvData').notEmpty().withMessage('CV data is required'),
    (0, express_validator_1.body)('profession').optional().isString().withMessage('Profession must be a string')
], validateRequest_1.validateRequest, aiController_1.calculateATSScore);
// Optimize for specific job
router.post('/optimize-for-job', [
    (0, express_validator_1.body)('cvData').notEmpty().withMessage('CV data is required'),
    (0, express_validator_1.body)('jobDescription').notEmpty().withMessage('Job description is required'),
    (0, express_validator_1.body)('profession').optional().isString().withMessage('Profession must be a string')
], validateRequest_1.validateRequest, aiController_1.optimizeForJob);
// Generate skill suggestions
router.post('/generate-skill-suggestions', [
    (0, express_validator_1.body)('profession').notEmpty().withMessage('Profession is required'),
    (0, express_validator_1.body)('experience').optional().isArray().withMessage('Experience must be an array')
], validateRequest_1.validateRequest, aiController_1.generateSkillSuggestions);
exports.default = router;
//# sourceMappingURL=ai.js.map