"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !barRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const tween = gsap.to(barRef.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.15,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent"
    >
      <div
        ref={barRef}
        style={{ transformOrigin: "0% 50%", transform: "scaleX(0)" }}
        className="h-full w-full bg-gradient-to-r from-[#ff6749] via-[#f4a261] to-[#2a9d8f] shadow-[0_0_12px_rgba(255,103,73,0.8)]"
      />
    </div>
  );
}
