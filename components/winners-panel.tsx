'use client';

import { RotateCcw } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';

interface Props {
  winnersByPrize: { [key: string]: string[] };
  onReEnter: (name: string) => void;
}

export default function WinnersPanel({ winnersByPrize, onReEnter }: Props) {
  const [selectedPrize, setSelectedPrize] = useState<string | null>(null);

  const totalWinners = Object.values(winnersByPrize).reduce(
    (sum, winners) => sum + winners.length,
    0
  );

  const filteredWinners = useMemo(() => {
    if (!selectedPrize || selectedPrize === 'all') {
      const reversed = { ...winnersByPrize };
      Object.keys(reversed).forEach((prize) => {
        reversed[prize] = [...reversed[prize]].reverse();
      });
      return reversed;
    }
    return {
      [selectedPrize]: [...(winnersByPrize[selectedPrize] || [])].reverse(),
    };
  }, [selectedPrize, winnersByPrize]);

  // If the selectedPrize no longer exists (e.g. group was removed), reset to show all
  useEffect(() => {
    const prizes = Object.keys(winnersByPrize);
    if (selectedPrize && !prizes.includes(selectedPrize)) {
      setSelectedPrize(null);
    }
    // if there's only one prize group left, ensure selectedPrize is null so UI shows it correctly
    if (prizes.length <= 1) {
      setSelectedPrize(null);
    }
  }, [winnersByPrize, selectedPrize]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-9 shadow-sm">
      <h2 className="mb-6 flex-shrink-0 text-2xl font-bold text-gray-900">
        Winners
      </h2>

      {totalWinners > 0 && Object.keys(winnersByPrize).length > 1 && (
        <div className="mb-6 flex-shrink-0">
          <select
            value={selectedPrize || 'all'}
            onChange={(e) =>
              setSelectedPrize(e.target.value === 'all' ? null : e.target.value)
            }
            className="w-full cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 pr-8 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 8px center',
            }}
          >
            <option value="all">All Prizes</option>
            {Object.keys(winnersByPrize).map((prize) => (
              <option key={prize} value={prize}>
                {prize} ({winnersByPrize[prize].length})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 min-h-0 flex-1 space-y-6 overflow-y-auto pr-2">
        {totalWinners === 0 ? (
          <p className="py-12 text-center text-base text-gray-500">
            No winners yet. Start spinning!
          </p>
        ) : (
          Object.entries(filteredWinners).map(([prize, names]) => (
            <div
              key={prize}
              className="rounded-lg border border-gray-200 bg-gray-50 p-6"
            >
              <h3 className="mb-3 text-base font-semibold text-blue-600">
                Winners of {prize}
              </h3>
              <div className="space-y-2">
                {names.map((name) => (
                  <div
                    key={name}
                    className="flex items-center justify-between rounded border border-gray-200 bg-white p-3"
                  >
                    <span className="text-sm text-gray-900">{name}</span>
                    <button
                      onClick={() => onReEnter(name)}
                      className="flex-shrink-0 cursor-pointer p-1 text-gray-400 transition-colors hover:text-gray-600"
                      title="Re-enter raffle"
                    >
                      <RotateCcw className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 flex-shrink-0 text-center text-base text-gray-500">
        {totalWinners} winner{totalWinners !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
