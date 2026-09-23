// ---------------------------------------------------------------------------
// Shared chrome: the header (site menu), the footer and the floating contact
// button are rendered on every page from here, so the menu is always available.
// ---------------------------------------------------------------------------

import { INSTAGRAM_DM, INSTAGRAM_PAGE } from './data.js';
import * as cart from './cart.js';

const NAV_LINKS = [
  { key: 'home', href: './', label: 'الرئيسية' },
  { key: 'partners', href: './partners.html', label: 'شركاؤنا' },
  { key: 'categories', href: './categories.html', label: 'الأقسام' },
  { key: 'products', href: './products.html', label: 'المنتجات' },
  { key: 'routine', href: './routine.html', label: 'روتين البشرة' },
  { key: 'about', href: './about.html', label: 'من نحن' },
  { key: 'contact', href: './contact.html', label: 'تواصلي معنا' },
  { key: 'orders', href: './my-orders.html', label: 'رحلة طلباتي' },
];

// Pages that should light up a nav entry they are not named after.
const NAV_ALIAS = { product: 'products' };

function headerMarkup(page) {
  const current = NAV_ALIAS[page] || page;
  const links = NAV_LINKS.map(
    (link) =>
      `<a href="${link.href}"${link.key === current ? ' class="is-current" aria-current="page"' : ''}>${link.label}</a>`,
  ).join('\n        ');

  return `
  <div class="container header-inner">
    <a href="./" class="brand" aria-label="Wishes — الصفحة الرئيسية">
      <img src="./images/wishes-logo.png" alt="Wishes — Where wishes come true" width="585" height="298" />
    </a>

    <nav class="nav" id="nav" aria-label="القائمة الرئيسية">
        ${links}
    </nav>

    <a class="cart-link${page === 'cart' ? ' is-current' : ''}" href="./cart.html" aria-label="سلة التسوق">
      <svg class="icon"><use href="#i-cart" /></svg>
      <span class="cart-link-text">السلة</span>
      <span class="cart-count" id="cart-count" data-empty="true">0</span>
    </a>

    <button class="menu-toggle" id="menu-toggle" type="button" aria-label="فتح القائمة" aria-expanded="false" aria-controls="nav">
      <span></span><span></span><span></span>
    </button>
  </div>`;
}

function footerMarkup() {
  return `
  <div class="container footer-inner">
    <img src="./images/wishes-logo.png" alt="Wishes" class="footer-logo" width="585" height="298" />
    <p>مكياج ومنتجات عناية بالبشرة — سوريا</p>
    <nav class="footer-nav" aria-label="روابط الموقع">
      ${NAV_LINKS.map((link) => `<a href="${link.href}">${link.label}</a>`).join('\n      ')}
      <a href="./cart.html">السلة</a>
    </nav>
    <p class="footer-partners">الوكيل الحصري لـ <a href="https://www.instagram.com/lashango/" target="_blank" rel="noopener">Lashango</a> و <a href="https://www.instagram.com/aliona.cosmetics/" target="_blank" rel="noopener">Aliona Cosmetics</a> و <a href="https://www.instagram.com/ibraq.iq/" target="_blank" rel="noopener">IBRAQ</a> في سوريا</p>
    <div class="socials">
      <a href="${INSTAGRAM_PAGE}" target="_blank" rel="noopener" aria-label="إنستغرام">
        <svg class="icon"><use href="#i-instagram" /></svg>
      </a>
    </div>
    <p class="copyright">© <span id="year"></span> Wishes. جميع الحقوق محفوظة.</p>
  </div>`;
}

function setupMenu() {
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('nav');
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };

  toggle.addEventListener('click', () =>
    setOpen(!nav.classList.contains('is-open')),
  );
  nav
    .querySelectorAll('a')
    .forEach((link) => link.addEventListener('click', () => setOpen(false)));
}

function setupHeaderShadow() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const update = () =>
    header.classList.toggle('is-scrolled', window.scrollY > 10);
  window.addEventListener('scroll', update, { passive: true });
  update();
}

function setupCartBadge() {
  const badge = document.getElementById('cart-count');
  if (!badge) return;
  cart.subscribe(() => {
    const total = cart.count();
    badge.textContent = total;
    badge.dataset.empty = String(total === 0);
  });
}

export function setupReveal(root = document) {
  const items = root.querySelectorAll('.reveal:not(.is-visible)');
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );
  items.forEach((el) => observer.observe(el));
}

let toastTimer;
/** Small confirmation message, used when something is added to the cart. */
export function toast(message) {
  let el = document.querySelector('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    document.body.appendChild(el);
  }
  el.innerHTML = `${message} <a href="./cart.html">عرض السلة</a>`;
  requestAnimationFrame(() => el.classList.add('is-visible'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-visible'), 3200);
}

export function mountLayout(page) {
  const header = document.querySelector('.site-header');
  const footer = document.querySelector('.site-footer');
  if (header) header.innerHTML = headerMarkup(page);
  if (footer) footer.innerHTML = footerMarkup();

  const floatContact = document.createElement('a');
  floatContact.className = 'float-contact';
  floatContact.href = INSTAGRAM_DM;
  floatContact.target = '_blank';
  floatContact.rel = 'noopener';
  floatContact.setAttribute('aria-label', 'راسلينا على إنستغرام');
  floatContact.innerHTML =
    '<svg class="icon"><use href="#i-instagram" /></svg>';
  document.body.appendChild(floatContact);

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  setupMenu();
  setupHeaderShadow();
  setupCartBadge();
  setupReveal();
}
