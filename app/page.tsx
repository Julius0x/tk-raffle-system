"use client"

import { useState, useEffect, useMemo } from "react"
import ParticipantPanel from "@/components/participant-panel"
import RafflePanel from "@/components/raffle-panel"
import WinnersPanel from "@/components/winners-panel"
import { names } from "@/lib/names"
import { useToast } from "@/hooks/use-toast"

interface Winner {
  name: string
  prize: string
  timestamp: number
}

export default function RafflePage() {
  const [participants, setParticipants] = useState<string[]>([])
  const [winners, setWinners] = useState<Winner[]>([])
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const savedParticipants = localStorage.getItem("participants")
    const savedWinners = localStorage.getItem("winners")

    if (savedParticipants) {
      setParticipants(JSON.parse(savedParticipants))
    } else {
      setParticipants(names)
    }

    if (savedWinners) {
      setWinners(JSON.parse(savedWinners))
    }

    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("participants", JSON.stringify(participants))
    }
  }, [participants, mounted])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("winners", JSON.stringify(winners))
    }
  }, [winners, mounted])

  const handleAddParticipant = (name: string) => {
    const normalizedName = name.toLowerCase().trim()
    const isDuplicate = participants.some((p) => p.toLowerCase() === normalizedName)

    if (!name.trim()) {
      toast({
        title: "❌ Error",
        description: "Please enter a participant name",
        variant: "destructive",
      })
      return
    }

    if (isDuplicate) {
      toast({
        title: "❌ Error",
        description: `${name} is already a participant!`,
        variant: "destructive",
      })
      return
    }

    setParticipants([...participants, name])
    toast({
      title: "✅ Success",
      description: `Participant ${name} added successfully!`,
      variant: "default",
    })
  }

  const handleDeleteParticipant = (name: string) => {
    setParticipants(participants.filter((p) => p !== name))
    toast({
      title: "🗑️ Removed",
      description: `Participant ${name} removed successfully!`,
      variant: "destructive",
    })
  }

  const handleWinner = (name: string, prize: string) => {
    if (name && prize) {
      setWinners([...winners, { name, prize, timestamp: Date.now() }])
      toast({
        title: `🏆 ${name} Won!`,
        description: `${name} is the winner of ${prize}!`,
        variant: "default",
      })
    }
  }

  const handleReEnter = (name: string) => {
    setWinners(winners.filter((w) => w.name !== name))
    toast({
      title: "↩️ Re-entered",
      description: `${name} was removed from winners!`,
      variant: "default",
    })
  }

  const winnersByPrize = useMemo(() => {
    const grouped: { [key: string]: string[] } = {}
    winners.forEach((winner) => {
      if (!grouped[winner.prize]) {
        grouped[winner.prize] = []
      }
      grouped[winner.prize].push(winner.name)
    })
    return grouped
  }, [winners])

  const winnerMap = useMemo(() => {
    const map: { [key: string]: string } = {}
    winners.forEach((winner) => {
      map[winner.name] = winner.prize
    })
    return map
  }, [winners])

  return (
    <div
      className="w-screen h-screen flex items-center justify-center p-0"
      style={{
        backgroundImage: "url(/bg.png)",
        backgroundColor: "transparent",
        backgroundSize: "cover",
        backgroundPosition: "top",
        backgroundAttachment: "fixed",
      }}
    >
      <div
        className="w-full h-full max-w-full flex flex-col px-8 pb-8 rounded-xl"
        style={{ aspectRatio: "896/640", maxHeight: "90vh" }}
      >
        {/* Main Grid */}
        <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
          {/* Left Panel - Participants */}
          <ParticipantPanel
            participants={participants}
            onAddParticipant={handleAddParticipant}
            onDeleteParticipant={handleDeleteParticipant}
            winnerMap={winnerMap}
          />

          {/* Middle Panel - Raffle */}
          <RafflePanel participants={participants} onWinner={handleWinner} />

          {/* Right Panel - Winners */}
          <WinnersPanel winnersByPrize={winnersByPrize} onReEnter={handleReEnter} />
        </div>
      </div>
    </div>
  )
}
