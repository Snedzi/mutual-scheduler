'use client';
import './globals.css';
import React from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-100 font-sans flex flex-col">
        <header className="w-full flex items-center justify-center py-3 bg-black mb-0">
          <div className="w-full flex items-center justify-center">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white drop-shadow text-center w-full">Social Planning for Worldwide Ballers</h1>
          </div>
        </header>
        <main className="flex flex-col items-center justify-center w-full px-2 flex-1 bg-[url('/star-bg.svg')] bg-repeat bg-center pt-1">
          <div className="flex flex-col items-center mb-1">
            <img
              src="https://cdn.ktar.com/ktar/wp-content/uploads/2018/08/Pitbull-AP-Photo-640x480-1.jpg"
              alt="Cartoon man logo"
              className="w-16 h-16 rounded-full border-2 border-blue-400 shadow object-cover"
            />
            <div className="mt-1 bg-white border border-gray-400 rounded-xl px-3 py-1 text-xs font-semibold text-black shadow-lg text-center">
              Life is so crazy right now man
            </div>
          </div>
          {children}
        </main>
      </body>
    </html>
  );
}
