// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CVProvider } from "./context/CVContext";
import Header from "./components/Layout/Header";
import Dashboard from "./components/Dashboard/Dashboard";
import CVBuilder from "./components/CVBuilder/CVBuilder";
import TemplateGallery from "./components/Templates/TemplateGallery";
import AITools from "./components/AITools/AITools";
import AuthModal from "./components/Auth/AuthModal";
import LandingPage from "./components/Landing/LandingPage";

function AppContent() {
  const [currentView, setCurrentView] = useState("landing");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { state: authState } = useAuth();

  const renderCurrentView = () => {
    if (!authState.isAuthenticated) {
      return (
        <LandingPage
          onGetStarted={() => setShowAuthModal(true)}
          onLogin={() => setShowAuthModal(true)}
        />
      );
    }

    switch (currentView) {
      case "dashboard":
        return <Dashboard onViewChange={setCurrentView} />;
      case "builder":
        return <CVBuilder onViewChange={setCurrentView} />;
      case "templates":
        return <TemplateGallery onViewChange={setCurrentView} />;
      case "ai-tools":
        return <AITools />;
      default:
        return <Dashboard onViewChange={setCurrentView} />;
    }
  };

  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {authState.isAuthenticated && (
        <Header currentView={currentView} onViewChange={setCurrentView} />
      )}
      <main>{renderCurrentView()}</main>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CVProvider>
        <AppContent />
      </CVProvider>
    </AuthProvider>
  );
}

export default App;
