import React, { useState } from 'react';
import { Plus, Trash2, Briefcase, Sparkles } from 'lucide-react';
import { useCV } from '../../../context/CVContext';
import { useAuth } from '../../../context/AuthContext';
import { aiAPI } from '../../../services/api';
import type { WorkExperience } from '../../../types';
import toast from 'react-hot-toast';

const ExperienceStep: React.FC = () => {
  const { state: cvState, setCurrentCV } = useCV();
  const { state: authState } = useAuth();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [optimizingIndex, setOptimizingIndex] = useState<number | null>(null);

  const workExperience = cvState.currentCV?.workExperience || [];

  const addExperience = () => {
    const newExperience: WorkExperience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      location: '',
      responsibilities: [''],
      achievements: []
    };

    const updatedCV = {
      ...cvState.currentCV,
      workExperience: [...workExperience, newExperience]
    };
    setCurrentCV(updatedCV as any);
    setEditingIndex(workExperience.length);
  };

  const updateExperience = (index: number, field: keyof WorkExperience, value: any) => {
    const updatedExperience = workExperience.map((exp, i) => 
      i === index ? { ...exp, [field]: value } : exp
    );
    
    const updatedCV = {
      ...cvState.currentCV,
      workExperience: updatedExperience
    };
    setCurrentCV(updatedCV as any);
  };

  const removeExperience = (index: number) => {
    const updatedExperience = workExperience.filter((_, i) => i !== index);
    const updatedCV = {
      ...cvState.currentCV,
      workExperience: updatedExperience
    };
    setCurrentCV(updatedCV as any);
    setEditingIndex(null);
  };

  const addResponsibility = (expIndex: number) => {
    const experience = workExperience[expIndex];
    updateExperience(expIndex, 'responsibilities', [...experience.responsibilities, '']);
  };

  const updateResponsibility = (expIndex: number, respIndex: number, value: string) => {
    const experience = workExperience[expIndex];
    const updatedResponsibilities = experience.responsibilities.map((resp, i) => 
      i === respIndex ? value : resp
    );
    updateExperience(expIndex, 'responsibilities', updatedResponsibilities);
  };

  const removeResponsibility = (expIndex: number, respIndex: number) => {
    const experience = workExperience[expIndex];
    const updatedResponsibilities = experience.responsibilities.filter((_, i) => i !== respIndex);
    updateExperience(expIndex, 'responsibilities', updatedResponsibilities);
  };

  const optimizeExperience = async (index: number) => {
    const experience = workExperience[index];
    if (!experience.company || !experience.position) {
      toast.error('Please fill in company and position first');
      return;
    }

    setOptimizingIndex(index);
    try {
      const optimized = await aiAPI.optimizeExperience({
        experience,
        profession: authState.user?.profession || 'Professional'
      });

      updateExperience(index, 'responsibilities', optimized.responsibilities || experience.responsibilities);
      updateExperience(index, 'achievements', optimized.achievements || []);
      
      toast.success('Experience optimized with AI!');
    } catch (error) {
      toast.error('Failed to optimize experience');
    } finally {
      setOptimizingIndex(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Experience</h3>
        <p className="text-gray-600 mb-6">
          Add your professional work experience, including internships and relevant positions.
        </p>
      </div>

      <div className="space-y-4">
        {workExperience.map((exp, index) => (
          <div key={exp.id} className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 text-blue-600 mr-2" />
                <h4 className="font-medium text-gray-900">
                  {exp.position || 'New Experience Entry'}
                </h4>
              </div>
              <div className="flex items-center space-x-2">
                {exp.company && exp.position && (
                  <button
                    onClick={() => optimizeExperience(index)}
                    disabled={optimizingIndex === index}
                    className="flex items-center text-purple-600 hover:text-purple-700 text-sm font-medium disabled:opacity-50"
                  >
                    <Sparkles className="h-4 w-4 mr-1" />
                    {optimizingIndex === index ? 'Optimizing...' : 'AI Optimize'}
                  </button>
                )}
                <button
                  onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  {editingIndex === index ? 'Collapse' : 'Edit'}
                </button>
                <button
                  onClick={() => removeExperience(index)}
                  className="text-red-600 hover:text-red-700"
                  title="Remove Experience "
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {editingIndex === index && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company *
                    </label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Google Inc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position *
                    </label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => updateExperience(index, 'position', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Software Engineer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) => updateExperience(index, 'location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="San Francisco, CA"
                    />
                  </div>

                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="month"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div> */}
                  <div>
                    <label 
                      htmlFor={`exp-startDate-${index}`} 
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Start Date
                    </label>
                    <input
                      id={`exp-startDate-${index}`}
                      type="month"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      aria-label="Experience start date"
                    />
                  </div>                  

                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="month"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                      disabled={exp.current}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div> */}
                  <div>
                    <label 
                      htmlFor={`exp-endDate-${index}`} 
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      End Date
                    </label>
                    <input
                      id={`exp-endDate-${index}`}
                      type="month"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                      disabled={exp.current}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      aria-label="Experience end date"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`current-${index}`}
                      checked={exp.current}
                      onChange={(e) => {
                        updateExperience(index, 'current', e.target.checked);
                        if (e.target.checked) {
                          updateExperience(index, 'endDate', '');
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`current-${index}`} className="ml-2 text-sm text-gray-700">
                      I currently work here
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Responsibilities & Achievements
                  </label>
                  {exp.responsibilities.map((resp, respIndex) => (
                    <div key={respIndex} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={resp}
                        onChange={(e) => updateResponsibility(index, respIndex, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Describe your responsibility or achievement..."
                      />
                      {exp.responsibilities.length > 1 && (
                        <button
                          onClick={() => removeResponsibility(index, respIndex)}
                          className="text-red-600 hover:text-red-700"
                          title="Remove Responsibility"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addResponsibility(index)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    + Add Responsibility
                  </button>
                </div>

                {exp.achievements && exp.achievements.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      AI-Generated Achievements
                    </label>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      {exp.achievements.map((achievement, achIndex) => (
                        <div key={achIndex} className="flex items-start space-x-2 mb-1 last:mb-0">
                          <span className="text-green-600 mt-1">•</span>
                          <span className="text-green-800 text-sm">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {editingIndex !== index && exp.company && (
              <div className="text-sm text-gray-600">
                <p className="font-medium">{exp.position}</p>
                <p>{exp.company} • {exp.location}</p>
                {exp.startDate && (
                  <p>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                )}
                {exp.responsibilities.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {exp.responsibilities.slice(0, 2).map((resp, i) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                    {exp.responsibilities.length > 2 && (
                      <li className="text-gray-500">
                        +{exp.responsibilities.length - 2} more responsibilities
                      </li>
                    )}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}

        <button
          onClick={addExperience}
          className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Work Experience
        </button>
      </div>
    </div>
  );
};

export default ExperienceStep;