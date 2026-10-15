'use strict';

document.documentElement.classList.replace('no-js', 'js');

const nav = document.querySelector('.site-nav');
const menuButton = document.querySelector('.menu-toggle');
const menuLabel = menuButton.querySelector('span');
const mobileViewport = window.matchMedia('(max-width: 740px)');

function closeMenu(returnFocus = false) {
  nav.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuLabel.textContent = 'Menu';
  if (returnFocus) menuButton.focus();
}

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') !== 'true';
  nav.classList.toggle('is-open', isOpen);
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuLabel.textContent = isOpen ? 'Close' : 'Menu';
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    const destination = document.querySelector(link.hash);
    closeMenu();
    // Keep keyboard focus out of the collapsed mobile navigation.
    if (mobileViewport.matches && destination) destination.focus({ preventScroll: true });
  });
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('is-open')) closeMenu(true);
});

document.addEventListener('click', event => {
  if (!nav.contains(event.target)) closeMenu();
});

nav.addEventListener('focusout', event => {
  if (!nav.contains(event.relatedTarget)) closeMenu();
});

mobileViewport.addEventListener('change', () => closeMenu());

const filters = document.querySelectorAll('.filter-button');
const publications = document.querySelectorAll('.publication');
const publicationStatus = document.querySelector('#publication-status');
document.querySelector('.publication-controls').hidden = false;

filters.forEach(button => {
  button.addEventListener('click', () => {
    const selectedYear = button.dataset.year;
    let visible = 0;
    filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
    publications.forEach(publication => {
      const show = selectedYear === 'all' || publication.dataset.year === selectedYear;
      publication.hidden = !show;
      if (show) visible++;
    });
    publicationStatus.textContent = `${visible} publications${selectedYear === 'all' ? '' : ` from ${selectedYear}`}.`;
  });
});

const sectionLinks = Array.from(nav.querySelectorAll('a[href^="#"]'));
const sections = sectionLinks.map(link => document.querySelector(link.hash)).filter(Boolean);
if ('IntersectionObserver' in window) {
  const visibleSections = new Set();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) visibleSections.add(entry.target);
      else visibleSections.delete(entry.target);
    });
    const currentSection = sections.find(section => visibleSections.has(section));
    sectionLinks.forEach(link => {
      if (currentSection && link.hash === `#${currentSection.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-15% 0px -45% 0px' });
  sections.forEach(section => observer.observe(section));
}

document.querySelector('[data-current-year]').textContent = new Date().getFullYear();
