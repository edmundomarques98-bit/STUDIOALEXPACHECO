"use client";

import { useEffect } from "react";

export function SiteInteractions() {
  useEffect(() => {
    if (document.getElementById("studio-site-interactions")) return;
    const script = document.createElement("script");
    script.id = "studio-site-interactions";
    script.src = "/site-interactions.js";
    document.body.appendChild(script);
  }, []);
  return null;
}
