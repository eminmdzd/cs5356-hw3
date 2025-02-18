document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-link");
  const contentDiv = document.getElementById("content");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinksContainer = document.getElementById("nav-links");
  loadPage("home.html");
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const url = this.getAttribute("href");
      if (navLinksContainer.classList.contains("show")) {
        navLinksContainer.classList.remove("show");
        navToggle.setAttribute("aria-expanded", "false");
      }
      document
        .querySelectorAll(".nav-link")
        .forEach((n) => n.classList.remove("active"));
      this.classList.add("active");
      loadPage(url);
      history.pushState({ page: url }, "", url);
    });
  });
  window.addEventListener("popstate", function (e) {
    const page = e.state ? e.state.page : "home.html";
    loadPage(page);
  });
  function loadPage(url) {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((html) => {
        contentDiv.innerHTML = html;
      })
      .catch((err) => {
        contentDiv.innerHTML = "<p>Error loading page.</p>";
      });
  }
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", !expanded);
    navLinksContainer.classList.toggle("show");
  });
});
