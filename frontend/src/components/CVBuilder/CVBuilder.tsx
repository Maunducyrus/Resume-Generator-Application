import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Eye,
  FileText,
  User,
  GraduationCap,
  Briefcase,
  Award,
  Code,
  CheckCircle,
} from "lucide-react";
import { useCV } from "../../context/CVContext";
import { useAuth } from "../../context/AuthContext";
import PersonalInfoStep from "./steps/PersonalInfoStep";
import EducationStep from "./steps/EducationStep";
import ExperienceStep from "./steps/ExperienceStep";
import SkillsStep from "./steps/SkillsStep";
import ProjectsStep from "./steps/ProjectsStep";
import ReviewStep from "./steps/ReviewStep";
import CVPreview from "./CVPreview";
import type { CVData } from "../../types";

interface CVBuilderProps {
  onViewChange: (view: string) => void;
}

const CVBuilder: React.FC<CVBuilderProps> = ({ onViewChange }) => {
  const { state: cvState, setCurrentStep, setCurrentCV, saveCV } = useCV();
  const { state: authState } = useAuth();
  const [showPreview, setShowPreview] = useState(false);
  const [cvName, setCvName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const steps = [
    { id: 1, title: "Personal Info", icon: User, component: PersonalInfoStep },
    {
      id: 2,
      title: "Education",
      icon: GraduationCap,
      component: EducationStep,
    },
    { id: 3, title: "Experience", icon: Briefcase, component: ExperienceStep },
    { id: 4, title: "Skills", icon: Code, component: SkillsStep },
    { id: 5, title: "Projects", icon: Award, component: ProjectsStep },
    { id: 6, title: "Review", icon: CheckCircle, component: ReviewStep },
  ];

  const currentStepData = steps.find((step) => step.id === cvState.currentStep);
  const CurrentStepComponent = currentStepData?.component;

  useEffect(() => {
    if (!cvState.selectedTemplate) {
      onViewChange("templates");
    }
  }, [cvState.selectedTemplate, onViewChange]);

  const handleNext = () => {
    if (cvState.currentStep < steps.length) {
      setCurrentStep(cvState.currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (cvState.currentStep > 1) {
      setCurrentStep(cvState.currentStep - 1);
    }
  };

  const handleSave = async () => {
    if (!cvState.currentCV || !cvState.selectedTemplate) return;

    setIsSaving(true);
    try {
      const name = cvName || `CV - ${new Date().toLocaleDateString()}`;
      await saveCV(
        name,
        cvState.selectedTemplate,
        cvState.currentCV,
        authState.user?.profession,
      );
      onViewChange("dashboard");
    } catch (error) {
      console.error("Failed to save CV:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const isStepComplete = (stepId: number): boolean => {
    if (!cvState.currentCV) return false;

    switch (stepId) {
      case 1:
        return !!(
          cvState.currentCV.personalInfo?.fullName &&
          cvState.currentCV.personalInfo?.email
        );
      // case 2:
      //   return cvState.currentCV.education.length > 0;
      // case 3:
      //   return cvState.currentCV.workExperience.length > 0;
      // case 4:
      //   return cvState.currentCV.skills.length > 0;
      case 2:
        return (cvState.currentCV.education?.length ?? 0) > 0;
      case 3:
        return (cvState.currentCV.workExperience?.length ?? 0) > 0;
      case 4:
        return (cvState.currentCV.skills?.length ?? 0) > 0;
      case 5:
        return true; // Projects are optional
      case 6:
        return true; // Review step
      default:
        return false;
    }
  };

  if (!cvState.selectedTemplate) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No Template Selected
          </h2>
          <p className="text-gray-600 mb-6">
            Please select a template to start building your CV
          </p>
          <button
            onClick={() => onViewChange("templates")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Choose Template
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => onViewChange("templates")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Templates
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Build Your CV</h1>
          <p className="text-gray-600 mt-2">
            Complete each step to create your professional CV
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Steps Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Progress</h2>
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = step.id === cvState.currentStep;
                  const isComplete = isStepComplete(step.id);
                  const isAccessible =
                    step.id <= cvState.currentStep || isComplete;

                  return (
                    <button
                      key={step.id}
                      onClick={() => isAccessible && setCurrentStep(step.id)}
                      disabled={!isAccessible}
                      className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                        isActive
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : isComplete
                            ? "bg-green-50 text-green-700 hover:bg-green-100"
                            : isAccessible
                              ? "hover:bg-gray-50 text-gray-700"
                              : "text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg mr-3 ${
                          isActive
                            ? "bg-blue-200"
                            : isComplete
                              ? "bg-green-200"
                              : "bg-gray-100"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{step.title}</p>
                        <p className="text-xs opacity-75">
                          {isComplete
                            ? "Complete"
                            : isActive
                              ? "Current"
                              : "Pending"}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              {/* Step Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {currentStepData && (
                      <>
                        <div className="p-3 bg-blue-100 rounded-lg mr-4">
                          <currentStepData.icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">
                            {currentStepData.title}
                          </h2>
                          <p className="text-gray-600">
                            Step {cvState.currentStep} of {steps.length}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {showPreview ? "Hide Preview" : "Preview"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Step Content */}
              <div className="p-6">
                {CurrentStepComponent && <CurrentStepComponent />}
              </div>

              {/* Navigation */}
              <div className="p-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handlePrevious}
                    disabled={cvState.currentStep === 1}
                    className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </button>

                  <div className="flex items-center space-x-3">
                    {cvState.currentStep === steps.length ? (
                      <>
                        <input
                          type="text"
                          placeholder="CV Name (optional)"
                          value={cvName}
                          onChange={(e) => setCvName(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          onClick={handleSave}
                          disabled={isSaving || !cvState.currentCV}
                          className="flex items-center px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {isSaving ? "Saving..." : "Save CV"}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleNext}
                        className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && cvState.currentCV && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      CV Preview
                    </h3>
                    <button
                      onClick={() => setShowPreview(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <CVPreview
                    cvData={cvState.currentCV}
                    templateId={cvState.selectedTemplate}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CVBuilder;
