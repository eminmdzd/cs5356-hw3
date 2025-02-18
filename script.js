document.addEventListener("DOMContentLoaded", function () {
  const contentDiv = document.getElementById("content");
  const navLinks = document.querySelectorAll(".nav-link");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinksContainer = document.getElementById("nav-links");
  const navContainer = document.querySelector(".nav-container");

  const themeToggle = document.getElementById("theme-toggle");
  const htmlElement = document.documentElement;

  themeToggle.addEventListener("click", () => {
    htmlElement.classList.toggle("dark-mode");
  });

  // Read query parameter "page" (default to "home.html" if not provided)
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get("page") || "home.html";
  loadPage(page);
  updateActiveLink(page);

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const url = this.getAttribute("href").split("?page=")[1];
      updateActiveLink(url);
      loadPage(url);
      history.pushState({ page: url }, "", this.getAttribute("href"));
      // Close the hamburger menu on mobile if open
      if (
        window.innerWidth < 768 &&
        navLinksContainer.classList.contains("show")
      ) {
        navLinksContainer.classList.remove("show");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  });

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

  // Hover behavior: open menu on mouseenter over the toggle
  navToggle.addEventListener("mouseenter", () => {
    if (window.innerWidth < 1024) {
      navLinksContainer.classList.add("show");
      navToggle.setAttribute("aria-expanded", "true");
    }
  });

  // Close menu when mouse leaves the entire nav-container
  navContainer.addEventListener("mouseleave", () => {
    if (window.innerWidth < 1024) {
      navLinksContainer.classList.remove("show");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  // Tap/click behavior: toggle menu on click of the nav-toggle
  navToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    if (window.innerWidth < 768) {
      navLinksContainer.classList.toggle("show");
      navToggle.setAttribute(
        "aria-expanded",
        navLinksContainer.classList.contains("show") ? "true" : "false"
      );
    }
  });

  // Also close menu when clicking outside the nav-container
  document.addEventListener("click", (e) => {
    if (
      window.innerWidth < 768 &&
      navLinksContainer.classList.contains("show") &&
      !navContainer.contains(e.target)
    ) {
      navLinksContainer.classList.remove("show");
      navToggle.setAttribute("aria-expanded", "false");
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
