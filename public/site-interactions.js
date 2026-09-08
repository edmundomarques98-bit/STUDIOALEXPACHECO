(() => {
  if (window.__studioInteractionsLoaded) return;
  window.__studioInteractionsLoaded = true;

  // Navigation remains usable without JavaScript through native details/links.
  const menu = document.querySelector('.mobile-menu');
  document.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    if (menu?.open && (!menu.contains(event.target) || event.target.closest('a'))) menu.open = false;
    const contact = event.target.closest('a[data-contact-source]');
    if (!contact) return;
    // Integration hook only: no analytics provider, personal data or persistent storage.
    const params = new URLSearchParams(location.search);
    const campaignValue = key => (params.get(key) || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80);
    let referrer = '';
    try { referrer = new URL(document.referrer).hostname; } catch {}
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'contact_click',
      contact_channel: 'whatsapp',
      contact_source: contact.dataset.contactSource,
      plan: contact.dataset.plan || 'primeira_aula',
      utm_source: campaignValue('utm_source'),
      utm_medium: campaignValue('utm_medium'),
      utm_campaign: campaignValue('utm_campaign'),
      referrer_domain: referrer,
    });
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
