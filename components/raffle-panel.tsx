"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

interface Props {
  participants: string[]
  onWinner: (name: string, prize: string) => void
}

export default function RafflePanel({ participants, onWinner }: Props) {
  const [prize, setPrize] = useState("")
  const [isSpinning, setIsSpinning] = useState(false)
  const [displayNames, setDisplayNames] = useState<string[]>(Array(5).fill(""))
  const { toast } = useToast()

  const handleSpin = () => {
    if (!prize.trim() || participants.length === 0 || isSpinning) return

    setIsSpinning(true)
    const initialNames = Array(5)
      .fill(null)
      .map(() => participants[Math.floor(Math.random() * participants.length)])
    setDisplayNames(initialNames)

    let spins = 0
    const maxSpins = 40
    const interval = setInterval(() => {
      setDisplayNames((prev) => {
        const newName = participants[Math.floor(Math.random() * participants.length)]
        return [newName, ...prev.slice(0, 4)]
      })
      spins++

      if (spins === maxSpins) {
        clearInterval(interval)
        const winnerIndex = Math.floor(Math.random() * participants.length)
        const winner = participants[winnerIndex]
        const finalNames = [
          participants[Math.floor(Math.random() * participants.length)],
          participants[Math.floor(Math.random() * participants.length)],
          winner,
          participants[Math.floor(Math.random() * participants.length)],
          participants[Math.floor(Math.random() * participants.length)],
        ]
        setDisplayNames(finalNames)
        setIsSpinning(false)

        setTimeout(() => {
          toast({
            title: "🎉 Winner!",
            description: `${winner} won ${prize}!`,
            variant: "default",
          })
          onWinner(winner, prize.trim())
        }, 500)
      }
    }, 30)
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 h-full flex flex-col items-center justify-center shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Spin the Raffle</h2>

      <div className="flex flex-col gap-3 mb-8 w-full">
        <div className="w-full h-20 bg-white/20 backdrop-blur-2xl rounded-lg border border-gray-300/30 flex items-center justify-center overflow-hidden shadow-sm" style={{ filter: 'blur(0.8px)' }}>
          <span className="text-gray-700 text-sm font-semibold text-center px-2 line-clamp-1">
            {displayNames[0] || "?"}
          </span>
        </div>

        <div className="w-full h-24 bg-white/20 backdrop-blur-2xl rounded-lg border border-gray-300/30 flex items-center justify-center overflow-hidden shadow-sm" style={{ filter: 'blur(0.8px)' }}>
          <span className="text-gray-700 text-base font-semibold text-center px-2 line-clamp-2">
            {displayNames[1] || "?"}
          </span>
        </div>

        <div className="w-full h-32 bg-gradient-to-r from-blue-500 to-blue-400 rounded-lg border-2 border-blue-300 flex items-center justify-center shadow-lg shadow-blue-200">
          <span className="text-white text-2xl font-extrabold text-center px-4 line-clamp-2 overflow-hidden break-words">
            {displayNames[2] || "?"}
          </span>
        </div>

        <div className="w-full h-24 bg-white/20 backdrop-blur-2xl rounded-lg border border-gray-300/30 flex items-center justify-center overflow-hidden shadow-sm" style={{ filter: 'blur(0.8px)' }}>
          <span className="text-gray-700 text-base font-semibold text-center px-2 line-clamp-2">
            {displayNames[3] || "?"}
          </span>
        </div>

        <div className="w-full h-20 bg-white/20 backdrop-blur-2xl rounded-lg border border-gray-300/30 flex items-center justify-center overflow-hidden shadow-sm" style={{ filter: 'blur(0.8px)' }}>
          <span className="text-gray-700 text-sm font-semibold text-center px-2 line-clamp-1">
            {displayNames[4] || "?"}
          </span>
        </div>
      </div>

      <Input
        placeholder="Enter prize name (e.g., iPhone)"
        value={prize}
        onChange={(e) => setPrize(e.target.value)}
        disabled={isSpinning}
        className="bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 mb-6 w-full h-12 text-lg px-4 cursor-pointer"
      />

      <Button
        onClick={handleSpin}
        disabled={isSpinning || !prize.trim() || participants.length === 0}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-6 w-full text-lg rounded-md cursor-pointer"
      >
        {isSpinning ? "Spinning..." : "Spin"}
      </Button>

      {participants.length === 0 && <p className="text-gray-500 text-sm mt-6">Add participants to start spinning</p>}
    </div>
  )
}
