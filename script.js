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
        if (url === "api.html") {
          initializeJokeFeature();
        }
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

  navToggle.addEventListener("mouseenter", () => {
    if (window.innerWidth < 1024) {
      navLinksContainer.classList.add("show");
      navToggle.setAttribute("aria-expanded", "true");
    }
  });

  navContainer.addEventListener("mouseleave", () => {
    if (window.innerWidth < 1024) {
      navLinksContainer.classList.remove("show");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

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

  function initializeJokeFeature() {
    const jokeButton = document.getElementById("joke-button");
    const setupEl = document.getElementById("setup");
    const punchlineEl = document.getElementById("punchline");
    const jokeContainer = document.getElementById("joke-container");

    if (jokeButton) {
      jokeButton.addEventListener("mouseover", () => {
        jokeButton.style.transform = "scale(1.1)";
        jokeButton.style.transition = "transform 0.3s ease";
      });

      jokeButton.addEventListener("mouseout", () => {
        jokeButton.style.transform = "scale(1)";
      });

      if (jokeContainer) {
        jokeContainer.addEventListener("mouseover", () => {
          setupEl.style.color = "#c44";
          setupEl.style.transition = "color 0.3s ease";
        });

        jokeContainer.addEventListener("mouseout", () => {
          setupEl.style.color = "";
        });
      }
      jokeButton.addEventListener("click", () => {
        jokeButton.textContent = "Loading...";
        jokeButton.disabled = true;

        fetch("https://official-joke-api.appspot.com/random_joke")
          .then((response) => response.json())
          .then((data) => {
            setupEl.textContent = data.setup;
            setTimeout(() => {
              punchlineEl.textContent = data.punchline;
              punchlineEl.style.opacity = "1";
            }, 1000);
            jokeButton.textContent = "Get a Joke";
            jokeButton.disabled = false;
          })
          .catch((error) => {
            console.error("Error fetching joke:", error);
            setupEl.textContent = "Oops, something went wrong!";
            punchlineEl.textContent = "";
            jokeButton.textContent = "Get a Joke";
            jokeButton.disabled = false;
          });
      });
    }
  }
});
