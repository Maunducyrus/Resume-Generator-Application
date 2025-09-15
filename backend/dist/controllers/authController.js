"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile =
  exports.getProfile =
  exports.login =
  exports.register =
    void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const logger_1 = require("../utils/logger");
const generateToken = (userId) => {
  return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
const register = async (req, res) => {
  try {
    const { name, email, password, profession } = req.body;
    // Check if user already exists
    const existingUser = await User_1.default.findOne({
      where: { email: email.toLowerCase() },
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }
    // Create new user
    const user = await User_1.default.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      profession: profession?.trim(),
    });
    // Generate token
    const token = generateToken(user.id);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    logger_1.logger.error("Registration Error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};
exports.register = register;
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find user
    const user = await User_1.default.findOne({
      where: { email: email.toLowerCase() },
    });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    // Generate token
    const token = generateToken(user.id);
    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    logger_1.logger.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};
exports.login = login;
const getProfile = async (req, res) => {
  try {
    const user = await User_1.default.findByPk(req.user?.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.json({
      success: true,
      data: {
        user: user.toJSON(),
      },
    });
  } catch (error) {
    logger_1.logger.error("Get Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get profile",
    });
  }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
  try {
    const { name, profession } = req.body;
    const user = await User_1.default.findByPk(req.user?.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (name) user.name = name.trim();
    if (profession) user.profession = profession.trim();
    await user.save();
    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: user.toJSON(),
      },
    });
  } catch (error) {
    logger_1.logger.error("Update Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};
exports.updateProfile = updateProfile;
//# sourceMappingURL=authController.js.map
