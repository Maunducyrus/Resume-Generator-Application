export interface User {
  id: string;
  name: string;
  email: string;
  profession?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  location: string;
  responsibilities: string[];
  achievements?: string[];
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: 'Technical' | 'Soft' | 'Language' | 'Other';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
  startDate: string;
  endDate?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  education: Education[];
  workExperience: WorkExperience[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
}

export interface CV {
  id: string;
  userId: string;
  name: string;
  templateId: string;
  data: CVData;
  atsScore: number;
  isPublic: boolean;
  shareUrl?: string;
  downloadCount: number;
  profession?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string;
  isPremium: boolean;
  professions: string[];
  features: string[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export interface CVState {
  currentCV: CVData | null;
  selectedTemplate: string | null;
  currentStep: number;
  isLoading: boolean;
  savedCVs: CV[];
}

export interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

export interface ATSResult {
  score: number;
  suggestions: string[];
}

export interface JobOptimization {
  keywords: string[];
  skillSuggestions: string[];
  experienceImprovements: string[];
  summaryImprovement: string;
  missingQualifications: string[];
  overallScore: number;
}