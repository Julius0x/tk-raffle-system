"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Trash2, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Props {
  participants: string[]
  onAddParticipant: (name: string) => void
  onDeleteParticipant: (name: string) => void
  winnerMap?: { [key: string]: string }
}

export default function ParticipantPanel({
  participants,
  onAddParticipant,
  onDeleteParticipant,
  winnerMap = {},
}: Props) {
  const [newName, setNewName] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const handleAddClick = () => {
    const trimmedName = newName.trim()

    if (!trimmedName) {
      toast({
        title: "❌ Error",
        description: "Please enter a participant name",
        variant: "destructive",
      })
      return
    }

    const isDuplicate = participants.some((p) => p.toLowerCase() === trimmedName.toLowerCase())
    if (isDuplicate) {
      toast({
        title: "❌ Duplicate Name",
        description: `${trimmedName} is already a participant!`,
        variant: "destructive",
      })
      return
    }

    onAddParticipant(trimmedName)
    setNewName("")
  }

  const filteredParticipants = participants.filter((p) => {
    const prize = winnerMap[p]
    const displayText = prize ? `${p} - won ${prize}` : p
    const searchLower = searchTerm.toLowerCase().trim()
    const displayLower = displayText.toLowerCase()

    if (!searchLower) return true

    const searchWords = searchLower.split(/\s+/).filter((w) => w.length > 0)
    return searchWords.every((word) => displayLower.includes(word))
  })

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 h-full flex flex-col min-h-0 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-3">Participants</h2>

      <div className="flex gap-2 mb-3">
        <Input
          placeholder="Enter name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddClick()}
          className="flex-1 bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 text-sm h-9 cursor-pointer"
        />
        <Button
          onClick={handleAddClick}
          size="icon"
          className="bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0 h-9 w-9 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="mb-3 relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 pl-10 text-sm h-9 cursor-pointer"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 min-h-0 pr-2">
        {filteredParticipants.length === 0 ? (
          <p className="text-gray-400 text-xs text-center py-4">No participants</p>
        ) : (
          filteredParticipants.map((participant) => {
            const prize = winnerMap[participant]
            const nameDisplay = participant
            const prizeDisplay = prize ? `won ${prize}` : ""

            return (
              <div
                key={participant}
                className={`flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer ${
                  prize ? "bg-green-50 hover:bg-green-100" : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="flex-1">
                  <span className={`text-sm font-medium block ${prize ? "text-green-700" : "text-gray-900"}`}>
                    {nameDisplay}
                  </span>
                  {prizeDisplay && <span className="text-xs text-green-600 block">{prizeDisplay}</span>}
                </div>
                <button
                  onClick={() => onDeleteParticipant(participant)}
                  className="text-red-500 hover:text-red-600 transition-colors flex-shrink-0 ml-2 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )
          })
        )}
      </div>

      <div className="mt-3 text-center text-gray-500 text-xs">
        {participants.length} participant{participants.length !== 1 ? "s" : ""}
      </div>
    </div>
  )
}
