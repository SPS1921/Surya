(function () {
  const data = window.PORTFOLIO_DATA || {};

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  function text(value) {
    return value == null ? "" : String(value);
  }

  function safeUrl(value) {
    const url = text(value).trim();
    return url || "#";
  }

  function renderFields() {
    $$("[data-field]").forEach((node) => {
      node.textContent = text(data[node.dataset.field]);
    });

    $$("[data-field-attr]").forEach((node) => {
      node.dataset.fieldAttr.split(",").forEach((rule) => {
        const [key, attr, mode] = rule.split(":");
        let value = data[key];
        if (mode === "mailto") value = `mailto:${data[key] || ""}`;
        if (mode === "tel") value = `tel:${text(data[key]).replace(/[^\d+]/g, "")}`;
        node.setAttribute(attr, safeUrl(value));
      });
    });

    $$("img[data-field-attr]").forEach((img) => {
      img.onerror = () => {
        img.onerror = null;
        img.src = "surya-linkedin.png";
      };
    });
  }

  function renderStats() {
    $('[data-repeat="stats"]').innerHTML = (data.stats || [])
      .map(
        (item) => `
          <article class="stat">
            <strong>${text(item.value)}</strong>
            <span>${text(item.label)}</span>
          </article>
        `
      )
      .join("");
  }

  function renderProjects() {
    $('[data-repeat="projects"]').innerHTML = (data.projects || [])
      .map(
        (project) => `
          <article class="project-card">
            ${
              project.image
                ? `<div class="project-visual"><img src="${safeUrl(project.image)}" alt="${text(project.title)} visual" loading="lazy"></div>`
                : ""
            }
            <div class="project-meta">
              <span>${text(project.type)}</span>
              <span>${text(project.year)}</span>
            </div>
            <h3>${text(project.title)}</h3>
            <p>${text(project.description)}</p>
            <div class="tag-list">
              ${(project.tags || []).map((tag) => `<span class="tag">${text(tag)}</span>`).join("")}
            </div>
          </article>
        `
      )
      .join("");
  }

  function renderShippedProjects() {
    const target = $('[data-repeat="shippedProjects"]');
    if (!target) return;
    target.innerHTML = (data.shippedProjects || [])
      .map(
        (project) => `
          <article class="product-card">
            <div class="product-status">
              <span>${text(project.status)}</span>
              <span>${text(project.type)}</span>
            </div>
            <h3>${text(project.title)}</h3>
            <p>${text(project.description)}</p>
            <div class="tag-list">
              ${(project.tags || []).map((tag) => `<span class="tag">${text(tag)}</span>`).join("")}
            </div>
            ${
              project.url && project.url !== "#"
                ? `<a class="product-link" href="${safeUrl(project.url)}" target="_blank" rel="noreferrer">Open live project</a>`
                : `<span class="product-link muted">Build in progress</span>`
            }
          </article>
        `
      )
      .join("");
  }

  function renderServices() {
    $('[data-repeat="services"]').innerHTML = (data.services || [])
      .map(
        (service) => `
          <article class="service-card">
            <h3>${text(service.title)}</h3>
            <p>${text(service.description)}</p>
          </article>
        `
      )
      .join("");
  }

  function renderSkills() {
    $('[data-repeat="skills"]').innerHTML = (data.skills || [])
      .map((skill) => `<span class="skill-pill">${text(skill)}</span>`)
      .join("");
  }

  function renderGroupedScroller(key) {
    const target = $(`[data-repeat="${key}"]`);
    if (!target) return;
    target.innerHTML = (data[key] || [])
      .map(
        (group) => `
          <article class="scroll-card">
            <h3>${text(group.title)}</h3>
            <ul>
              ${(group.items || []).map((item) => `<li>${text(item)}</li>`).join("")}
            </ul>
          </article>
        `
      )
      .join("");
  }

  function renderIndustries() {
    const target = $('[data-repeat="industries"]');
    if (!target) return;
    target.innerHTML = (data.industries || [])
      .map((industry) => `<span>${text(industry)}</span>`)
      .join("");
  }

  function renderEducation() {
    const target = $('[data-repeat="education"]');
    if (!target) return;
    const education = data.education || {};
    target.innerHTML = `
      <h3>${text(education.college)}</h3>
      <p>${text(education.degree)}</p>
      <p class="education-plan">${text(education.planned)}</p>
    `;
  }

  function renderExperience() {
    $('[data-repeat="experience"]').innerHTML = (data.experience || [])
      .map(
        (item) => `
          <article class="timeline-item">
            <time>${text(item.period)}</time>
            <div>
              <h3>${text(item.role)} - ${text(item.company)}</h3>
              <p>${text(item.details)}</p>
              ${
                item.highlights
                  ? `<ul class="experience-highlights">${item.highlights
                      .map((highlight) => `<li>${text(highlight)}</li>`)
                      .join("")}</ul>`
                  : ""
              }
            </div>
          </article>
        `
      )
      .join("");
  }

  function renderTestimonials() {
    $('[data-repeat="testimonials"]').innerHTML = (data.testimonials || [])
      .map(
        (item) => `
          <blockquote class="testimonial-card">
            <p>"${text(item.quote)}"</p>
            <footer>
              ${text(item.author)}
              <span>${text(item.title)}</span>
            </footer>
          </blockquote>
        `
      )
      .join("");
  }

  function renderSocials() {
    $('[data-repeat="socials"]').innerHTML = (data.socials || [])
      .map((item) => `<a href="${safeUrl(item.url)}" target="_blank" rel="noreferrer">${text(item.label)}</a>`)
      .join("");
  }

  function bindEvents() {
    const toggle = $("[data-menu-toggle]");
    if (toggle) {
      toggle.addEventListener("click", () => {
        $("[data-header]").classList.toggle("menu-open");
      });
    }

    $$(".nav a").forEach((link) => {
      link.addEventListener("click", () => $("[data-header]").classList.remove("menu-open"));
    });
  }

  document.title = `${data.name || "Portfolio"} | ${data.role || "Portfolio"}`;
  renderFields();
  renderStats();
  renderShippedProjects();
  renderProjects();
  renderServices();
  renderSkills();
  renderGroupedScroller("researchExposure");
  renderGroupedScroller("expertiseGroups");
  renderExperience();
  renderIndustries();
  renderEducation();
  renderTestimonials();
  renderSocials();
  bindEvents();
})();
