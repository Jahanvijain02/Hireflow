document.addEventListener("DOMContentLoaded", () => {

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }

  const container = document.getElementById("favoritesContainer");
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  function renderFavorites() {
    container.innerHTML = "";

    if (favorites.length === 0) {
      container.innerHTML = "<p>No favorites added.</p>";
      return;
    }

    favorites.forEach((job, index) => {

      const card = document.createElement("div");
      card.className = "job-card";

      card.innerHTML = `
        <span class="fav">⭐</span>

        <div class="card-header">
          <div class="icon-wrapper">💼</div>
          <span class="type-badge">${job.type}</span>
        </div>

        <h3 class="job-title">${job.title}</h3>
        <p class="company-line">${job.company}</p>

        <div class="meta-container">
          <span class="meta-tag">${job.category}</span>
        </div>

        <a href="${job.url}" target="_blank">
          <button class="apply-button">Apply Now</button>
        </a>
      `;

      card.querySelector(".fav").onclick = () => {
        favorites.splice(index, 1);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        renderFavorites();
      };

      container.appendChild(card);
    });
  }

  window.goBack = function () {
    window.location.href = "index.html";
  };

  renderFavorites();

});