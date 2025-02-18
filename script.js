document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll("nav a");
  const contentDiv = document.getElementById("content");

  function loadPage(pageUrl) {
    fetch(pageUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((html) => {
        contentDiv.innerHTML = html;
      })
      .catch((error) => {
        contentDiv.innerHTML = "<p>Error loading page.</p>";
        console.error("Error loading page:", error);
      });
  }
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const pageUrl = link.getAttribute("href");
      loadPage(pageUrl);
      // Optionally update browser history (if needed)
      history.pushState({ page: pageUrl }, "", pageUrl);
    });
  });

  window.addEventListener("popstate", (event) => {
    const pageUrl = event.state ? event.state.page : "home.html";
    loadPage(pageUrl);
  });

  loadPage("home.html");
});
