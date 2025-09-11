import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, FileText, Eye, Download, Share2, Trash2, Edit3, Star, ExternalLink } from 'lucide-react';
import { useCV } from '../../context/CVContext';
import { useAuth } from '../../context/AuthContext';
import CVPreview from '../CVBuilder/CVPreview';
import type { CV } from '../../types';
import toast from 'react-hot-toast';

interface DashboardProps {
  onViewChange: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  const { state: cvState, loadUserCVs, deleteCV, setCurrentCV, setSelectedTemplate, setCurrentStep } = useCV();
  const { state: authState } = useAuth();
  const [selectedCV, setSelectedCV] = useState<CV | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    loadUserCVs();
  }, []);

  const handleDeleteCV = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this CV?')) {
      try {
        await deleteCV(id);
      } catch (error) {
        console.error('Failed to delete CV:', error);
      }
    }
  };

  const handleEditCV = (cv: CV) => {
    setCurrentCV(cv.data);
    setSelectedTemplate(cv.templateId);
    setCurrentStep(1);
    onViewChange('builder');
  };

  const handlePreviewCV = (cv: CV) => {
    setSelectedCV(cv);
    setShowPreview(true);
  };

  const handleShareCV = async (cv: CV) => {
    const shareUrl = `${window.location.origin}/shared/${cv.shareUrl}`;
    await navigator.clipboard.writeText(shareUrl);
    toast.success('Share link copied to clipboard!');
  };

  const stats = [
    {
      label: 'Total CVs',
      value: cvState.savedCVs.length,
      icon: <FileText className="h-6 w-6 text-blue-600" />,
      color: 'bg-blue-100'
    },
    {
      label: 'Average ATS Score',
      value: cvState.savedCVs.length > 0 
        ? Math.round(cvState.savedCVs.reduce((acc, cv) => acc + cv.atsScore, 0) / cvState.savedCVs.length)
        : 0,
      icon: <Star className="h-6 w-6 text-green-600" />,
      color: 'bg-green-100'
    },
    {
      label: 'Downloads',
      value: cvState.savedCVs.reduce((acc, cv) => acc + cv.downloadCount, 0),
      icon: <Download className="h-6 w-6 text-purple-600" />,
      color: 'bg-purple-100'
    },
    {
      label: 'Shared CVs',
      value: cvState.savedCVs.filter(cv => cv.isPublic).length,
      icon: <Share2 className="h-6 w-6 text-orange-600" />,
      color: 'bg-orange-100'
    }
  ];

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {authState.user?.name}! 👋
            </h1>
            <p className="text-gray-600">
              Manage your CVs, track performance, and create new professional resumes.
            </p>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onClick={() => onViewChange('builder')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-6 rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="h-8 w-8 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Create New CV</h3>
            <p className="text-blue-100">Start building a new professional CV with AI assistance</p>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onClick={() => onViewChange('templates')}
            className="bg-white hover:bg-gray-50 border border-gray-200 p-6 rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            <FileText className="h-8 w-8 text-gray-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Templates</h3>
            <p className="text-gray-600">Explore our collection of professional CV templates</p>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onClick={() => onViewChange('ai-tools')}
            className="bg-white hover:bg-gray-50 border border-gray-200 p-6 rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            <Star className="h-8 w-8 text-yellow-500 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Tools</h3>
            <p className="text-gray-600">Access powerful AI features for CV optimization</p>
          </motion.button>
        </div>

        {/* Recent CVs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Your CVs</h2>
              <button
                onClick={() => onViewChange('builder')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                New CV
              </button>
            </div>
          </div>

          <div className="p-6">
            {cvState.isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : cvState.savedCVs.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No CVs yet</h3>
                <p className="text-gray-600 mb-6">Create your first professional CV to get started</p>
                <button
                  onClick={() => onViewChange('builder')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Create Your First CV
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cvState.savedCVs.map((cv, index) => (
                  <motion.div
                    key={cv.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{cv.name}</h3>
                        <p className="text-sm text-gray-600">{cv.profession || 'Professional'}</p>
                        <div className="flex items-center mt-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-sm text-gray-600">ATS: {cv.atsScore}%</span>
                          </div>
                          {cv.isPublic && (
                            <div className="ml-3 flex items-center">
                              <Share2 className="h-4 w-4 text-green-500 mr-1" />
                              <span className="text-sm text-green-600">Public</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Updated {new Date(cv.updatedAt).toLocaleDateString()}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            handlePreviewCV(cv);
                          }}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Preview"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            handleEditCV(cv);
                          }}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleShareCV(cv)}
                          className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Share"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCV(cv.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CV Preview Modal */}
      {showPreview && selectedCV && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">CV Preview - {selectedCV.name}</h3>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="p-6">
                <CVPreview cvData={selectedCV.data} templateId={selectedCV.templateId} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;