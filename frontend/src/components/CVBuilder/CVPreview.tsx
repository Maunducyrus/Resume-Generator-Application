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
      <div className="bg-white shadow-lg max-w-4xl mx-auto min-h-[1000px] print:shadow-none">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
          <h1 className="text-3xl font-bold mb-2">{cvData.personalInfo.fullName || 'Your Name'}</h1>
          <div className="flex flex-wrap gap-4 text-sm opacity-90">
            {cvData.personalInfo.email && <span>{cvData.personalInfo.email}</span>}
            {cvData.personalInfo.phone && <span>{cvData.personalInfo.phone}</span>}
            {cvData.personalInfo.location && <span>{cvData.personalInfo.location}</span>}
            {cvData.personalInfo.website && <span>{cvData.personalInfo.website}</span>}
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary */}
            {cvData.personalInfo.summary && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
                  Professional Summary
                </h2>
                <p className="text-gray-700 leading-relaxed text-justify">{cvData.personalInfo.summary}</p>
              </section>
            )}

            {/* Experience */}
            {cvData.workExperience.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
                  Work Experience
                </h2>
                <div className="space-y-6">
                  {cvData.workExperience.map((exp, index) => (
                    <div key={index} className="border-l-4 border-blue-200 pl-4">
                      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-3">
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{exp.position}</h3>
                          <p className="text-blue-600 font-semibold">{exp.company}</p>
                          {exp.location && <p className="text-sm text-gray-600">{exp.location}</p>}
                        </div>
                        <span className="text-sm text-gray-600 font-medium mt-1 lg:mt-0">
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      {exp.responsibilities.length > 0 && (
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mb-3">
                          {exp.responsibilities.map((resp, i) => (
                            <li key={i}>{resp}</li>
                          ))}
                        </ul>
                      )}
                      {exp.achievements && exp.achievements.length > 0 && (
                        <div className="mt-2">
                          <h4 className="font-semibold text-gray-800 text-sm mb-2">Key Achievements:</h4>
                          <ul className="list-disc list-inside text-sm text-green-700 space-y-1 bg-green-50 p-3 rounded">
                            {exp.achievements.map((achievement, i) => (
                              <li key={i}>{achievement}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {cvData.projects.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
                  Projects
                </h2>
                <div className="space-y-4">
                  {cvData.projects.map((project, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900">{project.name}</h3>
                      <p className="text-sm text-gray-700 mb-1">{project.description}</p>
                        <span className="text-xs text-gray-500">
                          {project.startDate} {project.endDate && `- ${project.endDate}`}
                        </span>
                      {project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.technologies.map((tech, i) => (
                            <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center space-x-3 mt-1">
                        {project.url && (
                          <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                            Live Demo
                          </a>
                        )}
                        {project.github && (
                          <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-600 hover:underline">
                            GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {cvData.certifications.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
                  Certifications
                </h2>
                <div className="space-y-3">
                  {cvData.certifications.map((cert, index) => (
                    <div key={index} className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm">{cert.name}</h3>
                          <p className="text-sm text-gray-700">{cert.issuer}</p>
                        </div>
                        <span className="text-xs text-gray-600">{cert.date}</span>
                      </div>
                      {cert.credentialId && (
                        <p className="text-xs text-gray-500">ID: {cert.credentialId}</p>
                      )}
                      {cert.url && (
                        <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                          View Credential
                        </a>
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
              <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">Contact</h2>
              <div className="space-y-2 text-sm">
                {cvData.personalInfo.email && (
                  <div className="flex items-center">
                    <span className="font-medium text-gray-600 w-16">Email:</span>
                    <span className="break-all">{cvData.personalInfo.email}</span>
                  </div>
                )}
                {cvData.personalInfo.phone && (
                  <div className="flex items-center">
                    <span className="font-medium text-gray-600 w-16">Phone:</span>
                    <span>{cvData.personalInfo.phone}</span>
                  </div>
                )}
                {cvData.personalInfo.location && (
                  <div className="flex items-center">
                    <span className="font-medium text-gray-600 w-16">Location:</span>
                    <span>{cvData.personalInfo.location}</span>
                  </div>
                )}
                {cvData.personalInfo.website && (
                  <div className="flex items-center">
                    <span className="font-medium text-gray-600 w-16">Website:</span>
                    <a href={cvData.personalInfo.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                      {cvData.personalInfo.website}
                    </a>
                  </div>
                )}
                {cvData.personalInfo.linkedin && (
                  <div className="flex items-center">
                    <span className="font-medium text-gray-600 w-16">LinkedIn:</span>
                    <a href={cvData.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                      LinkedIn
                    </a>
                  </div>
                )}
                {cvData.personalInfo.github && (
                  <div className="flex items-center">
                    <span className="font-medium text-gray-600 w-16">GitHub:</span>
                    <a href={cvData.personalInfo.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                      GitHub
                    </a>
                  </div>
                )}
              </div>
            </section>

            {/* Skills */}
            {cvData.skills.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">Skills</h2>
                <div className="space-y-2">
                  {['Technical', 'Soft', 'Language', 'Other'].map(category => {
                    const categorySkills = cvData.skills.filter(skill => skill.category === category);
                    if (categorySkills.length === 0) return null;
                    
                    return (
                      <div key={category}>
                        <h3 className="font-semibold text-gray-800 text-sm mb-2">{category}</h3>
                        <div className="flex flex-wrap gap-1">
                          {categorySkills.map((skill, i) => (
                            <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {skill.name} ({skill.level})
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
                <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">Education</h2>
                <div className="space-y-3">
                  {cvData.education.map((edu, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded">
                      <h3 className="font-medium text-gray-900 text-sm">{edu.degree} in {edu.field}</h3>
                      <p className="text-sm text-gray-700">{edu.institution}</p>
                      <p className="text-xs text-gray-600">
                        {edu.startDate} - {edu.endDate}
                      </p>
                      {edu.gpa && (
                        <p className="text-xs text-gray-600">GPA: {edu.gpa}</p>
                      )}
                      {edu.description && (
                        <p className="text-xs text-gray-600 mt-1">{edu.description}</p>
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
    <div className="bg-white shadow-lg max-w-4xl mx-auto p-8 min-h-[1000px] print:shadow-none">
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
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-gray-300 pb-2">
            Professional Summary
          </h2>
          <p className="text-gray-700">{cvData.personalInfo.summary}</p>
        </section>
      )}

      {cvData.workExperience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-gray-300 pb-2">
            Work Experience
          </h2>
          {cvData.workExperience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-semibold">{exp.position}</h3>
                  <p className="text-gray-600">{exp.company}</p>
                  {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
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
              {exp.achievements && exp.achievements.length > 0 && (
                <div className="mt-2">
                  <h4 className="font-medium text-gray-800 text-sm mb-1">Achievements:</h4>
                  <ul className="list-disc list-inside text-sm text-green-700">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Projects Section */}
      {cvData.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-gray-300 pb-2">
            Projects
          </h2>
          {cvData.projects.map((project, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-medium">{project.name}</h3>
                <span className="text-xs text-gray-500">
                  {project.startDate} {project.endDate && `- ${project.endDate}`}
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-1">{project.description}</p>
              {project.technologies.length > 0 && (
                <p className="text-xs text-blue-600 mb-1">
                  Technologies: {project.technologies.join(', ')}
                </p>
              )}
              <div className="flex items-center space-x-3">
                {project.url && (
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                    Live Demo
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-600 hover:underline">
                    GitHub
                  </a>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Certifications Section */}
      {cvData.certifications.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-gray-300 pb-2">
            Certifications
          </h2>
          {cvData.certifications.map((cert, index) => (
            <div key={index} className="mb-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-sm">{cert.name}</h3>
                  <p className="text-sm text-gray-600">{cert.issuer}</p>
                </div>
                <span className="text-xs text-gray-500">{cert.date}</span>
              </div>
              {cert.credentialId && (
                <p className="text-xs text-gray-500">Credential ID: {cert.credentialId}</p>
              )}
            </div>
          ))}
        </section>
      )}

      <div className="grid grid-cols-2 gap-8">
        {cvData.education.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-gray-300 pb-2">
              Education
            </h2>
            {cvData.education.map((edu, index) => (
              <div key={index} className="mb-3">
                <h3 className="font-medium">{edu.degree} in {edu.field}</h3>
                <p className="text-sm text-gray-600">{edu.institution}</p>
                <p className="text-sm text-gray-500">{edu.startDate} - {edu.endDate}</p>
                {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
                {edu.description && <p className="text-xs text-gray-600 mt-1">{edu.description}</p>}
              </div>
            ))}
          </section>
        )}

        {cvData.skills.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-gray-300 pb-2">
              Skills
            </h2>
            <div className="space-y-2">
              {['Technical', 'Soft', 'Language', 'Other'].map(category => {
                const categorySkills = cvData.skills.filter(skill => skill.category === category);
                if (categorySkills.length === 0) return null;
                
                return (
                  <div key={category}>
                    <h3 className="font-medium text-gray-800 text-sm mb-1">{category}</h3>
                    <div className="flex flex-wrap gap-1">
                      {categorySkills.map((skill, i) => (
                        <span key={i} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                          {skill.name} ({skill.level})
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CVPreview;