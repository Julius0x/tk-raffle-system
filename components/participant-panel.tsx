'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Props {
  participants: string[];
  onAddParticipant: (name: string) => void;
  onDeleteParticipant: (name: string) => void;
  onDeleteAll?: () => void; // <-- added
  winnerMap?: { [key: string]: string };
}

export default function ParticipantPanel({
  participants,
  onAddParticipant,
  onDeleteParticipant,
  onDeleteAll,
  winnerMap = {},
}: Props) {
  const [newName, setNewName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleAddClick = () => {
    const trimmedName = newName.trim();

    if (!trimmedName) {
      toast({
        title: '❌ Error',
        description: 'Please enter a participant name',
        variant: 'destructive',
      });
      return;
    }

    const isDuplicate = participants.some(
      (p) => p.toLowerCase() === trimmedName.toLowerCase()
    );
    if (isDuplicate) {
      toast({
        title: '❌ Duplicate Name',
        description: `${trimmedName} is already a participant!`,
        variant: 'destructive',
      });
      return;
    }

    onAddParticipant(trimmedName);
    setNewName('');
  };

  const filteredParticipants = participants.filter((p) => {
    const prize = winnerMap[p];
    const displayText = prize ? `${p} - won ${prize}` : p;
    const searchLower = searchTerm.toLowerCase().trim();
    const displayLower = displayText.toLowerCase();

    if (!searchLower) return true;

    const searchWords = searchLower.split(/\s+/).filter((w) => w.length > 0);
    return searchWords.every((word) => displayLower.includes(word));
  });

  return (
    <div className="flex h-full min-h-full flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-2xl font-bold text-gray-900">Participants</h2>

      <div className="mb-4 flex gap-3">
        <Input
          placeholder="Enter name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddClick()}
          className="h-13 flex-1 cursor-pointer border-gray-300 bg-gray-50 text-xl! text-gray-900 placeholder-gray-400"
        />
        <Button
          onClick={handleAddClick}
          size="icon"
          className="h-13 w-13 flex-shrink-0 cursor-pointer text-white"
          style={{ backgroundColor: '#d14124' }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute top-3.5 left-3 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-13 cursor-pointer border-gray-300 bg-gray-50 pl-12 text-lg text-xl! text-gray-900 placeholder-gray-400"
        />
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-2">
        {filteredParticipants.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-400">
            No participants
          </p>
        ) : (
          filteredParticipants.map((participant) => {
            const prize = winnerMap[participant];
            const prizeDisplay = prize ? `won ${prize}` : '';

            return (
              <div
                key={participant}
                className={`flex cursor-pointer items-center justify-between rounded-lg p-3 transition-colors ${
                  prize
                    ? 'bg-green-50 hover:bg-green-100'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex-1">
                  <span
                    className={`block text-base font-medium ${
                      prize ? 'text-green-700' : 'text-gray-900'
                    }`}
                  >
                    {participant}
                  </span>
                  {prizeDisplay && (
                    <span className="block text-sm text-green-600">
                      {prizeDisplay}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => onDeleteParticipant(participant)}
                  className="ml-2 shrink-0 cursor-pointer text-red-500 transition-colors hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* 🔥 DELETE ALL BUTTON ADDED HERE */}
      {participants.length > 0 && (
        <Button
          onClick={() => onDeleteAll && onDeleteAll()}
          variant="destructive"
          className="mt-4 h-12 w-full flex items-center justify-center gap-2 cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
          Delete All
        </Button>
      )}

      <div className="mt-3 text-center text-base text-gray-500">
        {participants.length} participant{participants.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
