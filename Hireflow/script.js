const jobsContainer = document.getElementById("jobs");
const filterDropdown = document.getElementById("filterType");
const searchInput = document.getElementById("search");
const sortDropdown = document.getElementById("sortType");

let allJobs = [];

async function fetchJobs() {
  try {
    jobsContainer.innerHTML = "<p>⏳ Loading jobs...</p>";

    const response = await fetch("https://remotive.com/api/remote-jobs");
    const data = await response.json();

    allJobs = data.jobs;
    renderJobs(allJobs);

  } catch (error) {
    jobsContainer.innerHTML = "<p>❌ Failed to load jobs</p>";
    console.error(error);
  }
}

function renderJobs(jobs) {
  jobsContainer.innerHTML = "";

  const searchVal = searchInput.value.toLowerCase();

  let filteredJobs = jobs
    .filter(job => job.title.toLowerCase().includes(searchVal));

  if (filterDropdown.value !== "all") {
    filteredJobs = filteredJobs.filter(job => job.job_type === filterDropdown.value);
  }

  if (sortDropdown.value === "title") {
    filteredJobs.sort((a, b) => a.title.localeCompare(b.title));
  }

  const limitedJobs = filteredJobs.slice(0, 20);

  limitedJobs.forEach((job) => {
    const card = document.createElement("div");
    card.className = "job-card";

    card.innerHTML = `
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

    jobsContainer.appendChild(card);
  });
}

searchInput.addEventListener("input", () => renderJobs(allJobs));
filterDropdown.addEventListener("change", () => renderJobs(allJobs));
sortDropdown.addEventListener("change", () => renderJobs(allJobs));

fetchJobs();