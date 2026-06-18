"use client";

import { useEffect, useRef, type ReactNode } from "react";

type MessageScrollerProps = {
  children: ReactNode;
  className?: string;
};

export function MessageScroller({ children, className }: MessageScrollerProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;

    if (scroller) {
      scroller.scrollTop = scroller.scrollHeight;
    }
  }, [children]);

  return (
    <div ref={scrollerRef} className={className}>
      {children}
    </div>
  );
}
