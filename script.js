document.addEventListener("DOMContentLoaded", function () {
  const contentDiv = document.getElementById("content");
  const navLinks = document.querySelectorAll(".nav-link");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinksContainer = document.getElementById("nav-links");

  // Read query parameter "page" (default to "home.html" if not provided)
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get("page") || "home.html";
  loadPage(page);
  updateActiveLink(page);

  // Navigation link click handling
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

  // Handle back/forward navigation
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

  // Optional: Toggle hamburger menu on hover for small screens
  if (window.innerWidth < 1024) {
    const navContainer = document.querySelector(".nav-container");
    navToggle.addEventListener("mouseenter", () => {
      navLinksContainer.classList.add("show");
      navToggle.setAttribute("aria-expanded", "true");
    });
    navContainer.addEventListener("mouseleave", () => {
      navLinksContainer.classList.remove("show");
      navToggle.setAttribute("aria-expanded", "false");
    });
  }

  function adjustNav() {
    if (window.innerWidth >= 768) {
      navLinksContainer.classList.remove("show");
      navToggle.setAttribute("aria-expanded", "false");
    }
  }
  adjustNav();
  window.addEventListener("resize", adjustNav);
});
