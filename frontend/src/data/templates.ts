import type { Template } from '../types';

export const templates: Template[] = [
  // Professional Templates
  {
    id: 'modern-professional',
    name: 'Modern Professional',
    description: 'Clean, modern design perfect for corporate environments and traditional industries.',
    category: 'Professional',
    preview: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPremium: false,
    professions: ['Manager', 'Consultant', 'Analyst', 'Director', 'Executive'],
    features: ['ATS-Friendly', 'Clean Layout', 'Professional Typography']
  },
  {
    id: 'executive-classic',
    name: 'Executive Classic',
    description: 'Sophisticated design for senior-level positions and executive roles.',
    category: 'Professional',
    preview: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPremium: true,
    professions: ['CEO', 'CTO', 'VP', 'Director', 'Senior Manager'],
    features: ['Executive Layout', 'Premium Design', 'Leadership Focus']
  },
  {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    description: 'Professional blue-themed template ideal for finance and consulting.',
    category: 'Professional',
    preview: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPremium: false,
    professions: ['Financial Analyst', 'Consultant', 'Accountant', 'Investment Banker'],
    features: ['Corporate Colors', 'Financial Focus', 'Clean Structure']
  },

  // Minimal Templates
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    description: 'Ultra-clean design with focus on content and readability.',
    category: 'Minimal',
    preview: 'https://images.pexels.com/photos/590024/pexels-photo-590024.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPremium: false,
    professions: ['Designer', 'Writer', 'Researcher', 'Academic'],
    features: ['Minimal Design', 'Typography Focus', 'White Space']
  },
  {
    id: 'simple-elegant',
    name: 'Simple Elegant',
    description: 'Elegant simplicity with subtle design elements.',
    category: 'Minimal',
    preview: 'https://images.pexels.com/photos/590026/pexels-photo-590026.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPremium: false,
    professions: ['Product Manager', 'Business Analyst', 'Coordinator'],
    features: ['Elegant Typography', 'Subtle Accents', 'Clean Layout']
  },
  {
    id: 'minimalist-pro',
    name: 'Minimalist Pro',
    description: 'Professional minimalism with strategic use of space.',
    category: 'Minimal',
    preview: 'https://images.pexels.com/photos/590028/pexels-photo-590028.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPremium: true,
    professions: ['Architect', 'Designer', 'Consultant', 'Strategist'],
    features: ['Strategic Layout', 'Premium Typography', 'Minimal Aesthetics']
  },

  // Creative Templates
  {
    id: 'creative-modern',
    name: 'Creative Modern',
    description: 'Bold, creative design for artistic and design professionals.',
    category: 'Creative',
    preview: 'https://images.pexels.com/photos/590030/pexels-photo-590030.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPremium: false,
    professions: ['Graphic Designer', 'Artist', 'Creative Director', 'Photographer'],
    features: ['Creative Layout', 'Visual Elements', 'Artistic Design']
  },
  {
    id: 'designer-portfolio',
    name: 'Designer Portfolio',
    description: 'Portfolio-style layout perfect for showcasing creative work.',
    category: 'Creative',
    preview: 'https://images.pexels.com/photos/590032/pexels-photo-590032.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPremium: true,
    professions: ['UX Designer', 'UI Designer', 'Web Designer', 'Creative Director'],
    features: ['Portfolio Layout', 'Project Showcase', 'Visual Hierarchy']
  },
  {
    id: 'artistic-flair',
    name: 'Artistic Flair',
    description: 'Unique artistic design with creative typography and layout.',
    category: 'Creative',
    preview: 'https://images.pexels.com/photos/590034/pexels-photo-590034.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPremium: true,
    professions: ['Artist', 'Illustrator', 'Creative Writer', 'Art Director'],
    features: ['Artistic Elements', 'Creative Typography', 'Unique Layout']
  },

  // Tech Templates
  {
    id: 'tech-modern',
    name: 'Tech Modern',
    description: 'Modern tech-focused design with clean code aesthetics.',
    category: 'Tech',
    preview: 'https://images.pexels.com/photos/590036/pexels-photo-590036.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPremium: false,
    professions: ['Software Engineer', 'Developer', 'DevOps Engineer', 'Data Scientist'],
    features: ['Tech-Focused', 'Code Aesthetics', 'Modern Layout']
  },
  {
    id: 'developer-pro',
    name: 'Developer Pro',
    description: 'Professional template designed specifically for software developers.',
    category: 'Tech',
    preview: 'https://images.pexels.com/photos/590038/pexels-photo-590038.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPremium: true,
    professions: ['Full Stack Developer', 'Backend Developer', 'Frontend Developer', 'Mobile Developer'],
    features: ['Developer Focus', 'Skills Highlight', 'Project Showcase']
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    description: 'Analytical design perfect for data science and research roles.',
    category: 'Tech',
    preview: 'https://images.pexels.com/photos/590040/pexels-photo-590040.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPremium: true,
    professions: ['Data Scientist', 'Data Analyst', 'Machine Learning Engineer', 'Research Scientist'],
    features: ['Data Focus', 'Research Layout', 'Analytics Design']
  },

  // Academic Templates
  {
    id: 'academic-research',
    name: 'Academic Research',
    description: 'Traditional academic format for research and educational positions.',
    category: 'Academic',
    preview: 'https://images.pexels.com/photos/590042/pexels-photo-590042.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPremium: false,
    professions: ['Professor', 'Researcher', 'PhD Student', 'Academic'],
    features: ['Academic Format', 'Publication Focus', 'Research Emphasis']
  },
  {
    id: 'university-faculty',
    name: 'University Faculty',
    description: 'Comprehensive academic template for faculty positions.',
    category: 'Academic',
    preview: 'https://images.pexels.com/photos/590044/pexels-photo-590044.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPremium: true,
    professions: ['Professor', 'Associate Professor', 'Lecturer', 'Department Head'],
    features: ['Faculty Layout', 'Teaching Focus', 'Academic Achievements']
  },

  // Healthcare Templates
  {
    id: 'medical-professional',
    name: 'Medical Professional',
    description: 'Clean, professional design for healthcare professionals.',
    category: 'Healthcare',
    preview: 'https://images.pexels.com/photos/590046/pexels-photo-590046.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPremium: false,
    professions: ['Doctor', 'Nurse', 'Medical Assistant', 'Healthcare Administrator'],
    features: ['Medical Focus', 'Certification Emphasis', 'Professional Layout']
  },
  {
    id: 'healthcare-executive',
    name: 'Healthcare Executive',
    description: 'Executive-level template for healthcare leadership roles.',
    category: 'Healthcare',
    preview: 'https://images.pexels.com/photos/590048/pexels-photo-590048.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPremium: true,
    professions: ['Chief Medical Officer', 'Hospital Administrator', 'Healthcare Director'],
    features: ['Executive Design', 'Leadership Focus', 'Healthcare Specific']
  },

  // Sales & Marketing Templates
  {
    id: 'sales-professional',
    name: 'Sales Professional',
    description: 'Dynamic design highlighting sales achievements and results.',
    category: 'Sales',
    preview: 'https://images.pexels.com/photos/590050/pexels-photo-590050.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPremium: false,
    professions: ['Sales Representative', 'Account Manager', 'Sales Director', 'Business Development'],
    features: ['Results Focus', 'Achievement Highlight', 'Dynamic Layout']
  },
  {
    id: 'marketing-creative',
    name: 'Marketing Creative',
    description: 'Creative marketing template with brand-focused design.',
    category: 'Marketing',
    preview: 'https://images.pexels.com/photos/590052/pexels-photo-590052.jpeg?auto=compress&cs=tinysrgb&w=400',
    isPremium: true,
    professions: ['Marketing Manager', 'Brand Manager', 'Digital Marketer', 'Content Creator'],
    features: ['Brand Focus', 'Creative Elements', 'Marketing Specific']
  }
];

export const getTemplatesByCategory = (category: string): Template[] => {
  return templates.filter(template => template.category === category);
};

export const getTemplatesByProfession = (profession: string): Template[] => {
  return templates.filter(template => 
    template.professions.some(p => 
      p.toLowerCase().includes(profession.toLowerCase()) || 
      profession.toLowerCase().includes(p.toLowerCase())
    )
  );
};

export const getTemplateById = (id: string): Template | undefined => {
  return templates.find(template => template.id === id);
};

export const templateCategories = [
  'All',
  'Professional',
  'Minimal',
  'Creative',
  'Tech',
  'Academic',
  'Healthcare',
  'Sales',
  'Marketing'
];