const jobsContainer = document.getElementById("jobs");
const filterDropdown = document.getElementById("filterType");
const searchInput = document.getElementById("search");
const sortDropdown = document.getElementById("sortType");
const darkToggle = document.getElementById("darkToggle");

let allJobs = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  if (darkToggle) darkToggle.textContent = "☀️";
}

async function fetchJobs() {
  try {
    jobsContainer.innerHTML = "<p>⏳ Loading jobs...</p>";

    const response = await fetch("https://remotive.io/api/remote-jobs");

    if (!response.ok) {
      throw new Error("API failed");
    }

    const data = await response.json();

    allJobs = data.jobs || [];
    renderJobs(allJobs);

  } catch (error) {
    console.error("Error:", error); // helpful for debugging
    jobsContainer.innerHTML = "<p>❌ Failed to load jobs</p>";
  }
}

function renderJobs(jobs) {
  jobsContainer.innerHTML = "";

  let filtered = jobs;

  const searchVal = searchInput.value.toLowerCase();
  filtered = filtered.filter(job =>
    job.title.toLowerCase().includes(searchVal)
  );

  if (filterDropdown.value !== "all") {
    filtered = filtered.filter(job =>
      job.job_type === filterDropdown.value
    );
  }

  if (sortDropdown.value === "title") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  }

  filtered.slice(0, 20).forEach(job => {
    const isFav = favorites.some(f => f.id === job.id);

    const card = document.createElement("div");
    card.className = "job-card";

    card.innerHTML = `
      <span class="fav">${isFav ? "⭐" : "☆"}</span>

      <div class="card-header">
        <div class="icon-wrapper">💼</div>
        <span class="type-badge">${job.job_type}</span>
      </div>

      <h3 class="job-title">${job.title}</h3>
      <p class="company-line">${job.company_name}</p>

      <div class="meta-container">
        <span class="meta-tag">${job.category}</span>
      </div>

      <a href="${job.url}" target="_blank">
        <button class="apply-button">Apply Now</button>
      </a>
    `;

    // ⭐ Favorites toggle
    card.querySelector(".fav").onclick = () => {
      const exists = favorites.some(f => f.id === job.id);

      if (exists) {
        favorites = favorites.filter(f => f.id !== job.id);
      } else {
        favorites.push({
          id: job.id,
          title: job.title,
          company: job.company_name,
          category: job.category,
          type: job.job_type,
          url: job.url
        });
      }

      localStorage.setItem("favorites", JSON.stringify(favorites));
      renderJobs(allJobs);
    };

    jobsContainer.appendChild(card);
  });
}

if (searchInput) {
  searchInput.addEventListener("input", () => renderJobs(allJobs));
}

if (filterDropdown) {
  filterDropdown.addEventListener("change", () => renderJobs(allJobs));
}

if (sortDropdown) {
  sortDropdown.addEventListener("change", () => renderJobs(allJobs));
}

if (darkToggle) {
  darkToggle.onclick = () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
      darkToggle.textContent = "☀️";
    } else {
      localStorage.setItem("theme", "light");
      darkToggle.textContent = "🌙";
    }
  };
}

fetchJobs();