(function () {
  const storageKey = "suryaPortfolioDataV4";
  const defaults = window.PORTFOLIO_DATA || {};
  const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
  let data = { ...defaults, ...saved };
  let editorBaseline = {};

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
      const key = node.dataset.field;
      node.textContent = text(data[key]);
    });

    $$("[data-field-attr]").forEach((node) => {
      const rules = node.dataset.fieldAttr.split(",");
      rules.forEach((rule) => {
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

  function renderRepeats() {
    renderStats();
    renderProjects();
    renderServices();
    renderSkills();
    renderExperience();
    renderTestimonials();
    renderSocials();
  }

  function renderStats() {
    const target = $('[data-repeat="stats"]');
    target.innerHTML = (data.stats || [])
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
    const target = $('[data-repeat="projects"]');
    target.innerHTML = (data.projects || [])
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

  function renderServices() {
    const target = $('[data-repeat="services"]');
    target.innerHTML = (data.services || [])
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
    const target = $('[data-repeat="skills"]');
    target.innerHTML = (data.skills || [])
      .map((skill) => `<span class="skill-pill">${text(skill)}</span>`)
      .join("");
  }

  function renderExperience() {
    const target = $('[data-repeat="experience"]');
    target.innerHTML = (data.experience || [])
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
    const target = $('[data-repeat="testimonials"]');
    target.innerHTML = (data.testimonials || [])
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
    const target = $('[data-repeat="socials"]');
    target.innerHTML = (data.socials || [])
      .map((item) => `<a href="${safeUrl(item.url)}" target="_blank" rel="noreferrer">${text(item.label)}</a>`)
      .join("");
  }

  function hydrateEditor() {
    editorBaseline = { ...data };
    $$("[data-edit]").forEach((input) => {
      input.value = text(data[input.dataset.edit]);
    });
    $("[data-json-editor]").value = JSON.stringify(data, null, 2);
    $("[data-editor-status]").textContent = "";
  }

  function saveEditor() {
    try {
      data = JSON.parse($("[data-json-editor]").value);
      $$("[data-edit]").forEach((input) => {
        const key = input.dataset.edit;
        if (input.value !== text(editorBaseline[key])) {
          data[key] = input.value;
        }
      });
    } catch (error) {
      $("[data-editor-status]").textContent = "Please fix the JSON before saving.";
      return;
    }
    localStorage.setItem(storageKey, JSON.stringify(data));
    render();
    closeEditor();
  }

  function resetEditor() {
    localStorage.removeItem(storageKey);
    data = { ...defaults };
    render();
    hydrateEditor();
  }

  function openEditor() {
    hydrateEditor();
    $("[data-editor]").hidden = false;
  }

  function closeEditor() {
    $("[data-editor]").hidden = true;
  }

  function bindEvents() {
    $("[data-menu-toggle]").addEventListener("click", () => {
      $("[data-header]").classList.toggle("menu-open");
    });

    $$(".nav a").forEach((link) => {
      link.addEventListener("click", () => $("[data-header]").classList.remove("menu-open"));
    });

    $("[data-editor-open]").addEventListener("click", openEditor);
    $("[data-editor-close]").addEventListener("click", closeEditor);
    $("[data-save]").addEventListener("click", saveEditor);
    $("[data-reset]").addEventListener("click", resetEditor);
  }

  function render() {
    document.title = `${data.name || "Portfolio"} | ${data.role || "Portfolio"}`;
    renderFields();
    renderRepeats();
  }

  render();
  bindEvents();
})();
