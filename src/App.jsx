"use client";

import { useState, useEffect } from "react";
import Form from "./Components/FormComponent";
import GroupsDisplay from "./Components/GroupsDisplay";

export default function App() {
  const [currentView, setCurrentView] = useState("form");
  const [userJoined, setUserJoined] = useState(false);

  // Restore user state on mount
  useEffect(() => {
    const joined = localStorage.getItem("assignedGroup");
    if (joined) {
      setUserJoined(true);
      setCurrentView("groups");
    }
  }, []);

  const handleJoinSuccess = () => {
    setUserJoined(true);
    setCurrentView("groups");
  };

  const handleViewGroups = () => {
    setCurrentView("groups");
  };

  const handleBackToForm = () => {
    setCurrentView("form");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-yellow-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-2">
            🧺Gladiators Summer Picnic 
          </h1>
          <p className="text-lg text-green-700">Join a color group and see who's coming to the picnic!</p>
        </header>

        {currentView === "form" ? (
          <Form
            onJoinSuccess={handleJoinSuccess}
            onViewGroups={handleViewGroups}
            userJoined={userJoined}
          />
        ) : (
          <GroupsDisplay onBackToForm={handleBackToForm} />
        )}
      </div>
      <footer className="text-center text-sm text-gray-600 mt-12 pb-4">
  Built by <span className="font-semibold text-green-700">Tekuvo(e-xxxl)</span> © 2025
</footer>
    </div>
  );
}