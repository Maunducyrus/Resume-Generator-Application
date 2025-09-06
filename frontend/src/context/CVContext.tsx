import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { cvAPI } from '../services/api';
import type { CVData, CV, CVState } from '../types';
import toast from 'react-hot-toast';

interface CVContextType {
  state: CVState;
  setCurrentCV: (cv: CVData) => void;
  setSelectedTemplate: (templateId: string) => void;
  setCurrentStep: (step: number) => void;
  saveCV: (name: string, templateId: string, data: CVData, profession?: string) => Promise<CV>;
  updateCV: (id: string, updates: Partial<CV>) => Promise<CV>;
  deleteCV: (id: string) => Promise<void>;
  loadUserCVs: () => Promise<void>;
  resetCV: () => void;
}

const CVContext = createContext<CVContextType | undefined>(undefined);

type CVAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CURRENT_CV'; payload: CVData }
  | { type: 'SET_SELECTED_TEMPLATE'; payload: string }
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'SET_SAVED_CVS'; payload: CV[] }
  | { type: 'ADD_CV'; payload: CV }
  | { type: 'UPDATE_CV'; payload: CV }
  | { type: 'REMOVE_CV'; payload: string }
  | { type: 'RESET_CV' };

  // ✅ safe empty CV structure
const emptyCV: CVData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: '',
    summary: '',
  },
  education: [],
  workExperience: [],
  skills: [],
  projects: [],
  certifications: [], // added certifications section
};

const cvReducer = (state: CVState, action: CVAction): CVState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_CURRENT_CV':
      return { ...state, currentCV: action.payload };
    case 'SET_SELECTED_TEMPLATE':
      return { ...state, selectedTemplate: action.payload };
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_SAVED_CVS':
      return { ...state, savedCVs: action.payload };
    case 'ADD_CV':
      return { ...state, savedCVs: [action.payload, ...state.savedCVs] };
    case 'UPDATE_CV':
      return {
        ...state,
        savedCVs: state.savedCVs.map(cv => cv.id === action.payload.id ? action.payload : cv)
      };
    case 'REMOVE_CV':
      return {
        ...state,
        savedCVs: state.savedCVs.filter(cv => cv.id !== action.payload)
      };
    case 'RESET_CV':
      return {
        ...state,
        currentCV: emptyCV, // reset to safe empty CV
        selectedTemplate: null,
        currentStep: 1
      };
    default:
      return state;
  }
};

const initialState: CVState = {
  currentCV: emptyCV, // start with a safe empty CV
  selectedTemplate: null,
  currentStep: 1,
  isLoading: false,
  savedCVs: [],
};

export const CVProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cvReducer, initialState);

  const setCurrentCV = (cv: CVData) => {
    dispatch({ type: 'SET_CURRENT_CV', payload: cv });
  };

  const setSelectedTemplate = (templateId: string) => {
    dispatch({ type: 'SET_SELECTED_TEMPLATE', payload: templateId });
  };

  const setCurrentStep = (step: number) => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: step });
  };

  const saveCV = async (name: string, templateId: string, data: CVData, profession?: string): Promise<CV> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const cv = await cvAPI.createCV({ name, templateId, data, profession });
      dispatch({ type: 'ADD_CV', payload: cv });
      toast.success('CV saved successfully!');
      return cv;
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateCV = async (id: string, updates: Partial<CV>): Promise<CV> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const cv = await cvAPI.updateCV(id, updates);
      dispatch({ type: 'UPDATE_CV', payload: cv });
      toast.success('CV updated successfully!');
      return cv;
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteCV = async (id: string): Promise<void> => {
    try {
      await cvAPI.deleteCV(id);
      dispatch({ type: 'REMOVE_CV', payload: id });
      toast.success('CV deleted successfully!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const loadUserCVs = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { cvs } = await cvAPI.getUserCVs();
      dispatch({ type: 'SET_SAVED_CVS', payload: cvs });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const resetCV = () => {
    dispatch({ type: 'RESET_CV' });
  };

  return (
    <CVContext.Provider value={{
      state,
      setCurrentCV,
      setSelectedTemplate,
      setCurrentStep,
      saveCV,
      updateCV,
      deleteCV,
      loadUserCVs,
      resetCV,
    }}>
      {children}
    </CVContext.Provider>
  );
};

export const useCV = () => {
  const context = useContext(CVContext);
  if (context === undefined) {
    throw new Error('useCV must be used within a CVProvider');
  }
  return context;
};