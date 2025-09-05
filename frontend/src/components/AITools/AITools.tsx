import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, FileText, MessageSquare, HelpCircle, Target, Lightbulb, Star, Copy, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCV } from '../../context/CVContext';
import { aiAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AITools: React.FC = () => {
  const { state: authState } = useAuth();
  const { state: cvState } = useCV();
  const [activeTab, setActiveTab] = useState('summary');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{ [key: string]: any }>({});

  const tools = [
    {
      id: 'summary',
      title: 'Professional Summary',
      description: 'Generate a compelling professional summary based on your experience',
      icon: FileText,
      color: 'blue'
    },
    {
      id: 'cover-letter',
      title: 'Cover Letter Generator',
      description: 'Create personalized cover letters for specific job applications',
      icon: MessageSquare,
      color: 'green'
    },
    {
      id: 'interview',
      title: 'Interview Questions',
      description: 'Get profession-specific interview questions to prepare',
      icon: HelpCircle,
      color: 'purple'
    },
    {
      id: 'ats-score',
      title: 'ATS Score Checker',
      description: 'Analyze your CV for ATS compatibility and get improvement suggestions',
      icon: Target,
      color: 'orange'
    },
    {
      id: 'job-optimize',
      title: 'Job Optimization',
      description: 'Optimize your CV for specific job descriptions',
      icon: Lightbulb,
      color: 'pink'
    },
    {
      id: 'skills',
      title: 'Skill Suggestions',
      description: 'Get AI-powered skill recommendations for your profession',
      icon: Star,
      color: 'indigo'
    }
  ];

  const generateSummary = async () => {
    if (!cvState.currentCV?.personalInfo || !cvState.currentCV?.workExperience.length) {
      toast.error('Please complete your personal info and work experience first');
      return;
    }

    setIsLoading(true);
    try {
      const summary = await aiAPI.generateSummary({
        personalInfo: cvState.currentCV.personalInfo,
        workExperience: cvState.currentCV.workExperience,
        profession: authState.user?.profession || 'Professional'
      });
      setResults({ ...results, summary });
      toast.success('Professional summary generated!');
    } catch (error) {
      toast.error('Failed to generate summary');
    } finally {
      setIsLoading(false);
    }
  };

  const generateCoverLetter = async (jobDescription: string) => {
    if (!cvState.currentCV || !jobDescription.trim()) {
      toast.error('Please provide a job description and complete your CV');
      return;
    }

    setIsLoading(true);
    try {
      const coverLetter = await aiAPI.generateCoverLetter({
        cvData: cvState.currentCV,
        jobDescription,
        profession: authState.user?.profession || 'Professional'
      });
      setResults({ ...results, coverLetter });
      toast.success('Cover letter generated!');
    } catch (error) {
      toast.error('Failed to generate cover letter');
    } finally {
      setIsLoading(false);
    }
  };

  const generateInterviewQuestions = async () => {
    if (!authState.user?.profession) {
      toast.error('Please set your profession in your profile');
      return;
    }

    setIsLoading(true);
    try {
      const questions = await aiAPI.generateInterviewQuestions({
        profession: authState.user.profession,
        experienceLevel: 'Mid-level'
      });
      setResults({ ...results, questions });
      toast.success('Interview questions generated!');
    } catch (error) {
      toast.error('Failed to generate interview questions');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateATSScore = async () => {
    if (!cvState.currentCV) {
      toast.error('Please complete your CV first');
      return;
    }

    setIsLoading(true);
    try {
      const atsResult = await aiAPI.calculateATSScore({
        cvData: cvState.currentCV,
        profession: authState.user?.profession || 'Professional'
      });
      setResults({ ...results, atsResult });
      toast.success('ATS score calculated!');
    } catch (error) {
      toast.error('Failed to calculate ATS score');
    } finally {
      setIsLoading(false);
    }
  };

  const optimizeForJob = async (jobDescription: string) => {
    if (!cvState.currentCV || !jobDescription.trim()) {
      toast.error('Please provide a job description and complete your CV');
      return;
    }

    setIsLoading(true);
    try {
      const optimization = await aiAPI.optimizeForJob({
        cvData: cvState.currentCV,
        jobDescription,
        profession: authState.user?.profession || 'Professional'
      });
      setResults({ ...results, optimization });
      toast.success('Job optimization completed!');
    } catch (error) {
      toast.error('Failed to optimize for job');
    } finally {
      setIsLoading(false);
    }
  };

  const generateSkillSuggestions = async () => {
    if (!authState.user?.profession) {
      toast.error('Please set your profession in your profile');
      return;
    }

    setIsLoading(true);
    try {
      const skills = await aiAPI.generateSkillSuggestions({
        profession: authState.user.profession,
        experience: cvState.currentCV?.workExperience || []
      });
      setResults({ ...results, skills });
      toast.success('Skill suggestions generated!');
    } catch (error) {
      toast.error('Failed to generate skill suggestions');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      green: 'bg-green-100 text-green-600 border-green-200',
      purple: 'bg-purple-100 text-purple-600 border-purple-200',
      orange: 'bg-orange-100 text-orange-600 border-orange-200',
      pink: 'bg-pink-100 text-pink-600 border-pink-200',
      indigo: 'bg-indigo-100 text-indigo-600 border-indigo-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const renderToolContent = () => {
    switch (activeTab) {
      case 'summary':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Generate Professional Summary</h3>
              <p className="text-gray-600 mb-4">
                Create a compelling professional summary based on your work experience and skills.
              </p>
              <button
                onClick={generateSummary}
                disabled={isLoading}
                className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                {isLoading ? 'Generating...' : 'Generate Summary'}
              </button>
            </div>
            
            {results.summary && (
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Generated Summary</h4>
                  <button
                    onClick={() => copyToClipboard(results.summary)}
                    className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </button>
                </div>
                <p className="text-gray-700 leading-relaxed">{results.summary}</p>
              </div>
            )}
          </div>
        );

      case 'cover-letter':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Generate Cover Letter</h3>
              <p className="text-gray-600 mb-4">
                Create a personalized cover letter for a specific job application.
              </p>
              <textarea
                placeholder="Paste the job description here..."
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                onChange={(e) => {
                  const jobDescription = e.target.value;
                  if (jobDescription.length > 100) {
                    generateCoverLetter(jobDescription);
                  }
                }}
              />
            </div>
            
            {results.coverLetter && (
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Generated Cover Letter</h4>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => copyToClipboard(results.coverLetter)}
                      className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </button>
                    <button
                      onClick={() => {
                        const blob = new Blob([results.coverLetter], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'cover-letter.txt';
                        a.click();
                      }}
                      className="flex items-center text-green-600 hover:text-green-700 text-sm"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </button>
                  </div>
                </div>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {results.coverLetter}
                </div>
              </div>
            )}
          </div>
        );

      case 'interview':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Interview Questions</h3>
              <p className="text-gray-600 mb-4">
                Get profession-specific interview questions to help you prepare.
              </p>
              <button
                onClick={generateInterviewQuestions}
                disabled={isLoading}
                className="flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
              >
                <HelpCircle className="h-5 w-5 mr-2" />
                {isLoading ? 'Generating...' : 'Generate Questions'}
              </button>
            </div>
            
            {results.questions && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">Interview Questions for {authState.user?.profession}</h4>
                <div className="space-y-3">
                  {results.questions.map((question: string, index: number) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start">
                        <span className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                          {index + 1}
                        </span>
                        <p className="text-gray-700 flex-1">{question}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'ats-score':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">ATS Score Analysis</h3>
              <p className="text-gray-600 mb-4">
                Analyze your CV for Applicant Tracking System compatibility.
              </p>
              <button
                onClick={calculateATSScore}
                disabled={isLoading}
                className="flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
              >
                <Target className="h-5 w-5 mr-2" />
                {isLoading ? 'Analyzing...' : 'Calculate ATS Score'}
              </button>
            </div>
            
            {results.atsResult && (
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="text-center mb-6">
                  <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center ${
                    results.atsResult.score >= 80 ? 'bg-green-100' :
                    results.atsResult.score >= 60 ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${
                        results.atsResult.score >= 80 ? 'text-green-600' :
                        results.atsResult.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {results.atsResult.score}
                      </div>
                      <div className="text-xs text-gray-600">ATS Score</div>
                    </div>
                  </div>
                </div>
                
                {results.atsResult.suggestions.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Improvement Suggestions</h4>
                    <ul className="space-y-2">
                      {results.atsResult.suggestions.map((suggestion: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'job-optimize':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Job-Specific Optimization</h3>
              <p className="text-gray-600 mb-4">
                Optimize your CV for a specific job posting to increase your chances.
              </p>
              <textarea
                placeholder="Paste the job description you want to optimize for..."
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                onChange={(e) => {
                  const jobDescription = e.target.value;
                  if (jobDescription.length > 100) {
                    optimizeForJob(jobDescription);
                  }
                }}
              />
            </div>
            
            {results.optimization && (
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h4 className="font-medium text-gray-900">Optimization Results</h4>
                
                {results.optimization.keywords && (
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Keywords to Include</h5>
                    <div className="flex flex-wrap gap-2">
                      {results.optimization.keywords.map((keyword: string, index: number) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {results.optimization.skillSuggestions && (
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Recommended Skills</h5>
                    <div className="flex flex-wrap gap-2">
                      {results.optimization.skillSuggestions.map((skill: string, index: number) => (
                        <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {results.optimization.experienceImprovements && (
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Experience Improvements</h5>
                    <ul className="space-y-1">
                      {results.optimization.experienceImprovements.map((improvement: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Skill Suggestions</h3>
              <p className="text-gray-600 mb-4">
                Get AI-powered skill recommendations based on your profession and experience.
              </p>
              <button
                onClick={generateSkillSuggestions}
                disabled={isLoading}
                className="flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
              >
                <Star className="h-5 w-5 mr-2" />
                {isLoading ? 'Generating...' : 'Get Skill Suggestions'}
              </button>
            </div>
            
            {results.skills && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">
                  Recommended Skills for {authState.user?.profession}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {results.skills.map((skill: string, index: number) => (
                    <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                      <span className="text-gray-800 font-medium">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

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
              AI-Powered Career Tools
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Leverage advanced AI to enhance your CV, prepare for interviews, and optimize your job applications.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Tool Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">AI Tools</h2>
              <div className="space-y-2">
                {tools.map((tool) => {
                  const Icon = tool.icon;
                  const isActive = activeTab === tool.id;
                  
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setActiveTab(tool.id)}
                      className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                        isActive
                          ? `${getColorClasses(tool.color)} border`
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className={`p-2 rounded-lg mr-3 ${
                        isActive ? 'bg-white' : 'bg-gray-100'
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{tool.title}</p>
                        <p className="text-xs opacity-75 line-clamp-2">{tool.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tool Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              {renderToolContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITools;