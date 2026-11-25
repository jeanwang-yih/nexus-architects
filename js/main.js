import { PROJECTS, METHODOLOGY_PHASES } from './projects-data.js';
import { ArchitecturalViewer3D } from './viewer3d.js';

const MODE_LABELS = {
  exterior: '外觀自由旋轉模式',
  cutaway: '剖面開頂透視模式',
  plan: '頂視平面圖模式',
  walk: '室內空間漫遊模式'
};

const MODE_HINTS = {
  exterior: '左鍵拖曳旋轉 · 滾輪縮放 · 右鍵平移 · 點擊室內紅點瞬移',
  cutaway: '屋頂已自動掀開，可旋轉俯瞰各樓層空間與家具動線',
  plan: '正交俯視角度檢視動線與機能分區 · 可拖曳微調視角',
  walk: '拖曳滑鼠環顧室內 · WASD / 方向鍵走動 · 或點擊點位切換房間'
};

function formatSunLabel(hour) {
  const h = Math.floor(hour);
  const m = Math.round((hour - h) * 60);
  const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  if (hour < 8.5) return `${timeStr} 清晨微光`;
  if (hour < 11.5) return `${timeStr} 上午採光`;
  if (hour < 15.0) return `${timeStr} 正午日照`;
  if (hour < 18.0) return `${timeStr} 黃金時刻`;
  if (hour < 19.5) return `${timeStr} 黃昏暮色`;
  return `${timeStr} 夜間照明`;
}

function initApp() {
  const canvas = document.getElementById('architect-canvas');
  const stageEl = document.getElementById('canvas-stage');
  const loadingEl = document.getElementById('viewer-loading');

  const projectTabsEl = document.getElementById('project-tabs');
  const hotspotPillsEl = document.getElementById('hotspot-pills');
  const hudModeLabel = document.getElementById('hud-mode-label');
  const hudCameraHint = document.getElementById('hud-camera-hint');
  const walkHud = document.getElementById('walk-hud');
  const roomCaption = document.getElementById('room-caption');
  const roomCaptionFloor = document.getElementById('room-caption-floor');
  const roomCaptionTitle = document.getElementById('room-caption-title');
  const roomCaptionDesc = document.getElementById('room-caption-desc');

  const sunSlider = document.getElementById('sun-slider');
  const sunTimeReadout = document.getElementById('sun-time-readout');
  const autoRotateBtn = document.getElementById('btn-auto-rotate');

  let activeHotspotId = null;

  function renderProjectTabs(selectedId) {
    projectTabsEl.innerHTML = '';
    Object.values(PROJECTS).forEach((proj) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `project-tab ${proj.id === selectedId ? 'active' : ''}`;
      btn.innerHTML = `
        <div class="project-tab-main">
          <span class="project-tab-title">${proj.shortName}</span>
          <span class="project-tab-sub">${proj.category} · ${proj.area}</span>
        </div>
        <span class="project-tab-tag">${proj.tag}</span>
      `;
      btn.addEventListener('click', () => selectProject(proj.id));
      projectTabsEl.appendChild(btn);
    });
  }

  function renderProjectInfo(projectId) {
    const proj = PROJECTS[projectId];
    document.getElementById('project-category').textContent = proj.category;
    document.getElementById('project-title').textContent = `${proj.shortName} ${proj.englishName}`;
    document.getElementById('project-area').textContent = proj.area;
    document.getElementById('project-desc').textContent = proj.description;
  }

  function renderHotspotPills(projectId) {
    const proj = PROJECTS[projectId];
    if (!proj) return;
    hotspotPillsEl.innerHTML = '';
    proj.hotspots.forEach((spot) => {
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = `hotspot-pill ${spot.id === activeHotspotId ? 'active' : ''}`;
      pill.textContent = spot.label;
      pill.addEventListener('click', () => viewer.focusHotspot(spot.id));
      hotspotPillsEl.appendChild(pill);
    });
  }

  const viewer = new ArchitecturalViewer3D(canvas, stageEl, {
    onViewModeChange(mode) {
      hudModeLabel.textContent = MODE_LABELS[mode] || MODE_LABELS.exterior;
      hudCameraHint.textContent = MODE_HINTS[mode] || MODE_HINTS.exterior;
      walkHud.classList.toggle('hidden', mode !== 'walk');

      document.querySelectorAll('#view-mode-controls .seg-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.viewMode === mode);
      });

      if (mode === 'walk') {
        autoRotateBtn.classList.remove('active');
      } else {
        activeHotspotId = null;
        roomCaption.classList.add('hidden');
        renderHotspotPills(viewer.currentProjectId);
      }
    },
    onHotspotSelect(spot) {
      if (!spot) {
        activeHotspotId = null;
        roomCaption.classList.add('hidden');
      } else {
        activeHotspotId = spot.id;
        roomCaptionFloor.textContent = spot.floor;
        roomCaptionTitle.textContent = spot.label;
        roomCaptionDesc.textContent = spot.description;
        roomCaption.classList.remove('hidden');
      }
      renderHotspotPills(viewer.currentProjectId);
    }
  });

  function selectProject(projectId) {
    activeHotspotId = null;
    viewer.loadProject(projectId);
    renderProjectTabs(projectId);
    renderProjectInfo(projectId);
    renderHotspotPills(projectId);
  }

  // Initial load & render
  viewer.loadProject('villa', { immediate: true });
  renderProjectTabs('villa');
  renderProjectInfo('villa');
  renderHotspotPills('villa');

  // Hide loading overlay once first render completes
  requestAnimationFrame(() => {
    loadingEl.classList.add('hidden');
  });

  // View mode buttons
  document.querySelectorAll('#view-mode-controls .seg-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      viewer.setViewMode(btn.dataset.viewMode);
    });
  });

  // Render style buttons
  document.querySelectorAll('#render-style-controls .seg-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#render-style-controls .seg-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      viewer.applyRenderStyle(btn.dataset.renderStyle);
    });
  });

  // Sun slider
  sunSlider.addEventListener('input', () => {
    const val = parseFloat(sunSlider.value);
    sunTimeReadout.textContent = formatSunLabel(val);
    viewer.setSunHour(val);
  });

  // Auto rotate, Reset, Fullscreen
  autoRotateBtn.addEventListener('click', () => {
    const next = !viewer.autoRotate;
    viewer.setAutoRotate(next);
    autoRotateBtn.classList.toggle('active', viewer.autoRotate);
  });

  document.getElementById('btn-reset-view').addEventListener('click', () => {
    viewer.setViewMode('exterior');
  });

  document.getElementById('btn-fullscreen').addEventListener('click', () => {
    if (!document.fullscreenElement) {
      stageEl.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  });

  // Hero & Header shortcuts
  document.getElementById('btn-hero-cutaway').addEventListener('click', () => {
    viewer.setViewMode('cutaway');
  });

  document.getElementById('btn-hero-walk').addEventListener('click', () => {
    viewer.setViewMode('walk');
  });

  document.getElementById('btn-jump-interior').addEventListener('click', () => {
    document.getElementById('studio-3d').scrollIntoView({ behavior: 'smooth' });
    viewer.setViewMode('walk');
  });

  // Walk D-Pad hold controls
  document.querySelectorAll('.walk-dpad button[data-move]').forEach((btn) => {
    const dir = btn.dataset.move;
    const start = (e) => {
      e.preventDefault();
      viewer.setWalkDirection(dir, true);
    };
    const stop = () => viewer.setWalkDirection(dir, false);
    btn.addEventListener('pointerdown', start);
    btn.addEventListener('pointerup', stop);
    btn.addEventListener('pointerleave', stop);
    btn.addEventListener('pointercancel', stop);
  });

  // Service cards launching corresponding 3D models
  document.querySelectorAll('[data-load-project]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.loadProject;
      selectProject(targetId);
      document.getElementById('studio-3d').scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Methodology interactive phase cards
  const methodDetailPanel = document.getElementById('method-detail-panel');
  function renderMethodPhase(phaseKey) {
    const phase = METHODOLOGY_PHASES[phaseKey];
    if (!phase) return;
    methodDetailPanel.innerHTML = `
      <div>
        <span class="mono-label">${phase.code}</span>
        <h4>${phase.title}</h4>
        <p>${phase.summary}</p>
      </div>
      <div class="method-deliverables">
        ${phase.deliverables.map((d) => `<span class="deliverable-tag">${d}</span>`).join('')}
      </div>
    `;
  }
  renderMethodPhase('01');

  document.querySelectorAll('.method-card').forEach((card) => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.method-card').forEach((c) => c.classList.remove('active'));
      card.classList.add('active');
      renderMethodPhase(card.dataset.phase);
    });
  });

  // Consultation form submission
  const form = document.getElementById('consultation-form');
  const feedback = document.getElementById('form-feedback');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get('name');
    const service = data.get('service');
    const ref = data.get('reference');
    feedback.innerHTML = `感謝 <strong>${name}</strong>！我們已收到您關於「<strong>${service}</strong>」（參考語彙：${ref}）的諮詢預約，建築團隊將於 1–2 個工作天內與您聯繫並安排 3D 空間討論會議。`;
    feedback.classList.remove('hidden');
    form.reset();
  });
}

initApp();
