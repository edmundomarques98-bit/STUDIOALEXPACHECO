(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  document.querySelectorAll("[data-evolution-slideshow]").forEach(root => {
    if (root.dataset.slideshowReady) return;
    const track = root.querySelector(".evolution-slides");
    const slides = Array.from(track.children);
    const controls = root.querySelector(".evolution-controls");
    const pauseButton = root.querySelector("[data-slide-pause]");
    const counter = root.querySelector("[data-slide-count]");
    if (slides.length < 2) return;
    root.dataset.slideshowReady = "true";
    controls.hidden = false;
    let index = 0;
    let visible = false;
    let hovered = false;
    let paused = reduced.matches;
    let timer = 0;
    let scrollTimer = 0;
    const sync = () => {
      const width = track.clientWidth;
      if (!width) return;
      index = Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / width)));
      counter.textContent = `${index + 1} / ${slides.length}`;
    };
    const show = next => {
      index = (next + slides.length) % slides.length;
      track.scrollTo({ left: index * track.clientWidth, behavior: reduced.matches ? "instant" : "smooth" });
    };
    const schedule = () => {
      window.clearTimeout(timer);
      if (!paused && visible && !hovered && !document.hidden) {
        timer = window.setTimeout(() => { show(index + 1); schedule(); }, 7000);
      }
    };
    const updatePause = () => {
      pauseButton.textContent = paused ? "Reproduzir" : "Pausar";
      pauseButton.setAttribute("aria-label", paused ? "Iniciar passagem automática" : "Pausar passagem automática");
      track.setAttribute("aria-live", paused ? "polite" : "off");
      schedule();
    };
    const pause = () => { paused = true; updatePause(); };
    root.querySelector("[data-slide-prev]").addEventListener("click", () => { pause(); show(index - 1); });
    root.querySelector("[data-slide-next]").addEventListener("click", () => { pause(); show(index + 1); });
    pauseButton.addEventListener("click", () => { paused = !paused; updatePause(); });
    track.addEventListener("pointerdown", pause, { passive: true });
    track.addEventListener("touchstart", pause, { passive: true });
    root.addEventListener("focusin", event => { if (event.target !== pauseButton) pause(); });
    root.addEventListener("pointerenter", event => { if (event.pointerType === "mouse") { hovered = true; schedule(); } });
    root.addEventListener("pointerleave", () => { hovered = false; schedule(); });
    track.addEventListener("keydown", event => {
      if (event.target !== track) return;
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault(); pause();
      show(event.key === "Home" ? 0 : event.key === "End" ? slides.length - 1 : index + (event.key === "ArrowRight" ? 1 : -1));
    });
    track.addEventListener("scroll", () => {
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(sync, 120);
    }, { passive: true });
    track.addEventListener("scrollend", sync);
    document.addEventListener("visibilitychange", schedule);
    reduced.addEventListener("change", () => { if (reduced.matches) pause(); });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting && entries[0].intersectionRatio >= 0.5;
        schedule();
      }, { threshold: [0, 0.5] }).observe(track);
    }
    if ("ResizeObserver" in window) {
      new ResizeObserver(() => {
        track.scrollTo({ left: index * track.clientWidth, behavior: "instant" });
      }).observe(track);
    }
    updatePause();
  });
})();
