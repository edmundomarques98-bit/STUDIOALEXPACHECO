"use client";

import { useEffect } from "react";

export function EvolutionController() {
  useEffect(() => {
    if (document.querySelector("script[data-evolution-controller]")) return;
    const script = document.createElement("script");
    script.src = "/evolution-slideshow.js";
    script.dataset.evolutionController = "true";
    document.body.appendChild(script);
  }, []);
  return null;
}
