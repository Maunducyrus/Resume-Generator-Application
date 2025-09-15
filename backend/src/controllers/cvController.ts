import { Request, Response } from "express";
import CV from "../models/CV";
import User from "../models/User";
import { logger } from "../utils/logger";
import { v4 as uuidv4 } from "uuid";
import { Op } from "sequelize";

export const createCV = async (req: Request, res: Response) => {
  try {
    const { name, templateId, data, profession } = req.body;

    const cv = await CV.create({
      userId: req.user?.userId,
      name: name.trim(),
      templateId,
      data,
      profession: profession?.trim(),
      shareUrl: uuidv4(),
    });

    res.status(201).json({
      success: true,
      message: "CV created successfully",
      data: { cv },
    });
  } catch (error) {
    logger.error("Create CV Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create CV",
    });
  }
};

export const getUserCVs = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, profession, templateId } = req.query;

    const where: any = { userId: req.user?.userId };
    if (profession) where.profession = profession;
    if (templateId) where.templateId = templateId;

    const offset = (Number(page) - 1) * Number(limit);

    const { rows: cvs, count: total } = await CV.findAndCountAll({
      where,
      order: [["updatedAt", "DESC"]],
      limit: Number(limit),
      offset,
      include: [
        {
          model: User,
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
    logger.error("Get User CVs Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get CVs",
    });
  }
};

export const getCVById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const cv = await CV.findOne({
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
    logger.error("Get CV Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get CV",
    });
  }
};

export const updateCV = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, templateId, data, profession, atsScore } = req.body;

    const cv = await CV.findOne({
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
    logger.error("Update CV Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update CV",
    });
  }
};

export const deleteCV = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const cv = await CV.findOne({
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
    logger.error("Delete CV Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete CV",
    });
  }
};

export const shareCV = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isPublic } = req.body;

    const cv = await CV.findOne({
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
      cv.shareUrl = uuidv4();
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
    logger.error("Share CV Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update sharing settings",
    });
  }
};

export const getSharedCV = async (req: Request, res: Response) => {
  try {
    const { shareUrl } = req.params;

    const cv = await CV.findOne({
      where: {
        shareUrl,
        isPublic: true,
      },
      include: [
        {
          model: User,
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
    logger.error("Get Shared CV Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get shared CV",
    });
  }
};
