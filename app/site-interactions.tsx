"use client";

import { useEffect } from "react";

export function SiteInteractions() {
  useEffect(() => {
    // Preserve execution order: configuration, providers, navigation/events.
    for (const name of ["analytics-config", "analytics", "site-interactions"]) {
      const id = `studio-script-${name}`;
      if (document.getElementById(id)) continue;
      const script = document.createElement("script");
      script.id = id;
      script.async = false;
      script.src = `/${name}.js?v=20260908-events`;
      document.body.appendChild(script);
    }
  }, []);
  return null;
}
