import React, { useState } from "react";
import { Plus, Trash2, GraduationCap } from "lucide-react";
import { useCV } from "../../../context/CVContext";
import type { Education } from "../../../types";

const EducationStep: React.FC = () => {
  const { state: cvState, setCurrentCV } = useCV();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const education = cvState.currentCV?.education || [];

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      gpa: "",
      description: "",
    };

    const updatedCV = {
      ...cvState.currentCV,
      education: [...education, newEducation],
    };
    setCurrentCV(updatedCV as any);
    setEditingIndex(education.length);
  };

  const updateEducation = (
    index: number,
    field: keyof Education,
    value: string,
  ) => {
    const updatedEducation = education.map((edu, i) =>
      i === index ? { ...edu, [field]: value } : edu,
    );

    const updatedCV = {
      ...cvState.currentCV,
      education: updatedEducation,
    };
    setCurrentCV(updatedCV as any);
  };

  const removeEducation = (index: number) => {
    const updatedEducation = education.filter((_, i) => i !== index);
    const updatedCV = {
      ...cvState.currentCV,
      education: updatedEducation,
    };
    setCurrentCV(updatedCV as any);
    setEditingIndex(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Education</h3>
        <p className="text-gray-600 mb-6">
          Add your educational background, including degrees, certifications,
          and relevant coursework.
        </p>
      </div>

      <div className="space-y-4">
        {education.map((edu, index) => (
          <div key={edu.id} className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <GraduationCap className="h-5 w-5 text-blue-600 mr-2" />
                <h4 className="font-medium text-gray-900">
                  {edu.degree || "New Education Entry"}
                </h4>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    setEditingIndex(editingIndex === index ? null : index)
                  }
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  {editingIndex === index ? "Collapse" : "Edit"}
                </button>
                <button
                  onClick={() => removeEducation(index)}
                  className="text-red-600 hover:text-red-700"
                  title="Remove education"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {editingIndex === index && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institution *
                  </label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) =>
                      updateEducation(index, "institution", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="University of California"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Degree *
                  </label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) =>
                      updateEducation(index, "degree", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Bachelor of Science"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Field of Study *
                  </label>
                  <input
                    type="text"
                    value={edu.field}
                    onChange={(e) =>
                      updateEducation(index, "field", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Computer Science"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GPA (Optional)
                  </label>
                  <input
                    type="text"
                    value={edu.gpa}
                    onChange={(e) =>
                      updateEducation(index, "gpa", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="3.8/4.0"
                  />
                </div>

                <div>
                  {/* <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label> */}
                  <label
                    htmlFor={`startDate-${index}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Start Date
                  </label>
                  <input
                    type="month"
                    value={edu.startDate}
                    onChange={(e) =>
                      updateEducation(index, "startDate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Education start date"
                  />
                </div>

                <div>
                  {/* <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label> */}
                  <label
                    htmlFor={`endDate-${index}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    End Date
                  </label>
                  <input
                    id={`endDate-${index}`}
                    type="month"
                    value={edu.endDate}
                    onChange={(e) =>
                      updateEducation(index, "endDate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Education end date"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={edu.description}
                    onChange={(e) =>
                      updateEducation(index, "description", e.target.value)
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Relevant coursework, achievements, honors..."
                  />
                </div>
              </div>
            )}

            {editingIndex !== index && edu.institution && (
              <div className="text-sm text-gray-600">
                <p className="font-medium">
                  {edu.degree} in {edu.field}
                </p>
                <p>{edu.institution}</p>
                {edu.startDate && edu.endDate && (
                  <p>
                    {edu.startDate} - {edu.endDate}
                  </p>
                )}
                {edu.gpa && <p>GPA: {edu.gpa}</p>}
              </div>
            )}
          </div>
        ))}

        <button
          onClick={addEducation}
          className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Education
        </button>
      </div>
    </div>
  );
};

export default EducationStep;
