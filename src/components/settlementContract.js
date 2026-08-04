import { caseData } from '../data/caseData.js';
import { triggerCelebration, playGavelSound } from './effects.js';

export function renderSettlementContract(containerEl) {
  const { settlementAgreement } = caseData;
  const clauses = settlementAgreement.clauses || [];
  const totalClauses = clauses.length;
  const letter = settlementAgreement.apologyLetter || {
    title: "CONSENT DECREE RATIFIED — A PERSONAL LETTER FOR YOU",
    subtitle: "From Thevnaka to Her Honor Nisindi",
    salutation: "Dearest Nisindi,",
    body: "I am writing this letter to tell you from the bottom of my heart how truly, deeply sorry I am.",
    valediction: "Forever Yours,",
    signature: "Thevnaka",
    whatsappNote: "Click below to let Thevnaka know you've accepted his apology! ❤️"
  };

  const html = `
    <section class="dashboard-section" id="phase-3-settlement">
      <div class="section-header-box">
        <div class="section-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <div>
          <h2 class="section-title">FINAL EXHIBIT — PROPOSED CONSENT DECREE & SETTLEMENT AGREEMENT</h2>
          <p class="section-subtitle">${settlementAgreement.subtitle || 'Legally Binding Covenants'}</p>
        </div>
      </div>

      <div class="settlement-card">
        <div class="contract-progress-box">
          <div class="contract-progress-info">
            <span>SETTLEMENT RATIFICATION STATUS</span>
            <span id="contract-status-text">0 of ${totalClauses} Clauses Accepted</span>
          </div>
          <div class="contract-bar">
            <div class="contract-bar-fill" id="contract-bar-fill"></div>
          </div>
        </div>

        <div class="clauses-list">
          ${clauses.map((clause) => `
            <div class="clause-item" data-clause-id="${clause.id}">
              <div class="checkbox-custom" id="check-${clause.id}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="display:none;"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div class="clause-content">
                <h4>${clause.label}</h4>
                <p>${clause.text}</p>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="signature-section">
          <div class="signature-pad-wrapper">
            <div class="sig-pad-header">PLAINTIFF DIGITAL SIGNATURE (NISINDI)</div>
            <div class="canvas-container" id="canvas-container">
              <canvas id="signature-canvas"></canvas>
              <div class="canvas-hint" id="canvas-hint">Sign or draw heart here...</div>
            </div>
            <button class="btn-clear-sig" id="btn-clear-sig">Clear Signature</button>
          </div>

          <button class="btn-ratify" id="btn-ratify" disabled>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
            <span>CHECK ALL CLAUSES TO RATIFY</span>
          </button>
        </div>
      </div>
    </section>

    <!-- REVEAL MODAL: PERSONAL APOLOGY LETTER -->
    <div class="reveal-modal-overlay" id="reveal-modal">
      <div class="reveal-card">
        <div class="reveal-header-stamp">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </div>
        <h2 class="reveal-title">${letter.title}</h2>
        <p class="reveal-subtitle">${letter.subtitle}</p>

        <!-- ELEGANT APOLOGY LETTER BOX -->
        <div class="letter-box">
          <div class="letter-salutation">${letter.salutation}</div>
          <div class="letter-body">${letter.body}</div>
          <div class="letter-valediction">
            <span>${letter.valediction}</span>
            <span class="letter-signature-name">${letter.signature}</span>
          </div>
        </div>

        <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem; font-style: italic;">
          "${letter.whatsappNote}"
        </p>

        <a href="https://wa.me/?text=I%20have%20accepted%20your%20apology%20letter%20in%20Docket%202026-08!%20❤️" target="_blank" class="btn-confirm-date">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          <span>SEND MESSAGE TO THEVNAKA ❤️</span>
        </a>
      </div>
    </div>
  `;

  containerEl.innerHTML = html;

  const checkedSet = new Set();
  const clauseItems = containerEl.querySelectorAll('.clause-item');
  const barFill = containerEl.querySelector('#contract-bar-fill');
  const statusText = containerEl.querySelector('#contract-status-text');
  const ratifyBtn = containerEl.querySelector('#btn-ratify');
  const revealModal = containerEl.querySelector('#reveal-modal');

  clauseItems.forEach((item) => {
    item.addEventListener('click', () => {
      const clauseId = item.getAttribute('data-clause-id');
      const icon = item.querySelector('.checkbox-custom svg');

      if (checkedSet.has(clauseId)) {
        checkedSet.delete(clauseId);
        item.classList.remove('checked');
        icon.style.display = 'none';
      } else {
        checkedSet.add(clauseId);
        item.classList.add('checked');
        icon.style.display = 'block';
      }

      updateProgress();
    });
  });

  function updateProgress() {
    const count = checkedSet.size;
    const pct = totalClauses > 0 ? Math.round((count / totalClauses) * 100) : 100;
    barFill.style.width = `${pct}%`;
    statusText.textContent = `${count} of ${totalClauses} Clauses Accepted`;

    if (count === totalClauses) {
      ratifyBtn.disabled = false;
      ratifyBtn.innerHTML = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        <span>RATIFY CONSENT DECREE & READ APOLOGY LETTER</span>
      `;
    } else {
      ratifyBtn.disabled = true;
      ratifyBtn.innerHTML = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
        <span>CHECK ALL ${totalClauses} CLAUSES TO RATIFY</span>
      `;
    }
  }

  const canvasContainer = containerEl.querySelector('#canvas-container');
  const canvas = containerEl.querySelector('#signature-canvas');
  const canvasHint = containerEl.querySelector('#canvas-hint');
  const clearBtn = containerEl.querySelector('#btn-clear-sig');

  if (canvas && canvasContainer) {
    const ctx = canvas.getContext('2d');
    let isDrawing = false;

    function resizeCanvas() {
      if (!canvasContainer.clientWidth) return;
      canvas.width = canvasContainer.clientWidth;
      canvas.height = canvasContainer.clientHeight;
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
    }

    setTimeout(resizeCanvas, 50);
    window.addEventListener('resize', resizeCanvas);

    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    function startDrawing(e) {
      isDrawing = true;
      canvasHint.style.display = 'none';
      const pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }

    function draw(e) {
      if (!isDrawing) return;
      if (e.touches) e.preventDefault();
      const pos = getPos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }

    function stopDrawing() {
      isDrawing = false;
    }

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);

    clearBtn.addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvasHint.style.display = 'block';
    });
  }

  ratifyBtn.addEventListener('click', () => {
    if (ratifyBtn.disabled) return;

    playGavelSound();
    triggerCelebration();

    setTimeout(() => {
      document.body.style.overflow = 'hidden';
      revealModal.classList.add('active');
    }, 400);
  });
}
