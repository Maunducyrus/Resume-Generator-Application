import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Star, ArrowRight, Check } from 'lucide-react';
import { useCV } from '../../context/CVContext';
import { useAuth } from '../../context/AuthContext';
import { templates, templateCategories, getTemplatesByCategory, getTemplatesByProfession } from '../../data/templates';
import type { Template } from '../../types';

interface TemplateGalleryProps {
  onViewChange: (view: string) => void;
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onViewChange }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { setSelectedTemplate, state: cvState } = useCV();
  const { state: authState } = useAuth();

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.professions.some(prof => prof.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const recommendedTemplates = authState.user?.profession 
    ? getTemplatesByProfession(authState.user.profession)
    : [];

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    onViewChange('builder');
  };

  const TemplateCard: React.FC<{ template: Template; index: number }> = ({ template, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group"
    >
      <div className="relative">
        <img
          src={template.preview}
          alt={template.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
        {template.isPremium && (
          <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <Star className="h-3 w-3 mr-1" />
            Premium
          </div>
        )}
        {cvState.selectedTemplate === template.id && (
          <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <Check className="h-3 w-3 mr-1" />
            Selected
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
            <span className="text-sm text-blue-600 font-medium">{template.category}</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{template.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {template.features.slice(0, 3).map((feature, i) => (
            <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
              {feature}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            For: {template.professions.slice(0, 2).join(', ')}
            {template.professions.length > 2 && ` +${template.professions.length - 2} more`}
          </div>
          <button
            onClick={() => handleSelectTemplate(template.id)}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
          >
            Use Template
            <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Perfect Template
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select from our collection of professional, ATS-optimized templates designed for different industries and career levels.
            </p>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Category Filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            {templateCategories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Recommended Templates */}
        {recommendedTemplates.length > 0 && authState.user?.profession && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Recommended for {authState.user.profession}s
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedTemplates.slice(0, 3).map((template, index) => (
                <TemplateCard key={template.id} template={template} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* All Templates */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory === 'All' ? 'All Templates' : `${selectedCategory} Templates`}
            </h2>
            <span className="text-gray-600">
              {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
            </span>
          </div>

          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template, index) => (
                <TemplateCard key={template.id} template={template} index={index} />
              ))}
            </div>
          )}
        </div>

        {/* Template Categories Overview */}
        <div className="mt-16 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Template Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templateCategories.slice(1).map(category => {
              const categoryTemplates = getTemplatesByCategory(category);
              return (
                <div key={category} className="text-center">
                  <div className="bg-blue-100 rounded-lg p-4 mb-3">
                    <h3 className="font-semibold text-gray-900">{category}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {categoryTemplates.length} template{categoryTemplates.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">
                    {category === 'Professional' && 'Clean, corporate designs for traditional industries'}
                    {category === 'Creative' && 'Bold, artistic layouts for creative professionals'}
                    {category === 'Tech' && 'Modern designs optimized for tech roles'}
                    {category === 'Minimal' && 'Simple, elegant templates with focus on content'}
                    {category === 'Academic' && 'Traditional formats for academic positions'}
                    {category === 'Healthcare' && 'Professional designs for medical professionals'}
                    {category === 'Sales' && 'Results-focused templates for sales roles'}
                    {category === 'Marketing' && 'Creative templates for marketing professionals'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateGallery;