import './styles/main.css';
import { renderEulaModal } from './components/eulaModal.js';
import { renderDashboard } from './components/caseDashboard.js';
import { renderSettlementContract } from './components/settlementContract.js';
import { initBackgroundParticles, setupLightbox } from './components/effects.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Background Particle Canvas
  initBackgroundParticles();

  // 2. Setup Lightbox for Evidence Locker
  const openLightbox = setupLightbox();

  // 3. Render Phase 1: EULA Gateway
  const eulaContainer = document.getElementById('eula-container');
  renderEulaModal(eulaContainer, () => {
    // Scroll smooth to top of dashboard on accept
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 4. Render Phase 2: Main Dashboard
  const dashboardContainer = document.getElementById('dashboard-container');
  renderDashboard(dashboardContainer, openLightbox);

  // 5. Render Phase 3: Settlement Agreement Contract
  const settlementContainer = document.getElementById('settlement-container');
  renderSettlementContract(settlementContainer);
});
