import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const analytics = readFileSync(new URL('../public/analytics.js', import.meta.url), 'utf8');
const interactions = readFileSync(new URL('../public/site-interactions.js', import.meta.url), 'utf8');
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

function setup(config = {}, navigator = { userAgent: 'Windows NT', platform: 'Win32' }) {
  const scripts = [], handlers = {};
  class Element {
    closest() { return this; }
  }
  const links = [...html.matchAll(/<a\b[^>]*data-contact-source="[^"]+"[^>]*>/g)].map(([tag]) => {
    const link = new Element();
    link.href = tag.match(/href="([^"]+)"/)[1];
    link.dataset = { contactSource: tag.match(/data-contact-source="([^"]+)"/)[1],
      plan: tag.match(/data-plan="([^"]+)"/)?.[1] };
    return link;
  });
  const window = { STUDIO_ANALYTICS: config, matchMedia: () => ({ addEventListener() {} }) };
  const document = {
    referrer: '', head: { appendChild: script => scripts.push(script) },
    createElement: () => ({}), getElementById: id => scripts.find(script => script.id === id),
    querySelector: () => null,
    querySelectorAll: selector => selector === 'a[data-contact-source]' ? links : [],
    addEventListener: (name, callback) => { handlers[name] = callback; },
  };
  const context = vm.createContext({ window, document, navigator, Element, URL, URLSearchParams,
    location: { search: '?utm_source=instagram' } });
  vm.runInContext(analytics, context);
  vm.runInContext(interactions, context);
  return { window, scripts, links, context, click: link => handlers.click({ target: link }) };
}

test('all 13 desktop links open WhatsApp Web with the original recipient and message', () => {
  const s = setup();
  assert.equal(s.links.length, 13);
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
