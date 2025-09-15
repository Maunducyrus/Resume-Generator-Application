"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const cvController_1 = require("../controllers/cvController");
const auth_1 = require("../middleware/auth");
const validateRequest_1 = require("../middleware/validateRequest");
const router = express_1.default.Router();
// Create CV validation
const createCVValidation = [
  (0, express_validator_1.body)("name")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("CV name must be between 1 and 200 characters"),
  (0, express_validator_1.body)("templateId")
    .notEmpty()
    .withMessage("Template ID is required"),
  (0, express_validator_1.body)("data")
    .notEmpty()
    .withMessage("CV data is required"),
  (0, express_validator_1.body)("profession")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Profession cannot exceed 100 characters"),
];
// Update CV validation
const updateCVValidation = [
  (0, express_validator_1.param)("id").isMongoId().withMessage("Invalid CV ID"),
  (0, express_validator_1.body)("name")
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("CV name must be between 1 and 200 characters"),
  (0, express_validator_1.body)("templateId")
    .optional()
    .notEmpty()
    .withMessage("Template ID cannot be empty"),
  (0, express_validator_1.body)("atsScore")
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage("ATS score must be between 0 and 100"),
];
// Routes
router.post(
  "/",
  auth_1.auth,
  createCVValidation,
  validateRequest_1.validateRequest,
  cvController_1.createCV,
);
router.get("/", auth_1.auth, cvController_1.getUserCVs);
router.get(
  "/:id",
  auth_1.auth,
  [(0, express_validator_1.param)("id").isMongoId()],
  validateRequest_1.validateRequest,
  cvController_1.getCVById,
);
router.put(
  "/:id",
  auth_1.auth,
  updateCVValidation,
  validateRequest_1.validateRequest,
  cvController_1.updateCV,
);
router.delete(
  "/:id",
  auth_1.auth,
  [(0, express_validator_1.param)("id").isMongoId()],
  validateRequest_1.validateRequest,
  cvController_1.deleteCV,
);
router.put(
  "/:id/share",
  auth_1.auth,
  [
    (0, express_validator_1.param)("id")
      .isMongoId()
      .withMessage("Invalid CV ID"),
    (0, express_validator_1.body)("isPublic")
      .isBoolean()
      .withMessage("isPublic must be a boolean"),
  ],
  validateRequest_1.validateRequest,
  cvController_1.shareCV,
);
// Public route for shared CVs
router.get("/shared/:shareUrl", cvController_1.getSharedCV);
exports.default = router;
//# sourceMappingURL=cv.js.map
