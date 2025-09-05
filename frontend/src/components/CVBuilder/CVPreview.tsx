import React from 'react';
import { getTemplateById } from '../../data/templates';
import type { CVData } from '../../types';

interface CVPreviewProps {
  cvData: CVData;
  templateId: string;
}

const CVPreview: React.FC<CVPreviewProps> = ({ cvData, templateId }) => {
  const template = getTemplateById(templateId);

  if (!template) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Template not found</p>
      </div>
    );
  }

  // Modern Professional Template
  if (templateId === 'modern-professional') {
    return (
      <div className="bg-white shadow-lg max-w-4xl mx-auto" style={{ aspectRatio: '8.5/11' }}>
        {/* Header */}
        <div className="bg-blue-600 text-white p-8">
          <h1 className="text-3xl font-bold mb-2">{cvData.personalInfo.fullName || 'Your Name'}</h1>
          <div className="flex flex-wrap gap-4 text-sm">
            {cvData.personalInfo.email && <span>{cvData.personalInfo.email}</span>}
            {cvData.personalInfo.phone && <span>{cvData.personalInfo.phone}</span>}
            {cvData.personalInfo.location && <span>{cvData.personalInfo.location}</span>}
          </div>
        </div>

        <div className="p-8 grid grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Summary */}
            {cvData.personalInfo.summary && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-blue-600 pb-1">
                  Professional Summary
                </h2>
                <p className="text-gray-700 leading-relaxed">{cvData.personalInfo.summary}</p>
              </section>
            )}

            {/* Experience */}
            {cvData.workExperience.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-blue-600 pb-1">
                  Work Experience
                </h2>
                <div className="space-y-4">
                  {cvData.workExperience.map((exp, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                          <p className="text-blue-600 font-medium">{exp.company}</p>
                        </div>
                        <span className="text-sm text-gray-600">
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      {exp.responsibilities.length > 0 && (
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                          {exp.responsibilities.map((resp, i) => (
                            <li key={i}>{resp}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {cvData.projects.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-blue-600 pb-1">
                  Projects
                </h2>
                <div className="space-y-3">
                  {cvData.projects.map((project, index) => (
                    <div key={index}>
                      <h3 className="font-semibold text-gray-900">{project.name}</h3>
                      <p className="text-sm text-gray-700 mb-1">{project.description}</p>
                      {project.technologies.length > 0 && (
                        <p className="text-xs text-blue-600">
                          Technologies: {project.technologies.join(', ')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Contact</h2>
              <div className="space-y-2 text-sm">
                {cvData.personalInfo.website && (
                  <p className="break-all">{cvData.personalInfo.website}</p>
                )}
                {cvData.personalInfo.linkedin && (
                  <p className="break-all">{cvData.personalInfo.linkedin}</p>
                )}
                {cvData.personalInfo.github && (
                  <p className="break-all">{cvData.personalInfo.github}</p>
                )}
              </div>
            </section>

            {/* Skills */}
            {cvData.skills.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-3">Skills</h2>
                <div className="space-y-2">
                  {['Technical', 'Soft', 'Language', 'Other'].map(category => {
                    const categorySkills = cvData.skills.filter(skill => skill.category === category);
                    if (categorySkills.length === 0) return null;
                    
                    return (
                      <div key={category}>
                        <h3 className="font-medium text-gray-800 text-sm mb-1">{category}</h3>
                        <div className="flex flex-wrap gap-1">
                          {categorySkills.map((skill, i) => (
                            <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Education */}
            {cvData.education.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-3">Education</h2>
                <div className="space-y-3">
                  {cvData.education.map((edu, index) => (
                    <div key={index}>
                      <h3 className="font-medium text-gray-900 text-sm">{edu.degree}</h3>
                      <p className="text-sm text-gray-700">{edu.institution}</p>
                      <p className="text-xs text-gray-600">
                        {edu.startDate} - {edu.endDate}
                      </p>
                      {edu.gpa && (
                        <p className="text-xs text-gray-600">GPA: {edu.gpa}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default template for other template IDs
  return (
    <div className="bg-white shadow-lg max-w-4xl mx-auto p-8" style={{ aspectRatio: '8.5/11' }}>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {cvData.personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex justify-center space-x-4 text-sm text-gray-600">
          {cvData.personalInfo.email && <span>{cvData.personalInfo.email}</span>}
          {cvData.personalInfo.phone && <span>{cvData.personalInfo.phone}</span>}
          {cvData.personalInfo.location && <span>{cvData.personalInfo.location}</span>}
        </div>
      </div>

      {cvData.personalInfo.summary && (
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2 border-b border-gray-300 pb-1">
            Professional Summary
          </h2>
          <p className="text-gray-700">{cvData.personalInfo.summary}</p>
        </section>
      )}

      {cvData.workExperience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2 border-b border-gray-300 pb-1">
            Work Experience
          </h2>
          {cvData.workExperience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-semibold">{exp.position}</h3>
                  <p className="text-gray-600">{exp.company}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              {exp.responsibilities.length > 0 && (
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {exp.responsibilities.map((resp, i) => (
                    <li key={i}>{resp}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      <div className="grid grid-cols-2 gap-8">
        {cvData.education.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2 border-b border-gray-300 pb-1">
              Education
            </h2>
            {cvData.education.map((edu, index) => (
              <div key={index} className="mb-3">
                <h3 className="font-medium">{edu.degree} in {edu.field}</h3>
                <p className="text-sm text-gray-600">{edu.institution}</p>
                <p className="text-sm text-gray-500">{edu.startDate} - {edu.endDate}</p>
              </div>
            ))}
          </section>
        )}

        {cvData.skills.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2 border-b border-gray-300 pb-1">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {cvData.skills.map((skill, index) => (
                <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CVPreview;