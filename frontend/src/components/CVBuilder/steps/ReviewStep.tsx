import React, { useState } from "react";
import { CheckCircle, AlertCircle, Sparkles, Star } from "lucide-react";
import { useCV } from "../../../context/CVContext";
import { useAuth } from "../../../context/AuthContext";
import { aiAPI } from "../../../services/api";
import type { ATSResult } from "../../../types";
import toast from "react-hot-toast";

const ReviewStep: React.FC = () => {
  const { state: cvState } = useCV();
  const { state: authState } = useAuth();
  const [atsResult, setAtsResult] = useState<ATSResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateATSScore = async () => {
    if (!cvState.currentCV) return;

    setIsCalculating(true);
    try {
      const result = await aiAPI.calculateATSScore({
        cvData: cvState.currentCV,
        profession: authState.user?.profession || "Professional",
      });
      setAtsResult(result);
    } catch (error) {
      toast.error("Failed to calculate ATS score");
    } finally {
      setIsCalculating(false);
    }
  };

  const getCompletionStatus = () => {
    if (!cvState.currentCV) return { completed: 0, total: 0, sections: [] };

    const sections = [
      {
        name: "Personal Information",
        completed: !!(
          cvState.currentCV.personalInfo?.fullName &&
          cvState.currentCV.personalInfo?.email
        ),
        required: true,
      },
      {
        name: "Education",
        completed: cvState.currentCV.education.length > 0,
        required: true,
      },
      {
        name: "Work Experience",
        completed: cvState.currentCV.workExperience.length > 0,
        required: true,
      },
      {
        name: "Skills",
        completed: cvState.currentCV.skills.length > 0,
        required: true,
      },
      {
        name: "Projects",
        completed: cvState.currentCV.projects.length > 0,
        required: false,
      },
      {
        name: "Professional Summary",
        completed: !!(
          cvState.currentCV.personalInfo?.summary &&
          cvState.currentCV.personalInfo.summary.length > 50
        ),
        required: false,
      },
    ];

    const requiredSections = sections.filter((s) => s.required);
    const completedRequired = requiredSections.filter(
      (s) => s.completed,
    ).length;
    const totalRequired = requiredSections.length;

    return {
      completed: completedRequired,
      total: totalRequired,
      sections,
      isComplete: completedRequired === totalRequired,
    };
  };

  const status = getCompletionStatus();

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
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Review Your CV
        </h3>
        <p className="text-gray-600 mb-6">
          Review your CV for completeness and get an ATS compatibility score to
          improve your chances of getting hired.
        </p>
      </div>

      {/* Completion Status */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">CV Completion Status</h4>
          <div className="flex items-center">
            {status.isComplete ? (
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
            )}
            <span className="text-sm font-medium">
              {status.completed}/{status.total} Required Sections
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {status.sections.map((section, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                {section.completed ? (
                  <CheckCircle className="h-4 w-4 text-green-600 mr-3" />
                ) : (
                  <div className="h-4 w-4 border-2 border-gray-300 rounded-full mr-3" />
                )}
                <span
                  className={`text-sm ${section.completed ? "text-gray-900" : "text-gray-500"}`}
                >
                  {section.name}
                </span>
              </div>
              <div className="flex items-center">
                {!section.required && (
                  <span className="text-xs text-gray-500 mr-2">Optional</span>
                )}
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    section.completed
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {section.completed ? "Complete" : "Incomplete"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {!status.isComplete && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Please complete all required sections before saving your CV.
            </p>
          </div>
        )}
      </div>

      {/* ATS Score */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">ATS Compatibility Score</h4>
          <button
            onClick={calculateATSScore}
            disabled={isCalculating || !status.isComplete}
            className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isCalculating ? "Calculating..." : "Calculate Score"}
          </button>
        </div>

        {atsResult ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center ${getScoreBg(atsResult.score)}`}
              >
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${getScoreColor(atsResult.score)}`}
                  >
                    {atsResult.score}
                  </div>
                  <div className="text-xs text-gray-600">ATS Score</div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(atsResult.score / 20)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">
                {atsResult.score >= 80 &&
                  "Excellent! Your CV is highly ATS-compatible."}
                {atsResult.score >= 60 &&
                  atsResult.score < 80 &&
                  "Good! Your CV has decent ATS compatibility."}
                {atsResult.score < 60 &&
                  "Needs improvement. Follow the suggestions below."}
              </p>
            </div>

            {atsResult.suggestions.length > 0 && (
              <div>
                <h5 className="font-medium text-gray-900 mb-2">
                  Improvement Suggestions:
                </h5>
                <ul className="space-y-2">
                  {atsResult.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-sm text-gray-700">
                        {suggestion}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {status.isComplete
                ? 'Click "Calculate Score" to get your ATS compatibility score'
                : "Complete all required sections to calculate your ATS score"}
            </p>
          </div>
        )}
      </div>

      {/* CV Summary */}
      {cvState.currentCV && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-4">CV Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {cvState.currentCV.education.length}
              </div>
              <div className="text-sm text-gray-600">Education</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {cvState.currentCV.workExperience.length}
              </div>
              <div className="text-sm text-gray-600">Experience</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {cvState.currentCV.skills.length}
              </div>
              <div className="text-sm text-gray-600">Skills</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {cvState.currentCV.projects.length}
              </div>
              <div className="text-sm text-gray-600">Projects</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewStep;
