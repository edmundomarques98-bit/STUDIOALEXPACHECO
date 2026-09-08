(() => {
  if (window.__studioAnalyticsLoaded) return;
  window.__studioAnalyticsLoaded = true;
  const config = window.STUDIO_ANALYTICS || {};
  const valid = (key, pattern) => typeof config[key] === 'string' && pattern.test(config[key])
    && !/^(?:(?:G|GTM)-)?X+$/i.test(config[key]);
  const direct = config.managedByGtm !== true;
  const ga4 = direct && valid('ga4Id', /^G-[A-Z0-9]+$/);
  const clarity = direct && valid('clarityId', /^[a-z0-9]{5,30}$/);
  const meta = direct && valid('metaPixelId', /^\d{5,25}$/);
  const load = (id, src) => {
    if (document.getElementById(id)) return;
    const script = document.createElement('script');
    script.id = id;
    script.async = true;
    script.src = src;
    document.head.appendChild(script);
  };
  window.dataLayer = window.dataLayer || [];
  if (valid('gtmId', /^GTM-[A-Z0-9]+$/)) {
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    load('studio-gtm', `https://www.googletagmanager.com/gtm.js?id=${config.gtmId}`);
  }
  if (ga4) {
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', config.ga4Id);
    load('studio-ga4', `https://www.googletagmanager.com/gtag/js?id=${config.ga4Id}`);
  }
  if (clarity) {
    window.clarity = window.clarity || function () {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };
    load('studio-clarity', `https://www.clarity.ms/tag/${config.clarityId}`);
  }
  if (meta) {
    if (!window.fbq) {
      const fbq = window.fbq = function () {
        if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments);
        else fbq.queue.push(arguments);
      };
      if (!window._fbq) window._fbq = fbq;
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = '2.0';
      fbq.queue = [];
    }
    window.fbq('init', config.metaPixelId);
    window.fbq('track', 'PageView');
    load('studio-meta-pixel', 'https://connect.facebook.net/en_US/fbevents.js');
  }
  // Only campaign labels are retained; blocked storage must not stop the site.
  const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  const clean = value => typeof value === 'string' ? value.replace(/[^a-zA-Z0-9_ -]/g, '').slice(0, 80) : '';
  const campaign = {};
  const params = new URLSearchParams(location.search);
  for (const key of campaignKeys) if (params.get(key)) campaign[key] = clean(params.get(key));
  if (ga4 || clarity || meta || valid('gtmId', /^GTM-[A-Z0-9]+$/)) {
    try {
      if (Object.keys(campaign).length) sessionStorage.setItem('studio_alex_utm', JSON.stringify(campaign));
      else {
        const saved = JSON.parse(sessionStorage.getItem('studio_alex_utm') || '{}');
        for (const key of campaignKeys) if (saved?.[key]) campaign[key] = clean(saved[key]);
      }
    } catch { /* Private mode, quota limits or invalid stored data. */ }
  }
  let referrer = '';
  try { referrer = new URL(document.referrer).hostname; } catch {}
  const fields = ['contact_channel', 'contact_source', 'plan', 'link_domain', 'percent_scrolled', 'seconds'];
  const trackEvent = (name, parameters = {}) => {
    if (typeof name !== 'string' || !/^[a-zA-Z][a-zA-Z0-9_]{0,39}$/.test(name)) return;
    const data = { ...campaign, referrer_domain: referrer };
    for (const key of fields) {
      const value = parameters?.[key];
      if (typeof value === 'string') data[key] = value.slice(0, 100);
      else if (typeof value === 'number' && Number.isFinite(value)) data[key] = value;
    }
    window.dataLayer.push({ ...Object.fromEntries(fields.map(key => [key, null])), ...data, event: name });
    // Each provider is isolated: a failed tracker cannot block another or navigation.
    try { if (ga4) window.gtag('event', name, { ...data, send_to: config.ga4Id }); } catch {}
    try { if (clarity) window.clarity('event', name); } catch {}
    try { if (meta && name === 'contact_click') window.fbq('trackCustom', 'WhatsAppClick', data); } catch {}
  };
  window.trackSiteEvent = trackEvent;
  window.studioAnalytics = {
    trackContact(detail) {
      trackEvent('contact_click', { ...detail, contact_channel: 'whatsapp' });
    },
  };

  document.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    const element = event.target.closest('a, button, [data-analytics]');
    // These links are already handled once by site-interactions.js.
    if (!element || element.hasAttribute('data-contact-source')) return;
    const custom = element.getAttribute('data-analytics');
    if (custom) { trackEvent(custom); return; }
    let url;
    try { url = new URL(element.getAttribute('href'), location.href); } catch { return; }
    const host = url.hostname.toLowerCase();
    const matches = domain => host === domain || host.endsWith('.' + domain);
    let name;
    if (url.protocol === 'tel:') name = 'click_telefone';
    else if (url.protocol === 'mailto:') name = 'click_email';
    else if (url.protocol === 'https:' || url.protocol === 'http:') {
      if (matches('wa.me') || matches('whatsapp.com')) name = 'contact_click';
      else if (matches('instagram.com')) name = 'click_instagram';
      else if ((matches('google.com') && (url.pathname.startsWith('/maps') || host.startsWith('maps.')))
        || (host === 'goo.gl' && url.pathname.startsWith('/maps')) || host === 'maps.app.goo.gl') name = 'click_localizacao';
      else if (host === 'search.google.com' && url.pathname === '/local/writereview') name = 'click_avaliacao';
    }
    if (name) trackEvent(name, name === 'contact_click'
      ? { contact_channel: 'whatsapp', contact_source: 'other', link_domain: host }
      : { link_domain: host });
  });

  // Scroll thresholds fire once per page, throttled to one calculation per frame.
  const scrollTracked = new Set();
  let framePending = false;
  window.addEventListener('scroll', () => {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(() => {
      framePending = false;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      if (height <= 0) return;
      const percent = Math.min(100, Math.floor(Math.max(0, window.scrollY) / height * 100));
      for (const level of [25, 50, 75, 90, 100]) {
        if (percent >= level && !scrollTracked.has(level)) {
          scrollTracked.add(level);
          trackEvent(`scroll_${level}`, { percent_scrolled: level });
        }
      }
    });
  }, { passive: true });

  // Count visible time only; background tabs do not qualify as engagement.
  const milestones = [30, 60];
  let elapsed = 0, started = null, timer;
  const settleTime = () => {
    if (started !== null) elapsed += performance.now() - started;
    started = null;
    window.clearTimeout(timer);
    while (milestones.length && elapsed >= milestones[0] * 1000) {
      const seconds = milestones.shift();
      trackEvent(`engajamento_${seconds}_segundos`, { seconds });
    }
  };
  const resumeTime = () => {
    settleTime();
    if (document.hidden || !milestones.length) return;
    started = performance.now();
    timer = window.setTimeout(resumeTime, milestones[0] * 1000 - elapsed);
  };
  document.addEventListener('visibilitychange', resumeTime);
  window.addEventListener('pagehide', settleTime);
  window.addEventListener('pageshow', resumeTime);
  resumeTime();
  // This publication is one static page. Do not patch history or duplicate GA4 page views.
})();
