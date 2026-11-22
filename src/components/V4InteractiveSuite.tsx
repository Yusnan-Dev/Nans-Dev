import { createDomNode } from './StackBadge';

export type ThemeMode = 'dark' | 'light';

export const V4_PALETTES = [
  { name: 'Cyber Cyan', colors: ['#38bdf8', '#818cf8'] },
  { name: 'Emerald Ops', colors: ['#34d399', '#10b981'] },
  { name: 'Royal Gold', colors: ['#fbbf24', '#f59e0b'] },
  { name: 'Crimson Pro', colors: ['#fb7185', '#f43f5e'] },
];

export function applyV4ThemeMode(mode: ThemeMode): void {
  const root = document.documentElement;
  root.setAttribute('data-theme', mode);
  try {
    localStorage.setItem('nans_theme_mode', mode);
  } catch {}

  const modeBtn = document.getElementById('v4-theme-mode-btn');
  if (modeBtn) {
    modeBtn.setAttribute('aria-label', mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode');
    modeBtn.title = mode === 'light' ? 'Ganti ke Dark Mode' : 'Ganti ke Light Mode';
    modeBtn.innerHTML =
      mode === 'light'
        ? `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg><span class="v4-mode-label">Dark</span>`
        : `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg><span class="v4-mode-label">Light</span>`;
  }
}

export function applyV4ThemeColors(accent: string, accent2: string): void {
  const root = document.documentElement;
  root.style.setProperty('--v4-accent', accent);
  root.style.setProperty('--v4-accent2', accent2);

  try {
    localStorage.setItem('nans_theme_accent', JSON.stringify([accent, accent2]));
  } catch {}

  let styleTag = document.getElementById('v4-dynamic-theme-style') as HTMLStyleElement | null;
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'v4-dynamic-theme-style';
    document.head.appendChild(styleTag);
  }
  styleTag.textContent = `
    :root { --v4-accent: ${accent}; --v4-accent2: ${accent2}; }
    .btn-primary, .pre-bar .pre-fill {
      background: linear-gradient(135deg, var(--v4-accent2), var(--v4-accent)) !important;
    }
    .section-header .kicker, .p-badge, .p-link, .bp-title, .pill-announcement, .navbar .brand span {
      color: var(--v4-accent) !important;
    }
    .estimator-box, .bp-node.active, .filter-btn.active {
      border-color: var(--v4-accent) !important;
    }
  `;

  document.querySelectorAll<HTMLButtonElement>('.v4-nav-swatch').forEach((sw) => {
    const isMatch = sw.dataset.accent === accent;
    sw.classList.toggle('active', isMatch);
  });
}

export function mountNavbarThemeSwitcher(): void {
  const navInner = document.querySelector<HTMLElement>('.navbar .nav-inner');
  if (!navInner || navInner.querySelector('#v4-navbar-theme-switcher')) return;

  const switcher = createDomNode(
    'div',
    {
      id: 'v4-navbar-theme-switcher',
      className: 'v4-nav-theme',
      role: 'region',
      'aria-label': 'Theme Switcher',
    },
    createDomNode(
      'button',
      {
        type: 'button',
        id: 'v4-theme-mode-btn',
        className: 'v4-theme-mode-btn',
        title: 'Ganti Light / Dark Mode',
      },
      'Light'
    ),
    createDomNode('span', { className: 'v4-theme-divider', 'aria-hidden': 'true' }),
    createDomNode(
      'div',
      { className: 'v4-swatch-group' },
      ...V4_PALETTES.map((p, idx) =>
        createDomNode('button', {
          type: 'button',
          className: `v4-nav-swatch${idx === 0 ? ' active' : ''}`,
          'data-palette': `${p.name} (${p.colors.join(', ')})`,
          'data-accent': p.colors[0],
          'data-accent2': p.colors[1],
          title: `Accent: ${p.name}`,
          'aria-label': `Accent ${p.name}`,
          style: `background:linear-gradient(135deg, ${p.colors[0]}, ${p.colors[1]});`,
        })
      )
    )
  );

  const menuToggle = navInner.querySelector('#menu-toggle');
  if (menuToggle && menuToggle.parentElement) {
    menuToggle.parentElement.insertBefore(switcher, menuToggle);
  } else {
    navInner.appendChild(switcher);
  }
}

export function mountWasmBenchmarkLab(auditPanel: HTMLElement): void {
  if (auditPanel.querySelector('.wasm-lab-box')) return;

  const box = createDomNode(
    'div',
    {
      className: 'wasm-lab-box',
      style: 'margin-top:14px;padding:12px;border-radius:12px;background:#05070c;border:1px solid rgba(56,189,248,0.22);font-family:monospace;font-size:11.5px;',
    },
    createDomNode(
      'div',
      { style: 'display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;color:#38bdf8;font-weight:700;' },
      createDomNode('span', null, 'RUST WASM + GO TELEMETRY PROBE'),
      createDomNode('span', { id: 'wasm-node-badge', style: 'color:#34d399;' }, '12 EDGE NODES')
    ),
    createDomNode(
      'div',
      { style: 'display:flex;align-items:center;gap:10px;margin-bottom:8px;' },
      createDomNode('label', { for: 'wasm-traffic-range', style: 'color:#94a3b8;white-space:nowrap;' }, 'Traffic Nodes:'),
      createDomNode('input', {
        id: 'wasm-traffic-range',
        type: 'range',
        min: '1',
        max: '24',
        value: '12',
        style: 'flex:1;accent-color:#38bdf8;cursor:pointer;',
      }),
      createDomNode('span', { id: 'wasm-latency-out', style: 'color:#f8fafc;font-weight:700;white-space:nowrap;' }, '11 ms')
    ),
    createDomNode(
      'div',
      { id: 'go-telemetry-log', style: 'color:#94a3b8;font-size:10.5px;line-height:1.45;' },
      'Status: Ready · Klik "Run Audit" atau geser node untuk kalkulasi Rust WASM.'
    )
  );

  auditPanel.appendChild(box);
}

export function mountGlobeInspectorAndTrigger(stageEl: HTMLElement): void {
  if (stageEl.querySelector('.v4-globe-bar')) return;

  const bar = createDomNode(
    'div',
    {
      className: 'v4-globe-bar',
      style: 'position:absolute;left:10px;right:10px;bottom:10px;z-index:4;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:6px;',
    },
    createDomNode(
      'button',
      {
        type: 'button',
        id: 'v4-launch-rocket-btn',
        style: 'padding:5px 10px;border-radius:8px;border:1px solid rgba(56,189,248,0.45);background:rgba(5,7,12,0.85);color:#38bdf8;font-family:monospace;font-size:10.5px;font-weight:700;cursor:pointer;white-space:nowrap;',
      },
      'Launch Test'
    ),
    createDomNode(
      'span',
      {
        id: 'v4-hub-readout',
        style: 'padding:5px 9px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);background:rgba(5,7,12,0.78);color:#cbd5e1;font-family:monospace;font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;',
      },
      'HUB: Surabaya/ID (14ms)'
    )
  );

  stageEl.appendChild(bar);
}

export function mountVectorLabModeSwitch(vectorLabEl: HTMLElement): void {
  const leftCol = vectorLabEl.firstElementChild as HTMLElement | null;
  if (!leftCol || leftCol.querySelector('.v4-lab-mode-row')) return;

  const row = createDomNode(
    'div',
    { className: 'v4-lab-mode-row', style: 'display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;' },
    createDomNode(
      'button',
      {
        type: 'button',
        className: 'v4-lab-mode-btn active',
        'data-lab-mode': 'vector',
        style: 'padding:5px 11px;border-radius:8px;border:1px solid #38bdf8;background:rgba(56,189,248,0.16);color:#f8fafc;font-size:11.5px;font-weight:700;cursor:pointer;',
      },
      'Logo Raster vs Vector'
    ),
    createDomNode(
      'button',
      {
        type: 'button',
        className: 'v4-lab-mode-btn',
        'data-lab-mode': 'web',
        style: 'padding:5px 11px;border-radius:8px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.03);color:#94a3b8;font-size:11.5px;font-weight:700;cursor:pointer;',
      },
      'Web Jadul vs Modern'
    )
  );

  leftCol.insertBefore(row, leftCol.firstChild);
}

export function mountV4EstimatorTools(estimatorBox: HTMLElement): void {
  if (estimatorBox.querySelector('.v4-est-suite')) return;

  const roiBox = createDomNode(
    'div',
    {
      className: 'v4-roi-box',
      style: 'margin-top:12px;padding:12px;border-radius:12px;background:rgba(5,7,12,0.75);border:1px solid rgba(255,255,255,0.08);font-size:12px;',
    },
    createDomNode(
      'div',
      { style: 'display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;' },
      createDomNode('span', { style: 'font-weight:700;color:#38bdf8;' }, 'Estimasi Dampak Visitor / Hari'),
      createDomNode('span', { id: 'roi-visitors-val', style: 'font-family:monospace;color:#f8fafc;font-weight:700;' }, '150 / hari')
    ),
    createDomNode('input', {
      id: 'roi-visitors-range',
      type: 'range',
      min: '30',
      max: '1000',
      step: '10',
      value: '150',
      style: 'width:100%;accent-color:#38bdf8;cursor:pointer;margin-bottom:6px;',
    }),
    createDomNode(
      'div',
      { id: 'roi-result-text', style: 'color:#cbd5e1;font-size:11.5px;' },
      'Proyeksi ~450 leads/bln (estimasi konversi +10% dengan CTA & kalkulator terstruktur).'
    )
  );

  const actionRow = createDomNode(
    'div',
    { style: 'display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px;' },
    createDomNode(
      'button',
      {
        type: 'button',
        id: 'v4-copy-brief-btn',
        style: 'padding:8px 10px;border-radius:9px;border:1px solid rgba(255,255,255,0.14);background:rgba(255,255,255,0.04);color:#f8fafc;font-size:11.5px;font-weight:700;cursor:pointer;',
      },
      'Salin Brief'
    ),
    createDomNode(
      'button',
      {
        type: 'button',
        id: 'v4-pdf-quote-btn',
        style: 'padding:8px 10px;border-radius:9px;border:1px solid rgba(56,189,248,0.45);background:rgba(56,189,248,0.12);color:#38bdf8;font-size:11.5px;font-weight:700;cursor:pointer;',
      },
      'Cetak Penawaran'
    )
  );

  const wrapper = createDomNode('div', { className: 'v4-est-suite' }, roiBox);
  const briefInputs = estimatorBox.querySelector('.brief-inputs');
  if (briefInputs) briefInputs.appendChild(wrapper);

  const summaryBox = estimatorBox.querySelector('.est-summary');
  if (summaryBox && !summaryBox.querySelector('#v4-copy-brief-btn')) {
    summaryBox.appendChild(actionRow);
  }
}
