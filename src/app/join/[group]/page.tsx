'use client';
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const SLOT_LABELS = {
  am: 'AM',
  pm: 'PM',
  l8: 'L8',
  allday: 'ALLDAY',
} as const;
type Slot = keyof typeof SLOT_LABELS;

interface Availability {
  date: string;
  slot: Slot;
}

interface Member {
  name: string;
  availability?: Availability[];
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function JoinGroupPage() {
  const params = useParams();
  const group = typeof params.group === 'string' ? params.group : Array.isArray(params.group) ? params.group[0] : '';
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [dateInput, setDateInput] = useState("");
  const [slotInput, setSlotInput] = useState<Slot>('allday');

  // Convert slug back to readable group name
  const groupName = group.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const storageKey = `group-members-${group}`;

  useEffect(() => {
    // Load members from localStorage
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed: Member[] = JSON.parse(saved);
      setMembers(parsed);
      // If the user has already joined, show the joined state and load their availability
      const user = parsed.find((m: Member) => m.name === name);
      if (user) {
        setJoined(true);
        setAvailability(user.availability || []);
      }
    }
  }, [group, name, storageKey]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const newMembers = [...members, { name, availability: [] }];
    setMembers(newMembers);
    localStorage.setItem(storageKey, JSON.stringify(newMembers));
    setJoined(true);
  };

  const handleAddDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateInput || availability.some(a => a.date === dateInput && a.slot === slotInput)) return;
    const newAvailability = [...availability, { date: dateInput, slot: slotInput }];
    setAvailability(newAvailability);
    // Update this member's availability in localStorage
    const updatedMembers = members.map(m =>
      m.name === name ? { ...m, availability: newAvailability } : m
    );
    setMembers(updatedMembers);
    localStorage.setItem(storageKey, JSON.stringify(updatedMembers));
    setDateInput("");
    setSlotInput('allday');
  };

  const handleDeleteAvailability = (date: string, slot: Slot) => {
    const newAvailability = availability.filter(a => !(a.date === date && a.slot === slot));
    setAvailability(newAvailability);
    // Update this member's availability in localStorage
    const updatedMembers = members.map(m =>
      m.name === name ? { ...m, availability: newAvailability } : m
    );
    setMembers(updatedMembers);
    localStorage.setItem(storageKey, JSON.stringify(updatedMembers));
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto p-4 gap-8">
      <div className="bg-black/95 rounded-2xl shadow-xl p-6 w-full flex flex-col items-center gap-6 border border-blue-100">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center w-full mb-2">
          Join Group: <span className="text-lime-400">{groupName}</span>
        </h2>
        {!joined ? (
          <form onSubmit={handleJoin} className="flex flex-col gap-4 w-full max-w-md mx-auto">
            <label className="font-semibold text-gray-300">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="border rounded-lg px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-lime-400 bg-gray-900 text-white placeholder-gray-400"
              placeholder="e.g. Alex"
              required
            />
            <button
              type="submit"
              className="bg-lime-500 hover:bg-lime-600 text-black font-bold py-2 px-6 rounded-lg mt-2 transition-colors"
            >
              Join Group
            </button>
          </form>
        ) : (
          <>
            {/* Availability Input */}
            <div className="mb-6 w-full">
              <h3 className="text-lg font-bold text-white mb-2 text-center">Your Availability</h3>
              <form onSubmit={handleAddDate} className="flex flex-col sm:flex-row gap-2 items-center justify-center mb-2">
                <div className="relative w-full">
                  <input
                    type="date"
                    value={dateInput}
                    onChange={e => setDateInput(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-lime-400 bg-gray-900 text-white placeholder-gray-400 w-full appearance-none"
                    required
                    style={{ colorScheme: 'dark' }}
                  />
                  {/* Lime green calendar icon overlay for better legibility */}
                  <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2" fill="#a3e635"/><path d="M8 2v4M16 2v4M3 9h18" stroke="#222" strokeWidth="2" strokeLinecap="round"/></svg>
                </div>
                <select
                  value={slotInput}
                  onChange={e => setSlotInput(e.target.value as Slot)}
                  className="border rounded-lg px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-lime-400 bg-gray-900 text-white w-full"
                  required
                >
                  <option value="am">AM</option>
                  <option value="pm">PM</option>
                  <option value="l8">L8</option>
                  <option value="allday">ALLDAY</option>
                </select>
                <button
                  type="submit"
                  className="bg-lime-500 hover:bg-lime-600 text-black font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Add
                </button>
              </form>
              <div className="flex flex-wrap gap-2 justify-center">
                {availability.length === 0 ? (
                  <span className="text-gray-400">No availability added yet.</span>
                ) : (
                  availability.map((a) => (
                    <span key={a.date + a.slot} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      {formatDate(a.date)} {SLOT_LABELS[a.slot]}
                      <button
                        className="ml-1 text-red-500 hover:text-red-700 font-bold focus:outline-none"
                        title="Delete"
                        onClick={() => handleDeleteAvailability(a.date, a.slot)}
                        type="button"
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Group Members List */}
            <div className="mb-2 w-full">
              <h3 className="text-lg font-bold text-white mb-2 text-center">Group Members:</h3>
              <ul className="text-gray-200">
                {members.map((m) => (
                  <li key={m.name} className="py-1">
                    <span className="font-semibold">{m.name}</span>
                    {(m.availability ?? []).length > 0 && (
                      <span className="ml-2 text-sm text-blue-300">(
                       {(m.availability ?? []).map((a, i, arr) => (
  <span key={a.date + a.slot}>
    {formatDate(a.date)} {SLOT_LABELS[a.slot]}{i < arr.length - 1 ? ', ' : ''}
  </span>
))}
                      )</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 