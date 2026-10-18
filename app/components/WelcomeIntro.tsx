"use client";

import { useEffect, useState } from "react";

export const WELCOME_EVENT = "devspectra-welcome";

const WORD_DEFAULT = "Welcome";
const SUBTITLE_DEFAULT = "Devspectra Digital Kreasi";

export default function WelcomeIntro() {
  const [show, setShow] = useState(true);
  const [word, setWord] = useState(WORD_DEFAULT);
  const [subtitle, setSubtitle] = useState(SUBTITLE_DEFAULT);

  // Initial load — animasi "Welcome"
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      setShow(false);
      document.body.style.overflow = "";
    }, 2900);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  // Listen event dari klik logo — animasi "Welcome Back"
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ word?: string; subtitle?: string }>).detail;
      setWord(detail?.word ?? WORD_DEFAULT);
      setSubtitle(detail?.subtitle ?? SUBTITLE_DEFAULT);
      setShow(true);
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        setShow(false);
        document.body.style.overflow = "";
      }, 2900);
    };
    window.addEventListener(WELCOME_EVENT, handler);
    return () => window.removeEventListener(WELCOME_EVENT, handler);
  }, []);

  if (!show) return null;

  return (
    <div
      className="animate-preloader-out fixed inset-0 z-[200] flex flex-col items-center justify-center bg-zinc-950"
      aria-hidden="true"
    >
      {/* Radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(59,130,246,0.15),transparent_60%)]" />

      {/* Main text — animated per letter */}
      <h1 className="relative flex select-none flex-wrap justify-center gap-x-0 text-5xl font-extrabold tracking-tight text-zinc-100 sm:text-7xl md:text-8xl">
        {word.split("").map((letter, i) => (
          <span
            key={`${letter}-${i}`}
            className="animate-welcome-letter inline-block"
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            {letter === " " ? "\u00A0" : letter}
          </span>
        ))}
      </h1>

      {/* Subtitle */}
      <p
        className="animate-welcome-pop relative mt-5 text-center text-sm uppercase tracking-[0.3em] text-zinc-500"
        style={{ animationDelay: "0.6s" }}
      >
        {subtitle}
      </p>

      {/* Progress bar */}
      <div className="relative mt-10 h-0.5 w-48 overflow-hidden rounded-full bg-zinc-800">
        <div className="animate-bar-grow h-full rounded-full bg-gradient-to-r from-blue-500 to-zinc-100" />
      </div>
    </div>
  );
}
