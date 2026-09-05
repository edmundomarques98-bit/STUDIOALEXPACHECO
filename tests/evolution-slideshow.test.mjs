import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../public/evolution-slideshow.js', import.meta.url), 'utf8');
function setup(reduce = false) {
  const element = () => ({
    dataset: {}, handlers: {}, attributes: {},
    addEventListener(name, fn) { (this.handlers[name] ??= []).push(fn); },
    emit(name, event = {}) { for (const fn of this.handlers[name] ?? []) fn({ target: this, ...event }); },
    setAttribute(name, value) { this.attributes[name] = value; },
  });
  const root = element(), track = element(), pause = element(), previous = element(), next = element(), counter = element(), controls = element();
  const targets = { '.evolution-slides': track, '.evolution-controls': controls, '[data-slide-pause]': pause, '[data-slide-count]': counter, '[data-slide-prev]': previous, '[data-slide-next]': next };
  root.querySelector = name => targets[name];
  track.children = [element(), element(), element()]; track.clientWidth = 300; track.scrollLeft = 0;
  track.scrollTo = options => { track.scrollLeft = options.left; track.behavior = options.behavior; track.emit('scrollend'); };
  const document = element(); document.hidden = false; document.querySelectorAll = () => [root];
  const media = element(); media.matches = reduce;
  let observer, resize, id = 0;
  const timers = new Map();
  const window = {
    matchMedia: () => media,
    setTimeout: fn => { timers.set(++id, fn); return id; },
    clearTimeout: key => timers.delete(key),
    IntersectionObserver: true, ResizeObserver: true,
  };
  const context = vm.createContext({ window, document,
    IntersectionObserver: class { constructor(fn) { observer = fn; } observe() {} },
    ResizeObserver: class { constructor(fn) { resize = fn; } observe() {} },
  });
  vm.runInContext(source, context);
  return { root, track, pause, previous, next, counter, controls, document, media, timers,
    visible: value => observer([{ isIntersecting: value, intersectionRatio: value ? 1 : 0 }]),
    resize: () => resize(),
    tick: () => { const [key, fn] = timers.entries().next().value; timers.delete(key); fn(); },
    reinitialize: () => vm.runInContext(source, context),
  };
}

test('automatic playback runs only on screen and stops in a hidden tab or on hover', () => {
  const s = setup(); assert.equal(s.timers.size, 0);
  s.visible(true); assert.equal(s.timers.size, 1);
  s.tick(); assert.equal(s.counter.textContent, '2 / 3');
  s.root.emit('pointerenter', { pointerType: 'mouse' }); assert.equal(s.timers.size, 0);
  s.root.emit('pointerleave'); assert.equal(s.timers.size, 1);
  s.document.hidden = true; s.document.emit('visibilitychange'); assert.equal(s.timers.size, 0);
  s.document.hidden = false; s.document.emit('visibilitychange');
  s.visible(false); assert.equal(s.timers.size, 0);
});

test('manual arrows wrap and pause; the pause button can stop and resume playback', () => {
  const s = setup(); s.visible(true);
  s.root.emit('focusin', { target: s.pause }); s.pause.emit('click');
  assert.equal(s.timers.size, 0); assert.equal(s.pause.textContent, 'Reproduzir');
  s.pause.emit('click'); assert.equal(s.timers.size, 1);
  s.previous.emit('click'); assert.equal(s.counter.textContent, '3 / 3'); assert.equal(s.timers.size, 0);
  s.next.emit('click'); assert.equal(s.counter.textContent, '1 / 3');
});

test('touch, keyboard and rotation preserve the selected slide and pause for reading', () => {
  const s = setup(); s.visible(true); s.track.emit('touchstart'); assert.equal(s.timers.size, 0);
  s.track.scrollLeft = 600; s.track.emit('scrollend'); assert.equal(s.counter.textContent, '3 / 3');
  s.track.clientWidth = 400; s.resize(); assert.equal(s.track.scrollLeft, 800);
  let prevented = false;
  s.track.emit('keydown', { key: 'Home', preventDefault() { prevented = true; } });
  assert.ok(prevented); assert.equal(s.counter.textContent, '1 / 3');
});

test('reduced motion starts paused, and repeated initialization does not duplicate events', () => {
  const s = setup(true); s.visible(true); assert.equal(s.timers.size, 0);
  s.reinitialize(); assert.equal(s.next.handlers.click.length, 1);
  s.next.emit('click'); assert.equal(s.counter.textContent, '2 / 3'); assert.equal(s.track.behavior, 'instant');
});
