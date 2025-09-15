"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const validateRequest_1 = require("../middleware/validateRequest");
const router = express_1.default.Router();
// Registration validation
const registerValidation = [
  (0, express_validator_1.body)("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  (0, express_validator_1.body)("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  (0, express_validator_1.body)("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  (0, express_validator_1.body)("profession")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Profession cannot exceed 100 characters"),
];
// Login validation
const loginValidation = [
  (0, express_validator_1.body)("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  (0, express_validator_1.body)("password")
    .notEmpty()
    .withMessage("Password is required"),
];
// Routes
router.post(
  "/register",
  registerValidation,
  validateRequest_1.validateRequest,
  authController_1.register,
);
router.post(
  "/login",
  loginValidation,
  validateRequest_1.validateRequest,
  authController_1.login,
);
router.get("/profile", auth_1.auth, authController_1.getProfile);
router.put("/profile", auth_1.auth, authController_1.updateProfile);
exports.default = router;
//# sourceMappingURL=auth.js.map
