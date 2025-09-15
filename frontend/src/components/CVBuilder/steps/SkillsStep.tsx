import React, { useState } from "react";
import { Plus, Trash2, Code, Sparkles } from "lucide-react";
import { useCV } from "../../../context/CVContext";
import { useAuth } from "../../../context/AuthContext";
import { aiAPI } from "../../../services/api";
import type { Skill } from "../../../types";
import toast from "react-hot-toast";

const SkillsStep: React.FC = () => {
  const { state: cvState, setCurrentCV } = useCV();
  const { state: authState } = useAuth();
  const [newSkill, setNewSkill] = useState({
    name: "",
    level: "Intermediate" as const,
    category: "Technical" as const,
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const skills = cvState.currentCV?.skills || [];

  const addSkill = () => {
    if (!newSkill.name.trim()) return;

    const skill: Skill = {
      id: Date.now().toString(),
      name: newSkill.name.trim(),
      level: newSkill.level,
      category: newSkill.category,
    };

    const updatedCV = {
      ...cvState.currentCV,
      skills: [...skills, skill],
    };
    setCurrentCV(updatedCV as any);
    setNewSkill({ name: "", level: "Intermediate", category: "Technical" });
  };

  const removeSkill = (id: string) => {
    const updatedSkills = skills.filter((skill) => skill.id !== id);
    const updatedCV = {
      ...cvState.currentCV,
      skills: updatedSkills,
    };
    setCurrentCV(updatedCV as any);
  };

  const updateSkill = (id: string, field: keyof Skill, value: string) => {
    const updatedSkills = skills.map((skill) =>
      skill.id === id ? { ...skill, [field]: value } : skill,
    );
    const updatedCV = {
      ...cvState.currentCV,
      skills: updatedSkills,
    };
    setCurrentCV(updatedCV as any);
  };

  const generateSkillSuggestions = async () => {
    if (!authState.user?.profession) {
      toast.error("Please set your profession in your profile");
      return;
    }

    setIsGenerating(true);
    try {
      const suggestions = await aiAPI.generateSkillSuggestions({
        profession: authState.user.profession,
        experience: cvState.currentCV?.workExperience || [],
      });

      // Add suggested skills that aren't already in the list
      const existingSkillNames = skills.map((s) => s.name.toLowerCase());
      const newSkills = suggestions
        .filter(
          (suggestion) =>
            !existingSkillNames.includes(suggestion.toLowerCase()),
        )
        .slice(0, 8) // Limit to 8 suggestions
        .map((suggestion) => ({
          id: Date.now().toString() + Math.random(),
          name: suggestion,
          level: "Intermediate" as const,
          category: "Technical" as const,
        }));

      if (newSkills.length > 0) {
        const updatedCV = {
          ...cvState.currentCV,
          skills: [...skills, ...newSkills],
        };
        setCurrentCV(updatedCV as any);
        toast.success(`Added ${newSkills.length} skill suggestions!`);
      } else {
        toast("No new skill suggestions found");
      }
    } catch (error) {
      toast.error("Failed to generate skill suggestions");
    } finally {
      setIsGenerating(false);
    }
  };

  const skillLevels = [
    "Beginner",
    "Intermediate",
    "Advanced",
    "Expert",
  ] as const;
  const skillCategories = ["Technical", "Soft", "Language", "Other"] as const;

  const groupedSkills = skillCategories.reduce(
    (acc, category) => {
      acc[category] = skills.filter((skill) => skill.category === category);
      return acc;
    },
    {} as Record<string, Skill[]>,
  );

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-red-100 text-red-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-blue-100 text-blue-800";
      case "Expert":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
        <p className="text-gray-600 mb-6">
          Add your technical and soft skills. Use AI to get personalized skill
          suggestions based on your profession.
        </p>
      </div>

      {/* Add New Skill */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Add New Skill</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <input
              type="text"
              value={newSkill.name}
              onChange={(e) =>
                setNewSkill({ ...newSkill, name: e.target.value })
              }
              onKeyPress={(e) => e.key === "Enter" && addSkill()}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter skill name..."
            />
          </div>
          <div>
            <label
              htmlFor="skill-level"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Skill Level
            </label>
            <select
              id="skill-level"
              value={newSkill.level}
              onChange={(e) =>
                setNewSkill({ ...newSkill, level: e.target.value as any })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {skillLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="skill-category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              id="skill-category"
              value={newSkill.category}
              onChange={(e) =>
                setNewSkill({ ...newSkill, category: e.target.value as any })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {skillCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <button
            onClick={addSkill}
            disabled={!newSkill.name.trim()}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Skill
          </button>
          <button
            onClick={generateSkillSuggestions}
            disabled={isGenerating}
            className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isGenerating ? "Generating..." : "AI Suggestions"}
          </button>
        </div>
      </div>

      {/* Skills by Category */}
      <div className="space-y-6">
        {skillCategories.map((category) => {
          const categorySkills = groupedSkills[category];
          if (categorySkills.length === 0) return null;

          return (
            <div key={category}>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <Code className="h-4 w-4 mr-2 text-blue-600" />
                {category} Skills ({categorySkills.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {categorySkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="bg-white border border-gray-200 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) =>
                          updateSkill(skill.id, "name", e.target.value)
                        }
                        className="font-medium text-gray-900 bg-transparent border-none p-0 focus:ring-0 flex-1"
                        aria-label={`Skill name for ${skill.name}`}
                        placeholder="Enter Skill Name"
                      />
                      <button
                        onClick={() => removeSkill(skill.id)}
                        className="text-red-600 hover:text-red-700 ml-2"
                        aria-label={`Remove ${skill.name} skill`}
                        title="Remove Skill"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <select
                        value={skill.level}
                        onChange={(e) =>
                          updateSkill(skill.id, "level", e.target.value)
                        }
                        className="text-xs border-none p-0 focus:ring-0 bg-transparent"
                        aria-label={`Skill level for ${skill.name}`}
                        title="Select Skill Level"
                      >
                        {skillLevels.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(skill.level)}`}
                      >
                        {skill.level}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {skills.length === 0 && (
        <div className="text-center py-8">
          <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No skills added yet
          </h3>
          <p className="text-gray-600 mb-4">
            Add your skills manually or use AI suggestions
          </p>
        </div>
      )}
    </div>
  );
};

export default SkillsStep;
