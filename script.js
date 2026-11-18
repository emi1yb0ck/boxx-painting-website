// Mobile menu toggle
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.main-nav');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});

// Tap to open dropdowns on mobile
document.querySelectorAll('.has-dropdown > a').forEach(link => {
  link.addEventListener('click', e => {
    if (window.innerWidth <= 900) {
      e.preventDefault();
      link.parentElement.classList.toggle('open');
    }
  });
});

// Close the mobile menu after picking a link
document.querySelectorAll('.dropdown a, .main-nav > ul > li:not(.has-dropdown) > a').forEach(a =>
  a.addEventListener('click', () => nav.classList.remove('open'))
);

document.getElementById('year').textContent = new Date().getFullYear();

// ===== Online estimator =====
// EDIT THESE: your real starting prices.
// "base" is the starting price, "includes" is how many units the base covers,
// "extra" is the cost per unit above that.
const RATES = [
  { name: 'Exterior House Painting', unit: 'Area (sq ft)',      base: 1625, includes: 1500, extra: 0 },
  { name: 'Interior House Painting', unit: 'Area (sq ft)',      base: 375,  includes: 150,  extra: 0 },
  { name: 'Driveway Painting',       unit: '',                  base: 325,  includes: 0,    extra: 0 }, // flat starting price, no size
  { name: 'Roof Sealing',            unit: 'Roof area (sq ft)', base: 1425, includes: 1500, extra: 0 },
  { name: 'Roof Painting',           unit: 'Roof area (sq ft)', base: 1675, includes: 1500, extra: 0 },
  { name: 'Pressure Cleaning',       unit: 'Area (sq ft)',      base: 225,  includes: 1500, extra: 0 },
];

const dialog = document.getElementById('estimator');
const sel = document.getElementById('est-service');
const size = document.getElementById('est-size');
RATES.forEach((r, i) => sel.add(new Option(r.name, i)));

function updateEstimate() {
  const r = RATES[sel.value];
  document.getElementById('est-unit-label').textContent = r.unit;
  size.closest('label').hidden = !r.includes;
  if (!r.includes) { document.getElementById('est-total').textContent = 'From $' + r.base.toLocaleString(); return; }
  const n = Math.max(0, Number(size.value) || 0);
  const total = r.base + Math.max(0, n - r.includes) * r.extra;
  const out = document.getElementById('est-total');
  if (!r.base) out.textContent = 'Call for pricing';
  else if (n > r.includes && !r.extra) out.textContent = 'From $' + r.base.toLocaleString() + ' (larger jobs are quoted after a free visit)';
  else out.textContent = '$' + total.toLocaleString();
}
sel.addEventListener('change', () => { size.value = RATES[sel.value].includes; updateEstimate(); });
size.addEventListener('input', updateEstimate);
size.value = RATES[0].includes;
updateEstimate();

// Buttons/links that open the estimator or the quote form
document.querySelectorAll('[data-open]').forEach(el => el.addEventListener('click', e => {
  e.preventDefault();
  if (el.hasAttribute('data-close')) dialog.close();
  if (el.dataset.open === 'estimator') {
    dialog.showModal();
  } else {
    const form = document.getElementById('quote');
    form.hidden = false;
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => form.querySelector('input')?.focus({ preventScroll: true }), 400);
  }
}));
dialog.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });

// Back-to-top button appears after scrolling
const toTop = document.querySelector('.to-top');
addEventListener('scroll', () => toTop.classList.toggle('show', scrollY > 600), { passive: true });
