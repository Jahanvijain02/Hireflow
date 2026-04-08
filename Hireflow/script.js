const jobsContainer = document.getElementById("jobs");
const filterDropdown = document.getElementById("filterType");
const searchInput = document.getElementById("search");
const sortDropdown = document.getElementById("sortType");
const darkToggle = document.getElementById("darkToggle");

let allJobs = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  darkToggle.textContent = "☀️";
}

async function fetchJobs() {
  try {
    jobsContainer.innerHTML = "<p>⏳ Loading jobs...</p>";

    const response = await fetch("https://remotive.com/api/remote-jobs");
    const data = await response.json();

    allJobs = data.jobs;
    renderJobs(allJobs);

  } catch (error) {
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

searchInput.addEventListener("input", () => renderJobs(allJobs));
filterDropdown.addEventListener("change", () => renderJobs(allJobs));
sortDropdown.addEventListener("change", () => renderJobs(allJobs));

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

fetchJobs();