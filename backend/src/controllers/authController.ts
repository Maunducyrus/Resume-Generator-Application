// import { Request, Response } from 'express';
// import jwt from 'jsonwebtoken';
// import User from '../models/User';
// import { logger } from '../utils/logger';

// const generateToken = (userId: string) => {
//   return jwt.sign({ userId }, process.env.JWT_SECRET!, {
//     expiresIn: '7d'
//   });
// };

// export const register = async (req: Request, res: Response) => {
//   try {
//     const { name, email, password, profession } = req.body;

//     // Check if user already exists
//     const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: 'User already exists with this email'
//       });
//     }

//     // Create new user
//     const user = await User.create({
//       name: name.trim(),
//       email: email.toLowerCase(),
//       password,
//       profession: profession?.trim()
//     });

//     // Generate token
//     const token = generateToken(user.id);

//     res.status(201).json({
//       success: true,
//       message: 'User registered successfully',
//       data: {
//         user: user.toJSON(),
//         token
//       }
//     });
//   } catch (error) {
//     logger.error('Registration Error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Registration failed'
//     });
//   }
// };

// export const login = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;

//     // Find user
//     const user = await User.findOne({ where: { email: email.toLowerCase() } });
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid email or password'
//       });
//     }

//     // Check password
//     const isPasswordValid = await user.comparePassword(password);
//     if (!isPasswordValid) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid email or password'
//       });
//     }

//     // Generate token
//     const token = generateToken(user.id);

//     res.json({
//       success: true,
//       message: 'Login successful',
//       data: {
//         user: user.toJSON(),
//         token
//       }
//     });
//   } catch (error) {
//     logger.error('Login Error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Login failed'
//     });
//   }
// };

// export const getProfile = async (req: Request, res: Response) => {
//   try {
//     const user = await User.findByPk(req.user?.userId);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     res.json({
//       success: true,
//       data: {
//         user: user.toJSON()
//       }
//     });
//   } catch (error) {
//     logger.error('Get Profile Error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to get profile'
//     });
//   }
// };

// export const updateProfile = async (req: Request, res: Response) => {
//   try {
//     const { name, profession } = req.body;
    
//     const user = await User.findByPk(req.user?.userId);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     if (name) user.name = name.trim();
//     if (profession) user.profession = profession.trim();
    
//     await user.save();

//     res.json({
//       success: true,
//       message: 'Profile updated successfully',
//       data: {
//         user: user.toJSON()
//       }
//     });
//   } catch (error) {
//     logger.error('Update Profile Error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update profile'
//     });
//   }
// };


import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { logger } from '../utils/logger';

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: '7d'
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, profession } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create new user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      profession: profession?.trim()
    });

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    logger.error('Registration Error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    logger.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
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
    logger.error('Get Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile'
    });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
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
    logger.error('Update Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findByPk(req.user?.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password and update
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    logger.error('Change Password Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
};