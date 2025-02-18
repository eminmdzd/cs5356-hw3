document.addEventListener("DOMContentLoaded", function () {
  const contentDiv = document.getElementById("content");
  const navLinks = document.querySelectorAll(".nav-link");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinksContainer = document.getElementById("nav-links");
  const navContainer = document.querySelector(".nav-container");

  // Read query parameter "page" (default to "home.html" if not provided)
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get("page") || "home.html";
  loadPage(page);
  updateActiveLink(page);

  // Link click: update content, history, and close menu if open
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const url = this.getAttribute("href").split("?page=")[1];
      updateActiveLink(url);
      loadPage(url);
      history.pushState({ page: url }, "", this.getAttribute("href"));
      if (
        window.innerWidth < 768 &&
        navLinksContainer.classList.contains("show")
      ) {
        navLinksContainer.classList.remove("show");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  // Handle browser back/forward navigation
  window.addEventListener("popstate", function (e) {
    const page = e.state ? e.state.page : "home.html";
    loadPage(page);
    updateActiveLink(page);
  });

  function loadPage(url) {
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.text();
      })
      .then((html) => {
        contentDiv.innerHTML = html;
      })
      .catch(() => {
        contentDiv.innerHTML = "<p>Error loading page.</p>";
      });
  }

  function updateActiveLink(pageUrl) {
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").includes(pageUrl)) {
        link.classList.add("active");
      }
    });
  }

  // Toggle hamburger menu on click (for tap/click)
  navToggle.addEventListener("click", () => {
    if (window.innerWidth < 768) {
      navLinksContainer.classList.toggle("show");
      navToggle.setAttribute(
        "aria-expanded",
        navLinksContainer.classList.contains("show")
      );
    }
  });

  // Close hamburger menu when mouse leaves the nav-container (for hover)
  navContainer.addEventListener("mouseleave", () => {
    if (
      window.innerWidth < 1024 &&
      navLinksContainer.classList.contains("show")
    ) {
      navLinksContainer.classList.remove("show");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  // Optional: close menu when clicking outside the nav-container
  document.addEventListener("click", (e) => {
    if (
      window.innerWidth < 768 &&
      navLinksContainer.classList.contains("show")
    ) {
      if (!navContainer.contains(e.target)) {
        navLinksContainer.classList.remove("show");
        navToggle.setAttribute("aria-expanded", "false");
      }
    }
  });

  function adjustNav() {
    if (window.innerWidth >= 768) {
      navLinksContainer.classList.remove("show");
      navToggle.setAttribute("aria-expanded", "false");
    }
  }
  adjustNav();
  window.addEventListener("resize", adjustNav);
});
