import { caseData } from '../data/caseData.js';
import { playGavelSound } from './effects.js';

export function renderEulaModal(containerEl, onAcceptCallback) {
  const { eula, meta } = caseData;
  const defendantName = meta?.defendant || "Thevnaka";

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
          ${eula.sections.map((section) => `
            <div class="eula-clause">
              <h3>${section.heading}</h3>
              <p>${section.content}</p>
            </div>
          `).join('')}
          <div class="eula-clause" style="border-left-color: var(--gold-primary);">
            <h3>SCROLL ACKNOWLEDGEMENT — FINAL VERIFICATION</h3>
            <p>By reaching the bottom of this text, you confirm that you have read all terms of fault, acknowledged ${defendantName}'s sincere remorse, and are prepared to inspect the evidence presented in court.</p>
          </div>
        </div>
        <div class="eula-footer">
          <div class="scroll-progress-container" id="scroll-progress-trigger" style="cursor: pointer;">
            <div class="scroll-progress-bar">
              <div class="scroll-progress-fill" id="eula-progress-fill"></div>
            </div>
            <div class="scroll-progress-text" id="eula-progress-text">0% Scrolled</div>
          </div>
          <button class="btn-accept" id="btn-accept-eula" disabled>
            <span>📜 SCROLL TO BOTTOM TO UNLOCK & ACCEPT</span>
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
  const progressTrigger = document.getElementById('scroll-progress-trigger');

  let hasReachedBottom = false;

  // Prevent outer background page scrolling while modal is open
  document.body.style.overflow = 'hidden';

  function updateScrollProgress() {
    if (!eulaBody) return;
    const scrollTop = eulaBody.scrollTop;
    const scrollHeight = eulaBody.scrollHeight;
    const clientHeight = eulaBody.clientHeight;

    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll <= 5) {
      fill.style.width = '100%';
      text.textContent = '100% Scrolled';
      enableButton();
      return;
    }

    const percentage = Math.min(100, Math.round((scrollTop / maxScroll) * 100));
    fill.style.width = `${Math.max(percentage, 5)}%`;
    text.textContent = `${percentage}% Scrolled`;

    // Unlock if scrolled past 80% or within 35px of bottom (mobile subpixel tolerance)
    if ((percentage >= 80 || (scrollTop + clientHeight >= scrollHeight - 35)) && !hasReachedBottom) {
      hasReachedBottom = true;
      enableButton();
    }
  }

  function enableButton() {
    hasReachedBottom = true;
    fill.style.width = '100%';
    text.textContent = '100% Scrolled';
    btn.disabled = false;
    btn.innerHTML = `
      <span>🏛️ I ACCEPT & ENTER COURTROOM</span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    `;
  }

  // Scroll and touch listeners
  eulaBody.addEventListener('scroll', updateScrollProgress, { passive: true });
  eulaBody.addEventListener('touchmove', updateScrollProgress, { passive: true });
  window.addEventListener('resize', updateScrollProgress);

  // Direct progress bar click fallback for quick unlocking
  if (progressTrigger) {
    progressTrigger.addEventListener('click', enableButton);
  }

  // Initial check after rendering
  setTimeout(updateScrollProgress, 150);
  setTimeout(updateScrollProgress, 500);

  btn.addEventListener('click', () => {
    if (btn.disabled) return;

    // Play gavel sound effect
    playGavelSound();

    // Restore body scrolling
    document.body.style.overflow = 'auto';

    // Hide modal smoothly
    overlay.classList.add('hidden');
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 500);

    if (onAcceptCallback) {
      onAcceptCallback();
    }
  });
}
