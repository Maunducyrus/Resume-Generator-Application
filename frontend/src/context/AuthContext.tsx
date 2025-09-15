import React, { createContext, useContext, useReducer, useEffect } from "react";
import { authAPI } from "../services/api";
import type { User, AuthState } from "../types";
import toast from "react-hot-toast";

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    profession?: string,
  ) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  changePassword: (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: { user: User; token: string } }
  | { type: "CLEAR_USER" }
  | { type: "UPDATE_USER"; payload: User };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_USER":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
      };
    case "CLEAR_USER":
      return {
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: true,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          dispatch({ type: "SET_USER", payload: { user, token } });

          // Verify token is still valid
          await authAPI.getProfile();
        } catch (error) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          dispatch({ type: "CLEAR_USER" });
        }
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const { user, token } = await authAPI.login({ email, password });

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      dispatch({ type: "SET_USER", payload: { user, token } });
      toast.success("Login successful!");
    } catch (error: any) {
      dispatch({ type: "SET_LOADING", payload: false });
      toast.error(error.message);
      throw error;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    profession?: string,
  ) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const { user, token } = await authAPI.register({
        name,
        email,
        password,
        profession,
      });

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      dispatch({ type: "SET_USER", payload: { user, token } });
      toast.success("Registration successful!");
    } catch (error: any) {
      dispatch({ type: "SET_LOADING", payload: false });
      toast.error(error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: "CLEAR_USER" });
    toast.success("Logged out successfully");
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      const updatedUser = await authAPI.updateProfile(userData);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      dispatch({ type: "UPDATE_USER", payload: updatedUser });
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const changePassword = async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => {
    try {
      const result = await authAPI.changePassword(passwordData);
      toast.success("Password changed successfully");
      return result;
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ state, login, register, logout, updateProfile, changePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
