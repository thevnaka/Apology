import { caseData } from '../data/caseData.js';

export function renderDashboard(containerEl, openLightboxFn) {
  const { meta, statementOfFacts, evidenceLocker } = caseData;

  const html = `
    <header class="case-header">
      <div class="header-top">
        <span class="badge-docket">${meta.docketNumber}</span>
        <span class="badge-status"><span class="status-dot"></span> ${meta.status}</span>
      </div>
      <h1 class="case-title">${meta.caseTitle}</h1>
      <p class="court-subtitle">${meta.court} • ${meta.jurisdiction}</p>

      <div class="meta-grid">
        <div class="meta-item">
          <span class="meta-label">PLAINTIFF (PRESIDING JUDGE)</span>
          <span class="meta-value">${meta.presidingJudge}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">DEFENDANT</span>
          <span class="meta-value">${meta.defendant}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">FILING DATE</span>
          <span class="meta-value">${meta.filedDate}</span>
        </div>
      </div>
    </header>

    <section class="dashboard-section" id="exhibit-a">
      <div class="section-header-box">
        <div class="section-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        </div>
        <div>
          <h2 class="section-title">${statementOfFacts.title}</h2>
          <p class="section-subtitle">${statementOfFacts.subtitle}</p>
        </div>
      </div>

      <div class="affidavit-card">
        <div class="affidavit-top-bar">
          <span class="affidavit-badge">SWORN DEPOSITION</span>
        </div>
        <div class="affidavit-text">${statementOfFacts.body}</div>
        <div class="affidavit-signature-block">
          <div class="sig-info">
            <span class="sig-name">${meta.defendant}</span>
            <span class="sig-title">Sworn & Deposed</span>
          </div>
          <div class="legal-seal-stamp">
            OFFICIAL<br/>ADMISSION<br/>STAMP
          </div>
        </div>
      </div>
    </section>

    <section class="dashboard-section" id="exhibit-b">
      <div class="section-header-box">
        <div class="section-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </div>
        <div>
          <h2 class="section-title">EXHIBIT B — PHYSICAL & DOCUMENTARY EVIDENCE LOCKER</h2>
          <p class="section-subtitle">Visual Proof & Memory Archive Admitted Into Court Record</p>
        </div>
      </div>

      <div class="evidence-grid">
        ${evidenceLocker.map((item) => `
          <div class="evidence-card" data-ev-id="${item.id}">
            <div class="evidence-media-wrapper">
              <span class="evidence-tag">${item.tag}</span>
              <img src="${item.image}" alt="${item.title}" loading="eager" />
            </div>
            <div class="evidence-content">
              <span class="evidence-category">${item.category}</span>
              <h3 class="evidence-title">${item.title}</h3>
              <p class="evidence-caption">${item.caption}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;

  containerEl.innerHTML = html;

  const cards = containerEl.querySelectorAll('.evidence-card');
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const evId = card.getAttribute('data-ev-id');
      const item = evidenceLocker.find((i) => i.id === evId);
      if (item && openLightboxFn) {
        openLightboxFn(item.image, item.title, item.caption);
      }
    });
  });
}
