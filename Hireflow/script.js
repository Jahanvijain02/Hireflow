const jobsContainer = document.getElementById("jobs");

async function fetchJobs() {
  try {
    jobsContainer.innerHTML = "<p>⏳ Loading jobs...</p>";

    const response = await fetch("https://remotive.com/api/remote-jobs");
    const data = await response.json();

    renderJobs(data.jobs);

  } catch (error) {
    jobsContainer.innerHTML = "<p>❌ Failed to load jobs</p>";
    console.error(error);
  }
}

function renderJobs(jobs) {
  jobsContainer.innerHTML = "";

  const limitedJobs = jobs.slice(0, 20);

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

fetchJobs();