"use client";

import { useState, useEffect } from "react";

export default function GroupsDisplay({ onBackToForm }) {
  const [groups, setGroups] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchGroups = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://g-backend-4jrl.onrender.com/api/groups");

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to fetch groups");
      }

      const data = await response.json();
      setGroups(data.groups);
    } catch (err) {
      setError(err.message || "Failed to load groups. Please try again later.");
      console.error("Error fetching groups:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const getGroupConfig = (groupName) => {
    const configs = {
      Red: {
        bg: "bg-red-50",
        border: "border-red-200",
        header: "bg-gradient-to-r from-red-500 to-red-600",
        text: "text-red-800",
        borderAccent: "border-red-400",
        emoji: "🍎",
      },
      Blue: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        header: "bg-gradient-to-r from-blue-500 to-blue-600",
        text: "text-blue-800",
        borderAccent: "border-blue-400",
        emoji: "🔵",
      },
      Black: {
        bg: "bg-gray-900",
        border: "border-gray-700",
        header: "bg-gradient-to-r from-gray-800 to-black",
        text: "text-black",
        borderAccent: "border-white",
        emoji: "⚫",
      },
      Orange: {
        bg: "bg-orange-50",
        border: "border-orange-200",
        header: "bg-gradient-to-r from-orange-500 to-orange-600",
        text: "text-orange-800",
        borderAccent: "border-orange-400",
        emoji: "🍊",
      },
    };
    return configs[groupName] || configs.Red;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-red-700 text-lg">Loading picnic groups...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-red-100 border-2 border-red-200 rounded-xl p-6 text-center">
          <div className="text-4xl mb-4" role="img" aria-label="Error">
            😕
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchGroups}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-red-800">🎪 Picnic Groups</h2>
          <p className="text-red-700">See who's in each group for the summer picnic!</p>
        </div>
        <button
          onClick={onBackToForm}
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          ← Back to Form
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(groups).map(([groupName, members]) => {
          const config = getGroupConfig(groupName);

          return (
            <div
              key={groupName}
              className={`${config.bg} ${config.border} border-4 rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-200`}
            >
              <div className={`${config.header} text-white p-4 text-center`}>
                <div className="text-3xl mb-2" role="img" aria-label={groupName}>
                  {config.emoji}
                </div>
                <h3 className="text-xl font-bold">{groupName} Group</h3>
                <p className="text-sm opacity-90">
                  {members.length} member{members.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="p-4">
                {members.length > 0 ? (
                  <ul className="space-y-2">
                    {members.map((member, index) => (
                      <li
                        key={index}
                        className={`${config.text} bg-white rounded-lg p-3 shadow-sm border-l-4 ${config.borderAccent} font-medium`}
                      >
                        👤 {member}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className={`${config.text} text-center py-4 opacity-60`}>
                    <div className="text-2xl mb-2" role="img" aria-label="No members">
                      🤷‍♀️
                    </div>
                    <p>No members yet</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={fetchGroups}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          🔄 Refresh Groups
        </button>
      </div>
    </div>
  );
}
