import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, User, Mail, Lock, Eye, EyeOff, Camera, Save, Shield, BarChart3
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCV } from '../../context/CVContext';
import toast from 'react-hot-toast';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { state: authState, updateProfile, changePassword } = useAuth();
  const { state: cvState } = useCV();

  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: authState.user?.name || '',
    profession: authState.user?.profession || ''
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const professions = [
    'Software Engineer', 'Data Scientist', 'Product Manager', 'Designer',
    'Marketing Manager', 'Sales Representative', 'Consultant', 'Analyst',
    'Manager', 'Director', 'Teacher', 'Nurse', 'Doctor', 'Lawyer',
    'Accountant', 'Engineer', 'Researcher', 'Writer', 'Other'
  ];

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      toast.error('Name is required');
      return;
    }
    setIsLoading(true);
    try {
      await updateProfile({
        name: profileForm.name.trim(),
        profession: profileForm.profession
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error('All password fields are required');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed successfully!');
    } catch (error) {
      console.error('Password change error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string, form: 'profile' | 'password') => {
    if (form === 'profile') {
      setProfileForm(prev => ({ ...prev, [field]: value }));
    } else {
      setPasswordForm(prev => ({ ...prev, [field]: value }));
    }
  };

  // Calculate statistics
  const stats = {
    cvsCreated: cvState.savedCVs.length,
    totalDownloads: cvState.savedCVs.reduce((acc, cv) => acc + cv.downloadCount, 0),
    sharedCVs: cvState.savedCVs.filter(cv => cv.isPublic).length,
    avgATSScore: cvState.savedCVs.length > 0
      ? Math.round(cvState.savedCVs.reduce((acc, cv) => acc + cv.atsScore, 0) / cvState.savedCVs.length)
      : 0
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4 py-6">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden z-[100000]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Profile Settings</h2>
                    <p className="text-blue-100">Manage your account and preferences</p>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Close modal"
                  title="Close modal"
                  onClick={onClose}
                  className="text-white hover:text-blue-100 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="flex">
              {/* Sidebar */}
              <div className="w-64 bg-gray-50 p-6">
                <nav className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'profile'
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <User className="h-5 w-5 mr-3" />
                    Profile Information
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('security')}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'security'
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Shield className="h-5 w-5 mr-3" />
                    Security
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('stats')}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'stats'
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <BarChart3 className="h-5 w-5 mr-3" />
                    Statistics
                  </button>
                </nav>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
                      
                      {/* Profile Picture */}
                      <div className="flex items-center space-x-6 mb-6">
                        <div className="relative">
                          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                            <User className="h-10 w-10 text-white" />
                          </div>
                          <button 
                            aria-label='upload profile picture'
                            className="absolute -bottom-1 -right-1 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                            <Camera className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{authState.user?.name}</h4>
                          <p className="text-sm text-gray-600">{authState.user?.profession || 'Professional'}</p>
                          <button className="text-sm text-blue-600 hover:text-blue-700 mt-1">
                            Change Profile Picture
                          </button>
                        </div>
                      </div>

                      <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Full Name
                            </label>
                            <input
                              type="text"
                              name='name'
                              value={profileForm.name}
                              onChange={(e) => handleInputChange('name', e.target.value, 'profile')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              required
                              placeholder="Enter your full name"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email Address
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <input
                                type="email"
                                value={authState.user?.email || ''}
                                disabled
                                aria-label="Email address"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Email cannot be changed for security reasons</p>
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Profession
                            </label>
                            <select
                              name="profession"
                              aria-label="Profession"
                              value={profileForm.profession}
                              onChange={(e) => handleInputChange('profession', e.target.value, 'profile')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Select your profession</option>
                              {professions.map(profession => (
                                <option key={profession} value={profession}>{profession}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            {isLoading ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
                      
                      <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                              type={showCurrentPassword ? 'text' : 'password'}
                              value={passwordForm.currentPassword}
                              onChange={(e) => handleInputChange('currentPassword', e.target.value, 'password')}
                              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter current password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                              type={showNewPassword ? 'text' : 'password'}
                              value={passwordForm.newPassword}
                              onChange={(e) => handleInputChange('newPassword', e.target.value, 'password')}
                              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={passwordForm.confirmPassword}
                              onChange={(e) => handleInputChange('confirmPassword', e.target.value, 'password')}
                              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Confirm new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            {isLoading ? 'Changing...' : 'Change Password'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Statistics Tab */}
                {activeTab === 'stats' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-blue-600">CVs Created</p>
                              <p className="text-2xl font-bold text-blue-900">{stats.cvsCreated}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                              <User className="h-6 w-6 text-blue-600" />
                            </div>
                          </div>
                        </div>

                        <div className="bg-green-50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-green-600">Total Downloads</p>
                              <p className="text-2xl font-bold text-green-900">{stats.totalDownloads}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                              <BarChart3 className="h-6 w-6 text-green-600" />
                            </div>
                          </div>
                        </div>

                        <div className="bg-purple-50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-purple-600">Shared CVs</p>
                              <p className="text-2xl font-bold text-purple-900">{stats.sharedCVs}</p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-lg">
                              <Mail className="h-6 w-6 text-purple-600" />
                            </div>
                          </div>
                        </div>

                        <div className="bg-orange-50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-orange-600">Avg ATS Score</p>
                              <p className="text-2xl font-bold text-orange-900">{stats.avgATSScore}%</p>
                            </div>
                            <div className="p-3 bg-orange-100 rounded-lg">
                              <Shield className="h-6 w-6 text-orange-600" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 bg-gray-50 rounded-lg p-6">
                        <h4 className="font-medium text-gray-900 mb-4">Account Activity</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Account Created</span>
                            <span className="text-sm font-medium text-gray-900">
                              {new Date(authState.user?.createdAt || Date.now()).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Last Login</span>
                            <span className="text-sm font-medium text-gray-900">Today</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Profile Completion</span>
                            <span className="text-sm font-medium text-green-600">
                              {authState.user?.profession ? '100%' : '80%'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ProfileModal;
