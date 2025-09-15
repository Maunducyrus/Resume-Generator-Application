import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  FileText,
  MessageSquare,
  Target,
  Lightbulb,
  Download,
  Copy,
  RefreshCw,
  Star,
  Zap,
  Brain,
  TrendingUp,
} from "lucide-react";
import { useCV } from "../../context/CVContext";
import { useAuth } from "../../context/AuthContext";
import { aiAPI } from "../../services/api";
import toast from "react-hot-toast";

const AITools: React.FC = () => {
  const { state: cvState } = useCV();
  const { state: authState } = useAuth();

  // State for different AI tools
  const [coverLetter, setCoverLetter] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [interviewQuestions, setInterviewQuestions] = useState<string[]>([]);
  const [jobOptimization, setJobOptimization] = useState<any>(null);
  const [skillSuggestions, setSkillSuggestions] = useState<string[]>([]);
  const [professionalSummary, setProfessionalSummary] = useState("");
  const [atsScore, setAtsScore] = useState<any>(null);

  // Loading states
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isGeneratingSkills, setIsGeneratingSkills] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isCalculatingATS, setIsCalculatingATS] = useState(false);

  const profession = authState.user?.profession || "Professional";

  // Generate Cover Letter
  const generateCoverLetter = async () => {
    if (!cvState.currentCV) {
      toast.error("Please create a CV first");
      return;
    }
    if (!jobDescription.trim()) {
      toast.error("Please enter a job description");
      return;
    }

    setIsGeneratingCoverLetter(true);
    try {
      const letter = await aiAPI.generateCoverLetter({
        cvData: cvState.currentCV,
        jobDescription: jobDescription.trim(),
        profession,
      });
      setCoverLetter(letter);
      toast.success("Cover letter generated successfully!");
    } catch (error) {
      toast.error("Failed to generate cover letter");
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };

  // Generate Interview Questions
  const generateInterviewQuestions = async () => {
    setIsGeneratingQuestions(true);
    try {
      const questions = await aiAPI.generateInterviewQuestions({
        profession,
        jobDescription: jobDescription.trim() || undefined,
        experienceLevel: "Mid-level",
      });
      setInterviewQuestions(questions);
      toast.success("Interview questions generated!");
    } catch (error) {
      toast.error("Failed to generate interview questions");
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // Job-Specific Optimization
  const optimizeForJob = async () => {
    if (!cvState.currentCV) {
      toast.error("Please create a CV first");
      return;
    }
    if (!jobDescription.trim()) {
      toast.error("Please enter a job description");
      return;
    }

    setIsOptimizing(true);
    try {
      const optimization = await aiAPI.optimizeForJob({
        cvData: cvState.currentCV,
        jobDescription: jobDescription.trim(),
        profession,
      });
      setJobOptimization(optimization);
      toast.success("Job optimization completed!");
    } catch (error) {
      toast.error("Failed to optimize for job");
    } finally {
      setIsOptimizing(false);
    }
  };

  // Generate Skill Suggestions
  const generateSkillSuggestions = async () => {
    setIsGeneratingSkills(true);
    try {
      const skills = await aiAPI.generateSkillSuggestions({
        profession,
        experience: cvState.currentCV?.workExperience || [],
      });
      setSkillSuggestions(skills);
      toast.success("Skill suggestions generated!");
    } catch (error) {
      toast.error("Failed to generate skill suggestions");
    } finally {
      setIsGeneratingSkills(false);
    }
  };

  // Generate Professional Summary
  const generateProfessionalSummary = async () => {
    if (
      !cvState.currentCV?.personalInfo ||
      !cvState.currentCV?.workExperience?.length
    ) {
      toast.error("Please add personal info and work experience first");
      return;
    }

    setIsGeneratingSummary(true);
    try {
      const summary = await aiAPI.generateSummary({
        personalInfo: cvState.currentCV.personalInfo,
        workExperience: cvState.currentCV.workExperience,
        profession,
      });
      setProfessionalSummary(summary);
      toast.success("Professional summary generated!");
    } catch (error) {
      toast.error("Failed to generate summary");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // Calculate ATS Score
  const calculateATSScore = async () => {
    if (!cvState.currentCV) {
      toast.error("Please create a CV first");
      return;
    }

    setIsCalculatingATS(true);
    try {
      const result = await aiAPI.calculateATSScore({
        cvData: cvState.currentCV,
        profession,
      });
      setAtsScore(result);
      toast.success("ATS score calculated!");
    } catch (error) {
      toast.error("Failed to calculate ATS score");
    } finally {
      setIsCalculatingATS(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  // Download as file
  const downloadAsFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("File downloaded!");
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
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
            <div className="flex items-center justify-center mb-4">
              <Brain className="h-12 w-12 text-purple-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">
                AI-Powered Tools
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enhance your CV and job search with advanced AI tools powered by
              OpenAI GPT-4
            </p>
          </motion.div>
        </div>

        {/* Job Description Input */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="h-5 w-5 text-blue-600 mr-2" />
            Job Description (Optional for better results)
          </h2>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Paste the job description here for more targeted AI assistance..."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cover Letter Generator */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <FileText className="h-5 w-5 text-green-600 mr-2" />
                Cover Letter Generator
              </h2>
              <button
                onClick={generateCoverLetter}
                disabled={isGeneratingCoverLetter}
                className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {isGeneratingCoverLetter ? "Generating..." : "Generate"}
              </button>
            </div>

            {coverLetter ? (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                    {coverLetter}
                  </pre>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyToClipboard(coverLetter)}
                    className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </button>
                  <button
                    onClick={() =>
                      downloadAsFile(coverLetter, "cover-letter.txt")
                    }
                    className="flex items-center px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Generate a professional cover letter tailored to your CV and
                  the job description
                </p>
              </div>
            )}
          </div>

          {/* Interview Questions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <MessageSquare className="h-5 w-5 text-blue-600 mr-2" />
                Interview Questions
              </h2>
              <button
                onClick={generateInterviewQuestions}
                disabled={isGeneratingQuestions}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {isGeneratingQuestions ? "Generating..." : "Generate"}
              </button>
            </div>

            {interviewQuestions.length > 0 ? (
              <div className="space-y-4">
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {interviewQuestions.map((question, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        Question {index + 1}:
                      </p>
                      <p className="text-sm text-gray-700">{question}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(interviewQuestions.join("\n\n"))
                  }
                  className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy All Questions
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Get {profession}-specific interview questions to help you
                  prepare
                </p>
              </div>
            )}
          </div>

          {/* Job Optimization */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <TrendingUp className="h-5 w-5 text-orange-600 mr-2" />
                Job-Specific Optimization
              </h2>
              <button
                onClick={optimizeForJob}
                disabled={isOptimizing}
                className="flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
              >
                <Zap className="h-4 w-4 mr-2" />
                {isOptimizing ? "Optimizing..." : "Optimize"}
              </button>
            </div>

            {jobOptimization ? (
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {jobOptimization.keywords && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Keywords to Include:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {jobOptimization.keywords.map(
                        (keyword: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                          >
                            {keyword}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {jobOptimization.skillSuggestions && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Recommended Skills:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {jobOptimization.skillSuggestions.map(
                        (skill: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                          >
                            {skill}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {jobOptimization.experienceImprovements && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Experience Improvements:
                    </h4>
                    <ul className="space-y-1">
                      {jobOptimization.experienceImprovements.map(
                        (improvement: string, index: number) => (
                          <li
                            key={index}
                            className="text-sm text-gray-700 flex items-start"
                          >
                            <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                            {improvement}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Get specific optimization suggestions for your target job
                </p>
              </div>
            )}
          </div>

          {/* Skill Suggestions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Lightbulb className="h-5 w-5 text-yellow-600 mr-2" />
                Skill Suggestions
              </h2>
              <button
                onClick={generateSkillSuggestions}
                disabled={isGeneratingSkills}
                className="flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                {isGeneratingSkills ? "Generating..." : "Generate"}
              </button>
            </div>

            {skillSuggestions.length > 0 ? (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                  {skillSuggestions.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => copyToClipboard(skillSuggestions.join(", "))}
                  className="flex items-center px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm transition-colors"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy Skills
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Get AI-powered skill suggestions for {profession} roles
                </p>
              </div>
            )}
          </div>

          {/* Professional Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <FileText className="h-5 w-5 text-purple-600 mr-2" />
                Professional Summary
              </h2>
              <button
                onClick={generateProfessionalSummary}
                disabled={isGeneratingSummary}
                className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {isGeneratingSummary ? "Generating..." : "Generate"}
              </button>
            </div>

            {professionalSummary ? (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">{professionalSummary}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyToClipboard(professionalSummary)}
                    className="flex items-center px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Generate a compelling professional summary based on your
                  experience
                </p>
              </div>
            )}
          </div>

          {/* ATS Score Calculator */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Star className="h-5 w-5 text-indigo-600 mr-2" />
                ATS Score Calculator
              </h2>
              <button
                onClick={calculateATSScore}
                disabled={isCalculatingATS}
                className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
              >
                <Star className="h-4 w-4 mr-2" />
                {isCalculatingATS ? "Calculating..." : "Calculate"}
              </button>
            </div>

            {atsScore ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center ${getScoreBg(atsScore.score)}`}
                  >
                    <div className="text-center">
                      <div
                        className={`text-xl font-bold ${getScoreColor(atsScore.score)}`}
                      >
                        {atsScore.score}
                      </div>
                      <div className="text-xs text-gray-600">ATS</div>
                    </div>
                  </div>
                </div>

                {atsScore.suggestions && atsScore.suggestions.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Improvement Suggestions:
                    </h4>
                    <ul className="space-y-1 max-h-32 overflow-y-auto">
                      {atsScore.suggestions.map(
                        (suggestion: string, index: number) => (
                          <li
                            key={index}
                            className="text-sm text-gray-700 flex items-start"
                          >
                            <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                            {suggestion}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Calculate your CV's ATS compatibility score
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITools;
