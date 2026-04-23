"use client";

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const CinematicCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;

    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
      });
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
      });
    };

    const handlePointerEntry = () => setIsPointer(true);
    const handlePointerLeave = () => setIsPointer(false);

    window.addEventListener('mousemove', moveCursor);

    const interactiveElements = document.querySelectorAll('button, a, .interactive');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handlePointerEntry);
      el.addEventListener('mouseleave', handlePointerLeave);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handlePointerEntry);
        el.removeEventListener('mouseleave', handlePointerLeave);
      });
    };
  }, []);

  return (
    <>
      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 w-3 h-3 bg-teal-400 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      />
      <div 
        ref={followerRef}
        className={`fixed top-0 left-0 w-10 h-10 border border-teal-400/50 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-out ${
          isPointer ? 'scale-150 border-teal-400 bg-teal-400/10' : 'scale-100'
        }`}
      >
        {isPointer && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1 h-1 bg-teal-400 rounded-full animate-ping" />
          </div>
        )}
      </div>
    </>
  );
};

export default CinematicCursor;
