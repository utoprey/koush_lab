"use strict";

// English is the default; only an explicit language choice is remembered.
(() => {
  try {
    const root = new URL("../", document.currentScript.src);
    const route = document.querySelector('meta[name="page-route"]').content;
    const preferred = localStorage.getItem("koush-lab-language");
    const russianError = route === "404.html" && window.location.pathname.startsWith(new URL("ru/", root).pathname);
    if (document.documentElement.lang !== "en") return;
    if (!russianError && !(preferred === "ru" && (route === "" || route === "404.html"))) return;
    const destination = new URL("ru/" + route, root);
    destination.search = window.location.search;
    destination.hash = window.location.hash;
    if (destination.href !== window.location.href) {
      document.documentElement.dataset.languageRedirecting = "true";
      window.location.replace(destination.href);
    }
  } catch {
    // Static language links also work when browser storage is unavailable.
  }
})();
