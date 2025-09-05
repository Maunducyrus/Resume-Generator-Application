import React, { useState } from 'react';
import { Plus, Trash2, Award, ExternalLink, Github } from 'lucide-react';
import { useCV } from '../../../context/CVContext';
import type { Project } from '../../../types';

const ProjectsStep: React.FC = () => {
  const { state: cvState, setCurrentCV } = useCV();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const projects = cvState.currentCV?.projects || [];

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
      url: '',
      github: '',
      startDate: '',
      endDate: ''
    };

    const updatedCV = {
      ...cvState.currentCV,
      projects: [...projects, newProject]
    };
    setCurrentCV(updatedCV as any);
    setEditingIndex(projects.length);
  };

  const updateProject = (index: number, field: keyof Project, value: any) => {
    const updatedProjects = projects.map((project, i) => 
      i === index ? { ...project, [field]: value } : project
    );
    
    const updatedCV = {
      ...cvState.currentCV,
      projects: updatedProjects
    };
    setCurrentCV(updatedCV as any);
  };

  const removeProject = (index: number) => {
    const updatedProjects = projects.filter((_, i) => i !== index);
    const updatedCV = {
      ...cvState.currentCV,
      projects: updatedProjects
    };
    setCurrentCV(updatedCV as any);
    setEditingIndex(null);
  };

  const addTechnology = (projectIndex: number, technology: string) => {
    if (!technology.trim()) return;
    
    const project = projects[projectIndex];
    const updatedTechnologies = [...project.technologies, technology.trim()];
    updateProject(projectIndex, 'technologies', updatedTechnologies);
  };

  const removeTechnology = (projectIndex: number, techIndex: number) => {
    const project = projects[projectIndex];
    const updatedTechnologies = project.technologies.filter((_, i) => i !== techIndex);
    updateProject(projectIndex, 'technologies', updatedTechnologies);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Projects</h3>
        <p className="text-gray-600 mb-6">
          Showcase your personal projects, open-source contributions, and side projects that demonstrate your skills.
        </p>
      </div>

      <div className="space-y-4">
        {projects.map((project, index) => (
          <div key={project.id} className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Award className="h-5 w-5 text-blue-600 mr-2" />
                <h4 className="font-medium text-gray-900">
                  {project.name || 'New Project'}
                </h4>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  {editingIndex === index ? 'Collapse' : 'Edit'}
                </button>
                <button
                  onClick={() => removeProject(index)}
                  className="text-red-600 hover:text-red-700"
                  title='Remove Project'
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
                      Project Name *
                    </label>
                    <input
                      type="text"
                      value={project.name}
                      onChange={(e) => updateProject(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="E-commerce Website"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project URL
                    </label>
                    <div className="relative">
                      <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="url"
                        value={project.url}
                        onChange={(e) => updateProject(index, 'url', e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://myproject.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GitHub Repository
                    </label>
                    <div className="relative">
                      <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="url"
                        value={project.github}
                        onChange={(e) => updateProject(index, 'github', e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://github.com/username/project"
                      />
                    </div>
                  </div>

                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="month"
                      value={project.startDate}
                      onChange={(e) => updateProject(index, 'startDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div> */}
                <div>
                  <label 
                    htmlFor={`project-startDate-${index}`} 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Start Date
                  </label>
                  <input
                    id={`project-startDate-${index}`}
                    type="month"
                    value={project.startDate}
                    onChange={(e) => updateProject(index, 'startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Project start date"
                  />
                </div>

                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date (Optional)
                    </label>
                    <input
                      type="month"
                      value={project.endDate}
                      onChange={(e) => updateProject(index, 'endDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div> */}
                    <div>
                      <label 
                        htmlFor={`project-endDate-${index}`} 
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        End Date (Optional)
                      </label>
                      <input
                        id={`project-endDate-${index}`}
                        type="month"
                        value={project.endDate}
                        onChange={(e) => updateProject(index, 'endDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        aria-label="Project end date (optional)"
                      />
                    </div>              
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={project.description}
                    onChange={(e) => updateProject(index, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe what the project does, your role, and key achievements..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Technologies Used
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {tech}
                        <button
                          onClick={() => removeTechnology(index, techIndex)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Add technology (e.g., React, Node.js)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addTechnology(index, e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <button
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        addTechnology(index, input.value);
                        input.value = '';
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}

            {editingIndex !== index && project.name && (
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-900">{project.name}</p>
                <p className="mt-1">{project.description}</p>
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center space-x-4 mt-2">
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-700"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Live Demo
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-600 hover:text-gray-700"
                    >
                      <Github className="h-3 w-3 mr-1" />
                      Source Code
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        <button
          onClick={addProject}
          className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Project
        </button>
      </div>

      {projects.length === 0 && (
        <div className="text-center py-8">
          <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects added yet</h3>
          <p className="text-gray-600 mb-4">
            Projects are optional but highly recommended to showcase your skills
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectsStep;