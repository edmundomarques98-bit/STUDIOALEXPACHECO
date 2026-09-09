import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const analytics = readFileSync(new URL('../public/analytics.js', import.meta.url), 'utf8');
const interactions = readFileSync(new URL('../public/site-interactions.js', import.meta.url), 'utf8');
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

function setup(config = {}, navigator = { userAgent: 'Windows NT', platform: 'Win32' }, options = {}) {
  const scripts = [], handlers = {}, windowHandlers = {}, timers = new Map();
  let now = 0, serial = 0;
  const on = (handlers, name, callback) => (handlers[name] ??= []).push(callback);
  const emit = (handlers, name, event = {}) => (handlers[name] || []).forEach(fn => fn(event));
  class Element {
    closest(selector) { return selector === 'a[data-contact-source]' && !this.dataset.contactSource ? null : this; }
    hasAttribute(name) { return name === 'data-contact-source' && Boolean(this.dataset.contactSource); }
    getAttribute(name) { return name === 'href' ? this.href : this.attributes?.[name] || null; }
  }
  const createLink = (href, attributes = {}) => Object.assign(new Element(), { href, attributes, dataset: {} });
  const links = [...html.matchAll(/<a\b[^>]*data-contact-source="[^"]+"[^>]*>/g)].map(([tag]) => {
    const link = createLink(tag.match(/href="([^"]+)"/)[1]);
    link.dataset = { contactSource: tag.match(/data-contact-source="([^"]+)"/)[1],
      plan: tag.match(/data-plan="([^"]+)"/)?.[1] };
    return link;
  });
  const frames = [];
  const window = {
    STUDIO_ANALYTICS: config, matchMedia: () => ({ addEventListener() {} }),
    addEventListener: (name, callback) => on(windowHandlers, name, callback),
    setTimeout: (fn, delay) => { const id = ++serial; timers.set(id, { fn, at: now + delay }); return id; },
    clearTimeout: id => timers.delete(id), requestAnimationFrame: fn => frames.push(fn),
    scrollY: 0, innerHeight: 1000,
  };
  const document = {
    hidden: false, documentElement: { scrollHeight: 5000 },
    referrer: '', head: { appendChild: script => scripts.push(script) },
    createElement: () => ({}), getElementById: id => scripts.find(script => script.id === id),
    querySelector: () => null,
    querySelectorAll: selector => selector === 'a[data-contact-source]' ? links : [],
    addEventListener: (name, callback) => on(handlers, name, callback),
  };
  const saved = new Map();
  const context = vm.createContext({ window, document, navigator, Element, URL, URLSearchParams,
    performance: { now: () => now },
    sessionStorage: options.storage || { getItem: key => saved.get(key), setItem: (key, value) => saved.set(key, value) },
    location: { search: options.search ?? '?utm_source=instagram', href: 'https://example.test/' } });
  vm.runInContext(analytics, context);
  vm.runInContext(interactions, context);
  return { window, scripts, links, context, saved, createLink,
    click: link => emit(handlers, 'click', { target: link }),
    events: name => window.dataLayer.filter(row => row.event === name),
    scroll: y => { window.scrollY = y; emit(windowHandlers, 'scroll'); while (frames.length) frames.shift()(); },
    hide: value => { document.hidden = value; emit(handlers, 'visibilitychange'); },
    advance: milliseconds => {
      const end = now + milliseconds;
      while (true) {
        const next = [...timers].filter(([, value]) => value.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
        if (!next) break;
        now = next[1].at; timers.delete(next[0]); next[1].fn();
      }
      now = end;
    },
  };
}

test('all 14 desktop links open WhatsApp Web with the original recipient and message', () => {
  const s = setup();
  assert.equal(s.links.length, 14);
  for (const link of s.links) {
    const url = new URL(link.href);
    assert.equal(url.origin + url.pathname, 'https://web.whatsapp.com/send');
    assert.equal(url.searchParams.get('phone'), '5585998073701');
    assert.match(url.searchParams.get('text'), /^Olá, Alex!/);
    if (link.dataset.plan) assert.ok(url.searchParams.get('text').includes(link.dataset.plan));
  }
});

test('Android, iPhone and iPad keep the mobile app links', () => {
  for (const nav of [{ userAgent: 'Android' }, { userAgent: 'iPhone' },
    { userAgent: 'Macintosh', platform: 'MacIntel', maxTouchPoints: 5 }]) {
    for (const link of setup({}, nav).links) assert.equal(new URL(link.href).hostname, 'wa.me');
  }
});

test('missing or invalid IDs never load external analytics scripts', () => {
  assert.equal(setup().scripts.length, 0);
  assert.equal(setup({ ga4Id: '<script>', clarityId: '../bad', metaPixelId: 'abc', gtmId: 'bad' }).scripts.length, 0);
});

const ids = { gtmId: 'GTM-TEST123', ga4Id: 'G-TEST123', clarityId: 'test12345', metaPixelId: '12345678901' };
test('direct providers queue one page view and one contact event without the message body', () => {
  const s = setup(ids);
  assert.equal(s.scripts.length, 4);
  const pageViews = s.window.dataLayer.filter(row => row[0] === 'config');
  assert.equal(pageViews.length, 1);
  s.click(s.links.find(link => link.dataset.plan));
  assert.equal(s.window.dataLayer.filter(row => row.event === 'contact_click').length, 1);
  assert.equal(s.window.dataLayer.filter(row => row[0] === 'event' && row[1] === 'contact_click').length, 1);
  assert.equal(s.window.clarity.q[0][1], 'contact_click');
  assert.equal(s.window.fbq.queue.filter(row => row[1] === 'PageView').length, 1);
  assert.equal(s.window.fbq.queue.filter(row => row[1] === 'WhatsAppClick').length, 1);
  assert.ok(!JSON.stringify(s.window.dataLayer).includes('Olá, Alex'));
  vm.runInContext(analytics, s.context);
  assert.equal(s.scripts.length, 4);
});

test('GTM mode suppresses direct providers and leaves exactly one contact event', () => {
  const s = setup({ ...ids, managedByGtm: true });
  assert.equal(s.scripts.length, 1);
  assert.equal(s.scripts[0].id, 'studio-gtm');
  s.click(s.links[0]);
  assert.equal(s.window.dataLayer.filter(row => row.event === 'contact_click').length, 1);
  assert.equal(s.window.gtag, undefined);
  assert.equal(s.window.fbq, undefined);
});

test('a failed analytics hook never prevents native contact navigation', () => {
  const s = setup();
  s.window.studioAnalytics.trackContact = () => { throw Error('blocked'); };
  assert.doesNotThrow(() => s.click(s.links[0]));
  assert.equal(new URL(s.links[0].href).hostname, 'web.whatsapp.com');
});


test('placeholder IDs are rejected and inactive configuration does not persist campaign data', () => {
  const s = setup({ ga4Id: 'G-XXXXXXXXXX', clarityId: 'xxxxxxxxxx', gtmId: 'GTM-XXXXXX' });
  assert.equal(s.scripts.length, 0);
  assert.equal(s.saved.size, 0);
});

test('campaign attribution survives blocked storage and sanitizes restored data', () => {
  const blocked = { getItem() { throw Error('denied'); }, setItem() { throw Error('denied'); } };
  const s = setup(ids, undefined, { storage: blocked, search: '?utm_source=instagram&utm_content=story_01&utm_term=treino' });
  s.click(s.links[0]);
  assert.equal(s.events('contact_click')[0].utm_content, 'story_01');
  const restored = setup(ids, undefined, { search: '', storage: { getItem: () => '{"utm_source":"instagram","utm_content":"<story>","unknown":"no"}' } });
  restored.click(restored.links[0]);
  assert.equal(restored.events('contact_click')[0].utm_content, 'story');
  assert.equal(restored.events('contact_click')[0].unknown, undefined);
});

test('social, maps, reviews and custom clicks are classified without leaking query strings', () => {
  const s = setup(ids);
  for (const [href, event] of [
    ['https://www.instagram.com/studioalexpacheco/?token=private', 'click_instagram'],
    ['https://www.google.com/maps/dir/?destination=location', 'click_localizacao'],
    ['https://search.google.com/local/writereview?placeid=place', 'click_avaliacao'],
    ['tel:12345678', 'click_telefone'], ['mailto:someone@example.test', 'click_email'],
    ['https://wa.me/5585998073701?text=private', 'contact_click'],
  ]) {
    s.click(s.createLink(href));
    assert.equal(s.events(event).length, 1);
  }
  s.click(s.createLink('https://instagram.com.fake.test/'));
  assert.equal(s.events('click_instagram').length, 1);
  s.click(s.createLink('#programas', { 'data-analytics': 'ver_programas' }));
  assert.equal(s.events('ver_programas').length, 1);
  s.click({}); // A non-element target must not throw.
  assert.ok(!JSON.stringify(s.window.dataLayer).includes('private'));
  assert.ok(!JSON.stringify(s.window.dataLayer).includes('someone@'));
});

test('scroll thresholds fire once and 100 percent requires reaching the bottom', () => {
  const s = setup();
  s.scroll(2000); s.scroll(0); s.scroll(2000);
  assert.equal(s.events('scroll_25').length, 1);
  assert.equal(s.events('scroll_50').length, 1);
  s.scroll(3990);
  assert.equal(s.events('scroll_100').length, 0);
  s.scroll(4000); s.scroll(4100);
  for (const level of [25, 50, 75, 90, 100]) assert.equal(s.events(`scroll_${level}`).length, 1);
});

test('engagement accumulates visible time and does not count background time', () => {
  const s = setup();
  s.advance(20000); s.hide(true); s.advance(120000);
  assert.equal(s.events('engajamento_30_segundos').length, 0);
  s.hide(false); s.advance(10000);
  assert.equal(s.events('engajamento_30_segundos').length, 1);
  s.advance(30000); s.hide(true); s.hide(false); s.advance(60000);
  assert.equal(s.events('engajamento_60_segundos').length, 1);
  assert.equal(s.events('engajamento_30_segundos').length, 1);
});
