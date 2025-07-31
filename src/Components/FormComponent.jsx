"use client";

import { useState, useEffect } from "react";

export default function FormComponent({ onJoinSuccess, onViewGroups, userJoined }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [assignedGroup, setAssignedGroup] = useState("");

  // Persist name input on component mount if previously entered
  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    if (savedName) setName(savedName);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Please enter your name");
      return;
    }

    if (trimmedName.length > 50) {
      setError("Name must be less than 50 characters");
      return;
    }

    if (userJoined) {
      setError("You have already joined a group!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: trimmedName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to join group");
      }

      setAssignedGroup(data.group);
      localStorage.setItem("userName", trimmedName);
      localStorage.setItem("assignedGroup", data.group);

      setTimeout(() => {
        onJoinSuccess();
      }, 1500);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      console.error("Join error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (assignedGroup) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center border-4 border-green-200">
          <div className="text-6xl mb-4" role="img" aria-label="Celebration">
            🎉
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-4">
            Welcome to the {assignedGroup} Group!
          </h2>
          <p className="text-green-700 mb-6">
            You've been assigned to the{" "}
            <span
              className={`font-bold ${
                assignedGroup === "Red"
                  ? "text-red-600"
                  : assignedGroup === "Blue"
                    ? "text-blue-600"
                    : assignedGroup === "Green"
                      ? "text-green-600"
                      : "text-yellow-600"
              }`}
            >
              {assignedGroup}
            </span>{" "}
            group. Get ready to meet after 2 years!
          </p>
          <div className="animate-pulse text-green-600">Redirecting to groups view...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8 border-4 border-green-200">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2" role="img" aria-label="Sun">
            🌞
          </div>
          <h2 className="text-2xl font-bold text-green-800">Join the Picnic!</h2>
          <p className="text-green-700 mt-2">Enter your name to be assigned to a group</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-green-800 mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors text-green-800 placeholder-green-400"
              placeholder="Enter your name..."
              disabled={loading}
              maxLength={50}
              aria-describedby="name-error"
            />
            {error && (
              <div
                id="name-error"
                className="bg-red-100 border-2 border-red-200 rounded-xl p-3 text-red-700 text-sm mt-2"
                role="alert"
              >
                {error}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || userJoined}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
            aria-busy={loading ? "true" : "false"}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Joining Group...
              </div>
            ) : userJoined ? (
              "Already Joined!"
            ) : (
              "🎪 Join a Group!"
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t-2 border-green-200">
          <button
            onClick={onViewGroups}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            👥 View All Groups
          </button>
        </div>
      </div>
    </div>
  );
}