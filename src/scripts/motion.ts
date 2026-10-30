// Scroll motion: reveals, photo parallax, header shadow and a thin progress bar.
// Everything is skipped for visitors who ask their device for reduced motion.
(window as unknown as { __motion: boolean }).__motion = true;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function revealOnScroll() {
  const items = document.querySelectorAll<HTMLElement>('[data-reveal], [data-stagger]');

  // Children of a [data-stagger] container rise one after another. On a phone a tall
  // single column runs far below the fold, so each child reveals when it arrives instead.
  const phone = window.matchMedia('(max-width: 820px)').matches;
  const own = new Set<HTMLElement>();
  document.querySelectorAll<HTMLElement>('[data-stagger]').forEach((box) => {
    const eachOnItsOwn = phone && box.getBoundingClientRect().height > window.innerHeight * 0.7;
    Array.from(box.children).forEach((child, i) => {
      const el = child as HTMLElement;
      el.style.setProperty('--d', eachOnItsOwn ? '0ms' : `${Math.min(i, 8) * 45}ms`);
      if (eachOnItsOwn) own.add(el);
    });
  });

  if (reduced || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-in'));
    own.forEach((el) => el.classList.add('is-in'));
    return;
  }

  // A photo clipped to nothing has no visible area for the observer to measure,
  // so wipe photos are watched through their parent and opened together with it.
  const watch = new Map<Element, HTMLElement[]>();
  const watched = [...items].filter((el) => !(el.hasAttribute('data-stagger') && [...el.children].some((c) => own.has(c as HTMLElement))));
  own.forEach((el) => watched.push(el));
  watched.forEach((el) => {
    const target = el.dataset.reveal === 'wipe' ? el.parentElement! : el;
    watch.set(target, [...(watch.get(target) ?? []), el]);
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          watch.get(e.target)?.forEach((el) => el.classList.add('is-in'));
          io.unobserve(e.target);
          watch.delete(e.target);
        }
      });
    },
    { threshold: 0, rootMargin: '0px 0px 12% 0px' },
  );
  watch.forEach((_, target) => io.observe(target));

  // Jumping past a section (scrollbar drag, Page Down, restored scroll position) means it
  // never intersects, so anything already above the viewport is shown straight away.
  let pending = false;
  const sweep = () => {
    pending = false;
    watch.forEach((els, target) => {
      if (target.getBoundingClientRect().bottom < 0) {
        els.forEach((el) => el.classList.add('is-in'));
        io.unobserve(target);
        watch.delete(target);
      }
    });
    if (!watch.size) window.removeEventListener('scroll', onScroll);
  };
  const onScroll = () => {
    if (!pending) {
      pending = true;
      requestAnimationFrame(sweep);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  sweep();
}

function parallax() {
  const layers = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
  if (reduced || !layers.length || window.matchMedia('(max-width: 820px)').matches) return;
  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = window.innerHeight;
    for (const el of layers) {
      const host = el.parentElement!.getBoundingClientRect();
      if (host.bottom < -50 || host.top > vh + 50) continue;
      // +1 when the host is entering at the bottom of the screen, -1 once it has left at the top
      const t = Math.max(-1, Math.min(1, (host.top + host.height / 2 - vh / 2) / (vh / 2 + host.height / 2)));
      const strength = parseFloat(el.dataset.parallax || '0.08');
      el.style.transform = `translate3d(0, ${(-t * strength * 100).toFixed(2)}%, 0)`;
    }
  };
  const request = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request);
  update();
}

function chrome() {
  const header = document.querySelector('.site-header');
  const bar = document.querySelector<HTMLElement>('.progress');
  let ticking = false;
  const update = () => {
    ticking = false;
    const y = window.scrollY;
    header?.classList.toggle('is-scrolled', y > 12);
    if (bar && !reduced) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleY(${max > 0 ? Math.min(1, y / max) : 0})`;
    }
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  update();
}

try {
  revealOnScroll();
  parallax();
  chrome();
} catch (err) {
  // Never leave content hidden if the motion script fails part way.
  document.documentElement.classList.remove('js');
  console.error(err);
}
