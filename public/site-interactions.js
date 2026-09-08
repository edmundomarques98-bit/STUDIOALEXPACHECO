(() => {
  if (window.__studioInteractionsLoaded) return;
  window.__studioInteractionsLoaded = true;

  // Desktop goes directly to WhatsApp Web; phones/tablets keep the app link.
  const mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (!mobile) {
    document.querySelectorAll('a[data-contact-source]').forEach(link => {
      const original = new URL(link.href);
      if (original.hostname !== 'wa.me') return;
      const desktop = new URL('https://web.whatsapp.com/send');
      desktop.searchParams.set('phone', original.pathname.replace(/\D/g, ''));
      desktop.searchParams.set('text', original.searchParams.get('text') || '');
      link.href = desktop.href;
    });
  }

  // Navigation remains usable without JavaScript through native details/links.
  const menu = document.querySelector('.mobile-menu');
  document.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    if (menu?.open && (!menu.contains(event.target) || event.target.closest('a'))) menu.open = false;
    const contact = event.target.closest('a[data-contact-source]');
    if (!contact) return;
    try {
      window.studioAnalytics?.trackContact({
        contact_source: contact.dataset.contactSource,
        plan: contact.dataset.plan || 'primeira_aula',
      });
    } catch { /* Tracking must never block the link. */ }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu?.open) {
      menu.open = false;
      menu.querySelector('summary')?.focus();
    }
  });

  // Do not keep five videos playing when they are off-screen.
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const videos = [...document.querySelectorAll('.day-video video')];
  const visible = new Set();
  const updateVideo = video => {
    if (reduced.matches || document.hidden || !visible.has(video)) video.pause();
    else video.play().catch(() => {});
  };
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) visible.add(target); else visible.delete(target);
        updateVideo(target);
      });
    });
    videos.forEach(video => { video.pause(); observer.observe(video); });
  }
  reduced.addEventListener('change', () => videos.forEach(updateVideo));
  document.addEventListener('visibilitychange', () => videos.forEach(updateVideo));
})();
