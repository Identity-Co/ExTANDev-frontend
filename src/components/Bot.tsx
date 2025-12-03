"use client"  // important: this makes it a Client Component

import { useEffect } from "react";

export default function Ai12zWidget() {
  useEffect(() => {
    // Add CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.ai12z.net/pkg/ai12z@latest/dist/library/library.css";
    document.head.appendChild(link);

    // Add JS
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://cdn.ai12z.net/pkg/ai12z@latest/dist/esm/library.js";
    script.async = true;
    script.onload = () => {
      if (window.Bot) {
        window.Bot.init();
      }
    };
    document.head.appendChild(script);

    // Cleanup if needed
    return () => {
      /*document.head.removeChild(link);
      document.head.removeChild(script);*/
    };
  }, []);

  return <ai12z-bot data-key="65832f10b6e586501e799bc716b673c21f422a6d59b9d861dcf9227f0f663481"></ai12z-bot>; // This component doesn't render anything
}
