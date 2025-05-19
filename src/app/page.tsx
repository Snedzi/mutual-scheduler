'use client';
import React, { useState } from "react";

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [joinLink, setJoinLink] = useState("");
  const [showJoinInfo, setShowJoinInfo] = useState(false);

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, generate a simple joining link with the group name (slugified)
    const slug = groupName.trim().toLowerCase().replace(/\s+/g, "-");
    const link = `${window.location.origin}/join/${slug}`;
    setJoinLink(link);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xs mx-auto p-2 gap-4 mt-2">
      <button
        className="bg-white text-black font-bold py-3 px-6 rounded-lg shadow-md text-lg transition-colors w-full border border-black hover:bg-gray-100"
        onClick={() => setShowForm(true)}
      >
        Create a Group
      </button>
      <button
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-md text-lg transition-colors w-full"
        onClick={() => setShowJoinInfo(true)}
      >
        Join a Group
      </button>

      {/* Create Group Form Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-10">
          <div className="bg-black rounded-2xl shadow-2xl p-8 w-full max-w-md relative border border-blue-200">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold"
              onClick={() => {
                setShowForm(false);
                setGroupName("");
                setJoinLink("");
              }}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 text-white">Create a Group</h2>
            {!joinLink ? (
              <form onSubmit={handleCreateGroup} className="flex flex-col gap-4">
                <label className="font-semibold text-gray-300">Group Name</label>
                <input
                  type="text"
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-lime-400 bg-gray-900 text-white placeholder-gray-400"
                  placeholder="e.g. Friday Night Crew"
                  required
                />
                <button
                  type="submit"
                  className="bg-lime-500 hover:bg-lime-600 text-black font-bold py-2 px-6 rounded-lg mt-2 transition-colors"
                >
                  Generate Joining Link
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <p className="text-green-400 font-semibold">Group created! Share this link:</p>
                <input
                  type="text"
                  value={joinLink}
                  readOnly
                  className="border rounded-lg px-3 py-2 text-lg w-full text-center bg-gray-100"
                  onFocus={e => e.target.select()}
                />
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg"
                  onClick={() => {
                    setShowForm(false);
                    setGroupName("");
                    setJoinLink("");
                  }}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Join Group Info Modal */}
      {showJoinInfo && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-10">
          <div className="bg-black rounded-2xl shadow-2xl p-8 w-full max-w-md relative text-center border border-lime-400">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setShowJoinInfo(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 text-lime-400">You&apos;ll need an invite, loser.</h2>
            <p className="text-white text-lg mb-4">Go make some friends!<br/>(The invite is a direct URL, which the Group owner can send you.)</p>
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg mt-2"
              onClick={() => setShowJoinInfo(false)}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
