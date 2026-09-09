(() => {
  if (window.__alexProfileLoaded) return;
  window.__alexProfileLoaded = true;
  const section = document.getElementById('quem-e-alex');
  if (!section) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const stages = [...section.querySelectorAll('[data-alex-depth]')];
  const states = new Map(stages.map(stage => [stage, { frame: 0, x: 0, y: 0 }]));
  const reset = stage => {
    const state = states.get(stage);
    window.cancelAnimationFrame(state.frame);
    state.frame = 0;
    stage.classList.remove('is-active');
    stage.style.removeProperty('--alex-rx');
    stage.style.removeProperty('--alex-ry');
  };
  stages.forEach(stage => {
    const scene = stage.querySelector('.alex-action-scene');
    scene.addEventListener('pointermove', event => {
      if (reduced.matches || !finePointer.matches || event.pointerType !== 'mouse' || document.hidden) return;
      const rect = scene.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const state = states.get(stage);
      state.x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
      state.y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
      if (state.frame) return;
      state.frame = window.requestAnimationFrame(() => {
        state.frame = 0;
        stage.classList.add('is-active');
        stage.style.setProperty('--alex-rx', `${(-state.y * 3).toFixed(2)}deg`);
        stage.style.setProperty('--alex-ry', `${(state.x * 4).toFixed(2)}deg`);
      });
    }, { passive: true });
    scene.addEventListener('pointerleave', () => reset(stage));
    scene.addEventListener('pointercancel', () => reset(stage));
  });
  const resetAll = () => stages.forEach(reset);
  reduced.addEventListener('change', resetAll);
  finePointer.addEventListener('change', resetAll);
  document.addEventListener('visibilitychange', resetAll);
  window.addEventListener('pagehide', resetAll);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) entry.target.classList.add('is-revealed');
        else if (states.has(entry.target)) reset(entry.target);
      }
    }, { threshold: 0.12 });
    section.querySelectorAll('.alex-reveal').forEach(el => observer.observe(el));
  }
})();
