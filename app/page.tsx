'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div
      className="relative h-screen w-full"
      style={{
        backgroundImage: "url('/intro.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#000',
      }}
    >
      <Link
        href="/raffle"
        aria-label="Open raffle"
        className="absolute top-4 right-4"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 shadow-lg hover:bg-white md:h-14 md:w-14">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="ml-0.5 h-6 w-6 text-sky-700 md:h-7 md:w-7"
          >
            <path d="M4.5 3.75v16.5L19.5 12 4.5 3.75z" />
          </svg>
        </div>
      </Link>
    </div>
  );
}
