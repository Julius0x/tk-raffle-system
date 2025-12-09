'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Confetti from 'react-confetti';

interface Props {
  participants: string[];
  onWinner: (name: string, prize: string) => void;
}

export default function RafflePanel({ participants, onWinner }: Props) {
  const [prize, setPrize] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [winningPrize, setWinningPrize] = useState('');
  const [confettiKey, setConfettiKey] = useState(0);

  const timerRefLocal = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load audio safely on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/sound-effect.mp3');
    }
  }, []);

  // Format name as "Last, First"
  const formatName = (name: string) => {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    return parts.length > 1
      ? `${parts[parts.length - 1]}, ${parts.slice(0, -1).join(' ')}`
      : name;
  };

  const handleSpin = () => {
    if (!prize.trim() || participants.length === 0 || isSpinning) return;

    // Play sound
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    setIsSpinning(true);
    setShowPopup(true);
    setWinningPrize(prize.trim());

    const initialName = participants[0] || '';
    setDisplayName(initialName);

    let spins = 0;
    const targetDuration = 6000;
    const intervalMs = 30;
    const maxSpins = Math.max(1, Math.round(targetDuration / intervalMs));

    timerRefLocal.current = window.setInterval(() => {
      setDisplayName(
        participants[Math.floor(Math.random() * participants.length)]
      );

      spins++;

      if (spins === maxSpins) {
        if (timerRefLocal.current) {
          clearInterval(timerRefLocal.current);
        }

        const winnerIndex = Math.floor(Math.random() * participants.length);
        const winner = participants[winnerIndex];
        setDisplayName(winner);
        setIsSpinning(false);
        setConfettiKey((prev) => prev + 1);

        timerRefLocal.current = null;
        setTimeout(() => {
          onWinner(winner, prize.trim());
        }, 500);
      }
    }, intervalMs);
  };

  useEffect(() => {
    return () => {
      if (timerRefLocal.current) {
        clearInterval(timerRefLocal.current);
      }
    };
  }, []);

  return (
    <>
      {/* Center Layout - Input and Spin Button Only */}
      <div className="flex h-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-9 shadow-sm">
        <h2 className="mb-12 text-5xl font-bold text-gray-900">Raffle Draw</h2>

        <div className="flex w-full max-w-2xl flex-col gap-6">
          <Input
            placeholder="Enter prize (e.g., iPhone)"
            value={prize}
            onChange={(e) => setPrize(e.target.value)}
            disabled={isSpinning}
            className="w-full cursor-pointer border-gray-300 bg-gray-50 px-6 !py-12 !text-4xl text-gray-900 placeholder-gray-400"
          />

          <Button
            onClick={handleSpin}
            disabled={isSpinning || !prize.trim() || participants.length === 0}
            className="w-full cursor-pointer rounded-md py-9 text-xl text-white disabled:cursor-not-allowed disabled:bg-gray-300"
            style={{
              backgroundColor:
                isSpinning || !prize.trim() || participants.length === 0
                  ? undefined
                  : '#d14124',
            }}
            onMouseEnter={(e) =>
              !e.currentTarget.disabled &&
              (e.currentTarget.style.backgroundColor = '#c83a1f')
            }
            onMouseLeave={(e) =>
              !e.currentTarget.disabled &&
              (e.currentTarget.style.backgroundColor = '#d14124')
            }
          >
            {isSpinning ? 'Drawing...' : 'Draw'}
          </Button>
        </div>

        {participants.length === 0 && (
          <p className="mt-9 text-base text-gray-500">
            Add participants to start spinning
          </p>
        )}
      </div>

      {/* Full Screen Popup */}
      {showPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            backgroundImage: "url('/bg.png')",
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        >
          {/* Dark Overlay */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', zIndex: 0 }}
          ></div>

          {/* Confetti */}
          <Confetti
            key={confettiKey}
            recycle={false}
            numberOfPieces={!isSpinning ? 1500 : 0}
            gravity={0.3}
          />

          {/* Close Button */}
          <button
            onClick={() => setShowPopup(false)}
            className="absolute top-6 right-6 text-white transition-colors hover:text-gray-300"
            style={{
              fontSize: '40px',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 52,
            }}
          >
            ✕
          </button>

          {/* Content Container */}
          <div
            className="flex h-full w-full flex-col items-center justify-center px-20"
            style={{ zIndex: 10 }}
          >
            {/* Randomizer Display */}
            <div className="mb-20 w-full shrink-0">
              <div className="flex h-60 w-full items-center justify-center rounded-lg bg-white shadow-lg">
                <span className="overflow-hidden px-6 text-center !text-[115px] font-extrabold whitespace-nowrap text-[#d14124]">
                  {formatName(displayName) || '?'}
                </span>
              </div>
            </div>

            {/* Prize */}
            <div className="shrink-0 text-center">
              <p className="text-[100px] font-bold text-white">
                Prize: {winningPrize}
              </p>

              {/* Draw Again */}
              {!isSpinning && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 transform px-20">
                  <Button
                    onClick={handleSpin}
                    disabled={
                      isSpinning || !prize.trim() || participants.length === 0
                    }
                    className="w-full cursor-pointer rounded-md px-15 py-10 text-5xl text-white disabled:cursor-not-allowed disabled:bg-gray-300"
                    style={{ backgroundColor: '#d14124' }}
                    onMouseEnter={(e) =>
                      !e.currentTarget.disabled &&
                      (e.currentTarget.style.backgroundColor = '#c83a1f')
                    }
                    onMouseLeave={(e) =>
                      !e.currentTarget.disabled &&
                      (e.currentTarget.style.backgroundColor = '#d14124')
                    }
                  >
                    Draw
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
