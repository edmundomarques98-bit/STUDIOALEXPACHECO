(() => {
  if (window.__studioAnalyticsLoaded) return;
  window.__studioAnalyticsLoaded = true;
  const config = window.STUDIO_ANALYTICS || {};
  const valid = (key, pattern) => typeof config[key] === 'string' && pattern.test(config[key]);
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
  // A click indicates interest; it does not confirm a sent message or enrollment.
  window.studioAnalytics = {
    trackContact(detail) {
      const parameters = {
        contact_channel: 'whatsapp',
        contact_source: detail.contact_source,
        plan: detail.plan,
      };
      if (ga4) window.gtag('event', 'contact_click', { ...parameters, send_to: config.ga4Id });
      if (clarity) window.clarity('event', 'contact_click');
      if (meta) window.fbq('trackCustom', 'WhatsAppClick', parameters);
    },
  };
})();
