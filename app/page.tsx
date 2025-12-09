"use client"

import Link from "next/link"

export default function HomePage() {
  return (
    <div
      className="w-full h-screen relative"
      style={{
          backgroundImage: "url('/intro.png')",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#000",
      }}
    >
      <Link href="/raffle" aria-label="Open raffle" className="absolute top-4 right-4">
        <div className="w-12 h-12 md:w-14 md:h-14 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-7 md:h-7 text-sky-700 ml-0.5">
            <path d="M4.5 3.75v16.5L19.5 12 4.5 3.75z" />
          </svg>
        </div>
      </Link>
    </div>
  )
}
