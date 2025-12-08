"use client"

import { RotateCcw } from "lucide-react"
import { useState, useMemo } from "react"

interface Props {
  winnersByPrize: { [key: string]: string[] }
  onReEnter: (name: string) => void
}

export default function WinnersPanel({ winnersByPrize, onReEnter }: Props) {
  const [selectedPrize, setSelectedPrize] = useState<string | null>(null)

  const totalWinners = Object.values(winnersByPrize).reduce((sum, winners) => sum + winners.length, 0)

  const filteredWinners = useMemo(() => {
    if (!selectedPrize || selectedPrize === "all") {
      const reversed = { ...winnersByPrize }
      Object.keys(reversed).forEach((prize) => {
        reversed[prize] = [...reversed[prize]].reverse()
      })
      return reversed
    }
    return {
      [selectedPrize]: [...(winnersByPrize[selectedPrize] || [])].reverse(),
    }
  }, [selectedPrize, winnersByPrize])

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 h-full flex flex-col shadow-sm overflow-hidden">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex-shrink-0">Winners</h2>

      {totalWinners > 0 && Object.keys(winnersByPrize).length > 1 && (
        <div className="mb-4 flex-shrink-0">
          <select
            value={selectedPrize || "all"}
            onChange={(e) => setSelectedPrize(e.target.value === "all" ? null : e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white pr-8 cursor-pointer"
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

      <div className="flex-1 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 min-h-0 pr-2">
        {totalWinners === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">No winners yet. Start spinning!</p>
        ) : (
          Object.entries(filteredWinners).map(([prize, names]) => (
            <div key={prize} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-blue-600 font-semibold mb-2 text-sm">Winners of {prize}</h3>
              <div className="space-y-1">
                {names.map((name) => (
                  <div
                    key={name}
                    className="flex items-center justify-between bg-white p-2 rounded border border-gray-200"
                  >
                    <span className="text-gray-900 text-xs">{name}</span>
                    <button
                      onClick={() => onReEnter(name)}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-1 flex-shrink-0 cursor-pointer"
                      title="Re-enter raffle"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 text-center text-gray-500 text-sm flex-shrink-0">
        {totalWinners} winner{totalWinners !== 1 ? "s" : ""}
      </div>
    </div>
  )
}
