"use strict";

document.documentElement.classList.replace("no-js", "js");

const header = document.querySelector(".site-header");
const nav = document.querySelector(".site-nav");
const menuButton = document.querySelector(".menu-toggle");
const menuLabel = menuButton.querySelector("span");
const mobileViewport = window.matchMedia("(max-width: 850px)");

function closeMenu(returnFocus = false) {
  nav.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuLabel.textContent = "Menu";
  if (returnFocus) menuButton.focus();
}

menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  nav.classList.toggle("is-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuLabel.textContent = open ? "Close" : "Menu";
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

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 30);
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
      status.textContent = `${count} publications${year === "all" ? "" : ` from ${year}`}.`;
    });
  });
}

document.querySelectorAll("[data-current-year]").forEach(el => {
  el.textContent = new Date().getFullYear();
});

// Preserve links to sections in the previous single-page website.
if (document.body.dataset.page === "home") {
  const oldSections = { "#members": "members/", "#research": "research/", "#publications": "publications/", "#software": "software/", "#news": "news/", "#contact": "contact/" };
  const destination = oldSections[window.location.hash];
  if (destination) window.location.replace(destination);
}
