"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSharedCV =
  exports.shareCV =
  exports.deleteCV =
  exports.updateCV =
  exports.getCVById =
  exports.getUserCVs =
  exports.createCV =
    void 0;
const CV_1 = __importDefault(require("../models/CV"));
const User_1 = __importDefault(require("../models/User"));
const logger_1 = require("../utils/logger");
const uuid_1 = require("uuid");
const createCV = async (req, res) => {
  try {
    const { name, templateId, data, profession } = req.body;
    const cv = await CV_1.default.create({
      userId: req.user?.userId,
      name: name.trim(),
      templateId,
      data,
      profession: profession?.trim(),
      shareUrl: (0, uuid_1.v4)(),
    });
    res.status(201).json({
      success: true,
      message: "CV created successfully",
      data: { cv },
    });
  } catch (error) {
    logger_1.logger.error("Create CV Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create CV",
    });
  }
};
exports.createCV = createCV;
const getUserCVs = async (req, res) => {
  try {
    const { page = 1, limit = 10, profession, templateId } = req.query;
    const where = { userId: req.user?.userId };
    if (profession) where.profession = profession;
    if (templateId) where.templateId = templateId;
    const offset = (Number(page) - 1) * Number(limit);
    const { rows: cvs, count: total } = await CV_1.default.findAndCountAll({
      where,
      order: [["updatedAt", "DESC"]],
      limit: Number(limit),
      offset,
      include: [
        {
          model: User_1.default,
          attributes: ["name", "email"],
        },
      ],
    });
    res.json({
      success: true,
      data: {
        cvs,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    logger_1.logger.error("Get User CVs Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get CVs",
    });
  }
};
exports.getUserCVs = getUserCVs;
const getCVById = async (req, res) => {
  try {
    const { id } = req.params;
    const cv = await CV_1.default.findOne({
      where: {
        id,
        userId: req.user?.userId,
      },
    });
    if (!cv) {
      return res.status(404).json({
        success: false,
        message: "CV not found",
      });
    }
    res.json({
      success: true,
      data: { cv },
    });
  } catch (error) {
    logger_1.logger.error("Get CV Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get CV",
    });
  }
};
exports.getCVById = getCVById;
const updateCV = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, templateId, data, profession, atsScore } = req.body;
    const cv = await CV_1.default.findOne({
      where: {
        id,
        userId: req.user?.userId,
      },
    });
    if (!cv) {
      return res.status(404).json({
        success: false,
        message: "CV not found",
      });
    }
    if (name) cv.name = name.trim();
    if (templateId) cv.templateId = templateId;
    if (data) cv.data = data;
    if (profession) cv.profession = profession.trim();
    if (atsScore !== undefined) cv.atsScore = atsScore;
    await cv.save();
    res.json({
      success: true,
      message: "CV updated successfully",
      data: { cv },
    });
  } catch (error) {
    logger_1.logger.error("Update CV Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update CV",
    });
  }
};
exports.updateCV = updateCV;
const deleteCV = async (req, res) => {
  try {
    const { id } = req.params;
    const cv = await CV_1.default.findOne({
      where: {
        id,
        userId: req.user?.userId,
      },
    });
    if (!cv) {
      return res.status(404).json({
        success: false,
        message: "CV not found",
      });
    }
    await cv.destroy();
    res.json({
      success: true,
      message: "CV deleted successfully",
    });
  } catch (error) {
    logger_1.logger.error("Delete CV Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete CV",
    });
  }
};
exports.deleteCV = deleteCV;
const shareCV = async (req, res) => {
  try {
    const { id } = req.params;
    const { isPublic } = req.body;
    const cv = await CV_1.default.findOne({
      where: {
        id,
        userId: req.user?.userId,
      },
    });
    if (!cv) {
      return res.status(404).json({
        success: false,
        message: "CV not found",
      });
    }
    cv.isPublic = Boolean(isPublic);
    if (isPublic && !cv.shareUrl) {
      cv.shareUrl = (0, uuid_1.v4)();
    } else if (!isPublic) {
      cv.shareUrl = undefined;
    }
    await cv.save();
    res.json({
      success: true,
      message: `CV ${isPublic ? "shared" : "unshared"} successfully`,
      data: {
        shareUrl: cv.shareUrl,
        isPublic: cv.isPublic,
      },
    });
  } catch (error) {
    logger_1.logger.error("Share CV Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update sharing settings",
    });
  }
};
exports.shareCV = shareCV;
const getSharedCV = async (req, res) => {
  try {
    const { shareUrl } = req.params;
    const cv = await CV_1.default.findOne({
      where: {
        shareUrl,
        isPublic: true,
      },
      include: [
        {
          model: User_1.default,
          attributes: ["name"],
        },
      ],
    });
    if (!cv) {
      return res.status(404).json({
        success: false,
        message: "Shared CV not found",
      });
    }
    // Increment download count
    cv.downloadCount += 1;
    await cv.save();
    res.json({
      success: true,
      data: { cv },
    });
  } catch (error) {
    logger_1.logger.error("Get Shared CV Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get shared CV",
    });
  }
};
exports.getSharedCV = getSharedCV;
//# sourceMappingURL=cvController.js.map
