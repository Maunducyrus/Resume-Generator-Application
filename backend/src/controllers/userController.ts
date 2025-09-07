import { Request, Response } from 'express';
import User from '../models/User';
import { logger } from '../utils/logger';

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.user?.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: user.toJSON()
      }
    });
  } catch (error) {
    logger.error('Get User Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile'
    });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { name, profession } = req.body;
    
    const user = await User.findByPk(req.user?.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (name) user.name = name.trim();
    if (profession) user.profession = profession.trim();
    
    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.toJSON()
      }
    });
  } catch (error) {
    logger.error('Update User Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user profile'
    });
  }
};