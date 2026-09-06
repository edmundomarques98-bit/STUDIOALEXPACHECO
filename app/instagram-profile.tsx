"use client";

import { useEffect } from "react";

export function InstagramProfile() {
  useEffect(() => {
    const section = document.getElementById("redes-sociais");
    if (!section) return;
    const load = () => {
      if (document.querySelector("script[data-studio-instagram]")) return;
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      script.dataset.studioInstagram = "true";
      document.body.appendChild(script);
    };
    if (!("IntersectionObserver" in window)) { load(); return; }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { load(); observer.disconnect(); }
    }, { rootMargin: "400px" });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);
  return null;
}
