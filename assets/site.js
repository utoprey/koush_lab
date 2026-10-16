"use strict";

document.documentElement.classList.replace("no-js", "js");

const russian = document.documentElement.lang === "ru";
const labels = russian ? { menu: "Меню", close: "Закрыть" } : { menu: "Menu", close: "Close" };

const languageLinks = document.querySelectorAll("a[data-language]");
function updateLanguageLinks() {
  languageLinks.forEach(link => {
    const destination = new URL(link.href);
    destination.search = window.location.search;
    destination.hash = window.location.hash;
    link.href = destination.href;
  });
}
updateLanguageLinks();
window.addEventListener("hashchange", updateLanguageLinks);
languageLinks.forEach(link => {
  link.addEventListener("click", () => {
    updateLanguageLinks();
    try {
      localStorage.setItem("koush-lab-language", link.dataset.language);
    } catch {
      // The destination URL keeps the language choice without browser storage.
    }
  });
});

const header = document.querySelector(".site-header");
const nav = document.querySelector(".site-nav");
const menuButton = document.querySelector(".menu-toggle");
if (nav && menuButton) {
  const menuLabel = menuButton.querySelector("span");
  const mobileViewport = window.matchMedia("(max-width: 1050px)");

  function closeMenu(returnFocus = false) {
    nav.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuLabel.textContent = labels.menu;
    if (returnFocus) menuButton.focus();
  }

  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    nav.classList.toggle("is-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuLabel.textContent = open ? labels.close : labels.menu;
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) closeMenu(true);
  });
  document.addEventListener("click", event => {
    if (!nav.contains(event.target)) closeMenu();
  });
  nav.addEventListener("focusout", event => {
    if (!nav.contains(event.relatedTarget)) closeMenu();
  });
  mobileViewport.addEventListener("change", () => closeMenu());
}

function updateHeader() {
  if (header) header.classList.toggle("is-scrolled", window.scrollY > 30);
}
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const controls = document.querySelector(".publication-controls");
if (controls) {
  controls.hidden = false;
  const filters = controls.querySelectorAll(".filter-button");
  const publications = document.querySelectorAll(".publication");
  const status = document.querySelector("#publication-status");
  filters.forEach(button => {
    button.addEventListener("click", () => {
      const year = button.dataset.year;
      let count = 0;
      filters.forEach(filter => filter.setAttribute("aria-pressed", String(filter === button)));
      publications.forEach(publication => {
        const visible = year === "all" || publication.dataset.year === year;
        publication.hidden = !visible;
        if (visible) count++;
      });
      if (russian) {
        const lastTwo = count % 100;
        const last = count % 10;
        const noun = lastTwo >= 11 && lastTwo <= 14 ? "публикаций" : last === 1 ? "публикация" : last >= 2 && last <= 4 ? "публикации" : "публикаций";
        status.textContent = `${count} ${noun}${year === "all" ? "" : ` за ${year} год`}.`;
      } else {
        status.textContent = `${count} publications${year === "all" ? "" : ` from ${year}`}.`;
      }
    });
  });
}

document.querySelectorAll("[data-current-year]").forEach(el => {
  el.textContent = new Date().getFullYear();
});

// Preserve links to sections in the previous single-page website.
if (document.body.dataset.page === "home" && !document.documentElement.dataset.languageRedirecting) {
  const oldSections = { "#members": "members/", "#research": "research/", "#publications": "publications/", "#software": "software/", "#news": "news/", "#contact": "contact/" };
  const destination = oldSections[window.location.hash];
  if (destination) window.location.replace(destination);
}
