import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Menu, X, User, LogOut, Settings } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ProfileModal from "../Profile/ProfileModal";

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { state: authState, logout } = useAuth();

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "builder", label: "CV Builder", icon: "✏️" },
    { id: "templates", label: "Templates", icon: "🎨" },
    { id: "ai-tools", label: "AI Tools", icon: "🤖" },
  ];

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    onViewChange("dashboard");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900">
              AI CV Builder
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === item.id
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Profile Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium">
                  {authState.user?.name}
                </span>
              </button>

              {isProfileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border"
                >
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setShowProfileModal(true);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Profile Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 bg-white"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors ${
                    currentView === item.id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center px-3 py-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    {authState.user?.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </header>
  );
};

export default Header;
