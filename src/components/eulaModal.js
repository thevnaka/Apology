import { caseData } from '../data/caseData.js';
import { playGavelSound } from './effects.js';

export function renderEulaModal(containerEl, onAcceptCallback) {
  const { eula } = caseData;

  const html = `
    <div class="eula-overlay" id="eula-overlay">
      <div class="eula-modal">
        <div class="eula-header">
          <h2>${eula.title}</h2>
          <p>${eula.subtitle}</p>
        </div>
        <div class="eula-notice-bar">
          ⚖️ ${eula.notice}
        </div>
        <div class="eula-body" id="eula-body">
          ${eula.sections.map((section, idx) => `
            <div class="eula-clause">
              <h3>${section.heading}</h3>
              <p>${section.content}</p>
            </div>
          `).join('')}
          <div class="eula-clause" style="border-left-color: var(--amber-accent);">
            <h3>SCROLL ACKNOWLEDGEMENT — FINAL VERIFICATION</h3>
            <p>By reaching the bottom of this text, you confirm that you have read all terms of fault, acknowledged Defendant Amiru's sincere remorse, and are prepared to inspect the evidence presented in court.</p>
          </div>
        </div>
        <div class="eula-footer">
          <div class="scroll-progress-container">
            <div class="scroll-progress-bar">
              <div class="scroll-progress-fill" id="eula-progress-fill"></div>
            </div>
            <div class="scroll-progress-text" id="eula-progress-text">0% Scrolled</div>
          </div>
          <button class="btn-accept" id="btn-accept-eula" disabled>
            <span>📜 SCROLL ALL THE WAY DOWN TO ACCEPT</span>
          </button>
        </div>
      </div>
    </div>
  `;

  containerEl.innerHTML = html;

  const eulaBody = document.getElementById('eula-body');
  const fill = document.getElementById('eula-progress-fill');
  const text = document.getElementById('eula-progress-text');
  const btn = document.getElementById('btn-accept-eula');
  const overlay = document.getElementById('eula-overlay');

  let hasReachedBottom = false;

  function updateScrollProgress() {
    const scrollTop = eulaBody.scrollTop;
    const scrollHeight = eulaBody.scrollHeight;
    const clientHeight = eulaBody.clientHeight;

    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll <= 0) {
      fill.style.width = '100%';
      text.textContent = '100% Scrolled';
      enableButton();
      return;
    }

    const percentage = Math.min(100, Math.round((scrollTop / maxScroll) * 100));
    fill.style.width = `${percentage}%`;
    text.textContent = `${percentage}% Scrolled`;

    if (percentage >= 95 && !hasReachedBottom) {
      hasReachedBottom = true;
      enableButton();
    }
  }

  function enableButton() {
    btn.disabled = false;
    btn.innerHTML = `
      <span>🏛️ I ACCEPT & ENTER COURTROOM</span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    `;
  }

  eulaBody.addEventListener('scroll', updateScrollProgress);
  // Also check immediately in case container fits on high-res displays
  setTimeout(updateScrollProgress, 100);

  btn.addEventListener('click', () => {
    if (btn.disabled) return;

    // Play gavel sound effect
    playGavelSound();

    // Hide modal with transition
    overlay.classList.add('hidden');

    if (onAcceptCallback) {
      onAcceptCallback();
    }
  });
}
