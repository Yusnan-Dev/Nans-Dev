interface MetricItem {
  value: string;
  label: string;
}

interface ProjectItem {
  id: string;
  title: string;
  category: string;
  badge: string;
  desc: string;
  stack: string[];
  url: string;
}

interface ServiceItem {
  code: string;
  title: string;
  desc: string;
  specs: string[];
}

interface EnterpriseData {
  last_built: string;
  metrics: MetricItem[];
  projects: ProjectItem[];
  services: ServiceItem[];
}

const WHATSAPP_NUMBER = '6283187521130'; // Ganti dengan nomor WA aktif lu (diawali 62)

async function bootApp(): Promise<void> {
  setupMobileNav();
  init3DEarthGlobe();
  setupVectorSlider();
  setupEstimator();

  try {
    const res = await fetch('./services.json');
    if (!res.ok) throw new Error('Data fetch failed');
    const data: EnterpriseData = await res.json();

    const buildEl = document.getElementById('build-time');
    if (buildEl) buildEl.textContent = `SYS.BUILD ${data.last_built}`;

    renderMetrics(data.metrics);
    renderServices(data.services);
    renderProjects(data.projects, 'all');
    setupProjectFilters(data.projects);
  } catch (err) {
    console.error(err);
  }
}

/* 3D Earth Globe with Continents & Flying Laser Arcs */
function init3DEarthGlobe(): void {
  const canvas = document.getElementById('canvas-3d') as HTMLCanvasElement | null;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = canvas.offsetWidth * 2);
  let height = (canvas.height = canvas.offsetHeight * 2);

  window.addEventListener('resize', () => {
    if (!canvas) return;
    width = canvas.width = canvas.offsetWidth * 2;
    height = canvas.height = canvas.offsetHeight * 2;
  });

  // Approximate continental landmass detection (lat in deg, lon in deg)
  function isLand(lat: number, lon: number): boolean {
    // North America
    if (lat > 15 && lat < 70 && lon > -165 && lon < -55) {
      if (lat < 30 && lon > -85) return false;
      return true;
    }
    // South America
    if (lat > -55 && lat < 13 && lon > -82 && lon < -34) {
      if (lat < -20 && lon < -72) return false;
      return true;
    }
    // Europe
    if (lat > 36 && lat < 71 && lon > -10 && lon < 45) return true;
    // Africa
    if (lat > -35 && lat < 36 && lon > -18 && lon < 51) {
      if (lat < 5 && lon < 8) return false;
      return true;
    }
    // Asia
    if (lat > 8 && lat < 75 && lon >= 45 && lon < 145) {
      if (lat < 22 && lon > 118) return false;
      return true;
    }
    // Indonesia & Southeast Asia Archipelago
    if (lat > -10 && lat <= 8 && lon > 95 && lon < 141) {
      return Math.sin(lat * 0.9) * Math.cos(lon * 0.7) > -0.25;
    }
    // Australia
    if (lat > -40 && lat < -11 && lon > 113 && lon < 154) return true;
    return false;
  }

  interface GlobePoint {
    x: number;
    y: number;
    z: number;
    land: boolean;
  }

  const baseDots: GlobePoint[] = [];
  const latSteps = 44;
  const lonSteps = 88;

  for (let i = 0; i <= latSteps; i++) {
    const lat = -90 + (180 * i) / latSteps;
    const phi = ((90 - lat) * Math.PI) / 180;
    const ringCount = Math.max(8, Math.round(lonSteps * Math.sin(phi)));

    for (let j = 0; j < ringCount; j++) {
      const lon = -180 + (360 * j) / ringCount;
      const theta = ((lon + 180) * Math.PI) / 180;

      const x = -Math.sin(phi) * Math.cos(theta);
      const y = Math.cos(phi);
      const z = Math.sin(phi) * Math.sin(theta);

      baseDots.push({ x, y, z, land: isLand(lat, lon) });
    }
  }

  function latLonToVec(lat: number, lon: number): { x: number; y: number; z: number } {
    const phi = ((90 - lat) * Math.PI) / 180;
    const theta = ((lon + 180) * Math.PI) / 180;
    return {
      x: -Math.sin(phi) * Math.cos(theta),
      y: Math.cos(phi),
      z: Math.sin(phi) * Math.sin(theta),
    };
  }

  // Global Hub Coordinates (Indonesia centered & international routes)
  const hubs = [
    { lat: -7.25, lon: 112.75 }, // Surabaya / Jawa Timur
    { lat: -6.2, lon: 106.8 },   // Jakarta
    { lat: 1.35, lon: 103.8 },   // Singapore
    { lat: 35.68, lon: 139.69 }, // Tokyo
    { lat: 51.5, lon: -0.12 },   // London
    { lat: 40.71, lon: -74.0 },  // New York
    { lat: -33.86, lon: 151.2 }, // Sydney
    { lat: 25.2, lon: 55.27 },   // Dubai
    { lat: -23.55, lon: -46.63 } // Sao Paulo
  ];

  interface FlyingArc {
    from: { x: number; y: number; z: number };
    to: { x: number; y: number; z: number };
    progress: number;
    speed: number;
    altitude: number;
    color: string;
  }

  const arcs: FlyingArc[] = [];
  const arcColors = ['#38bdf8', '#818cf8', '#34d399', '#22d3ee'];

  function spawnArc(index: number): FlyingArc {
    const startIdx = index % 2 === 0 ? 0 : Math.floor(Math.random() * hubs.length);
    let endIdx = Math.floor(Math.random() * hubs.length);
    if (endIdx === startIdx) endIdx = (startIdx + 3) % hubs.length;

    return {
      from: latLonToVec(hubs[startIdx].lat, hubs[startIdx].lon),
      to: latLonToVec(hubs[endIdx].lat, hubs[endIdx].lon),
      progress: Math.random() * -0.5,
      speed: 0.0065 + Math.random() * 0.004,
      altitude: 0.25 + Math.random() * 0.18,
      color: arcColors[index % arcColors.length],
    };
  }

  for (let i = 0; i < 8; i++) {
    arcs.push(spawnArc(i));
  }

  let rotY = -2.1; // Start facing Indonesia / Asia
  let rotX = 0.22;
  let velY = 0.0045;

  canvas.addEventListener('pointermove', (e) => {
    if (e.buttons === 1 || e.pointerType === 'touch') {
      velY = e.movementX * 0.003;
      rotX = Math.max(-0.8, Math.min(0.8, rotX + e.movementY * 0.003));
    }
  });

  function rotatePoint(
    p: { x: number; y: number; z: number },
    cosY: number,
    sinY: number,
    cosX: number,
    sinX: number
  ) {
    const x1 = p.x * cosY - p.z * sinY;
    const z1 = p.z * cosY + p.x * sinY;
    const y2 = p.y * cosX - z1 * sinX;
    const z2 = z1 * cosX + p.y * sinX;
    return { x: x1, y: y2, z: z2 };
  }

  function renderGlobe(): void {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    rotY += velY;
    velY *= 0.96;
    if (Math.abs(velY) < 0.004) {
      velY = velY >= 0 ? 0.004 : -0.004;
    }

    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.34;

    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);

    // 1. Outer Atmosphere Glow
    const atmoGrad = ctx.createRadialGradient(cx, cy, radius * 0.85, cx, cy, radius * 1.28);
    atmoGrad.addColorStop(0, 'rgba(56, 189, 248, 0.16)');
    atmoGrad.addColorStop(0.6, 'rgba(129, 140, 248, 0.06)');
    atmoGrad.addColorStop(1, 'rgba(5, 7, 12, 0)');
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.28, 0, Math.PI * 2);
    ctx.fillStyle = atmoGrad;
    ctx.fill();

    // 2. Dark Globe Core Sphere
    const coreGrad = ctx.createRadialGradient(
      cx - radius * 0.3,
      cy - radius * 0.3,
      radius * 0.1,
      cx,
      cy,
      radius
    );
    coreGrad.addColorStop(0, '#0f172a');
    coreGrad.addColorStop(1, '#04060b');
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = coreGrad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 3. Render Continent & Ocean Dots
    for (let i = 0; i < baseDots.length; i++) {
      const dot = baseDots[i];
      const r = rotatePoint(dot, cosY, sinY, cosX, sinX);

      // Hide back-side ocean dots, keep faint back-side land silhouette
      if (r.z > 0.15 && !dot.land) continue;

      const isFront = r.z <= 0;
      const px = cx + r.x * radius;
      const py = cy + r.y * radius;

      ctx.beginPath();
      if (dot.land) {
        ctx.arc(px, py, isFront ? 2.4 : 1.3, 0, Math.PI * 2);
        ctx.fillStyle = isFront ? 'rgba(56, 189, 248, 0.92)' : 'rgba(56, 189, 248, 0.14)';
      } else {
        ctx.arc(px, py, 1.1, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(148, 163, 184, 0.14)';
      }
      ctx.fill();
    }

    // 4. Render Flying Data Arcs Across Continents
    arcs.forEach((arc, idx) => {
      arc.progress += arc.speed;
      if (arc.progress > 1.35) {
        arcs[idx] = spawnArc(idx);
        return;
      }

      const headT = Math.min(1, Math.max(0, arc.progress));
      const tailT = Math.max(0, arc.progress - 0.35);
      if (headT <= 0) return;

      const steps = 26;
      const points: { x: number; y: number; z: number }[] = [];

      for (let s = 0; s <= steps; s++) {
        const t = tailT + ((headT - tailT) * s) / steps;
        // Linear interpolation normalized to sphere + parabolic altitude arc
        const lx = arc.from.x + (arc.to.x - arc.from.x) * t;
        const ly = arc.from.y + (arc.to.y - arc.from.y) * t;
        const lz = arc.from.z + (arc.to.z - arc.from.z) * t;
        const len = Math.sqrt(lx * lx + ly * ly + lz * lz) || 1;
        const lift = 1 + Math.sin(t * Math.PI) * arc.altitude;

        const r = rotatePoint(
          { x: (lx / len) * lift, y: (ly / len) * lift, z: (lz / len) * lift },
          cosY,
          sinY,
          cosX,
          sinX
        );
        points.push(r);
      }

      // Draw glowing arc trail
      for (let s = 1; s < points.length; s++) {
        const pPrev = points[s - 1];
        const pCurr = points[s];
        if (pCurr.z > 0.25) continue; // Occlude behind globe

        const alpha = (s / points.length) * (pCurr.z <= 0 ? 0.95 : 0.25);
        ctx.beginPath();
        ctx.moveTo(cx + pPrev.x * radius, cy + pPrev.y * radius);
        ctx.lineTo(cx + pCurr.x * radius, cy + pCurr.y * radius);
        ctx.strokeStyle = arc.color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 2.6;
        ctx.stroke();
      }

      // Draw bright laser head & landing ripple
      const tip = points[points.length - 1];
      if (tip && tip.z <= 0.1) {
        const tx = cx + tip.x * radius;
        const ty = cy + tip.y * radius;

        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(tx, ty, 3.8, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Landing pulse ring
        if (arc.progress > 0.95) {
          const pulseRadius = (arc.progress - 0.95) * 45;
          ctx.beginPath();
          ctx.arc(tx, ty, pulseRadius, 0, Math.PI * 2);
          ctx.strokeStyle = arc.color;
          ctx.globalAlpha = Math.max(0, 1 - (arc.progress - 0.95) * 2.5);
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    });

    requestAnimationFrame(renderGlobe);
  }

  renderGlobe();
}

function setupMobileNav(): void {
  const toggle = document.getElementById('menu-toggle');
  const links = document.getElementById('nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
}

function renderMetrics(metrics: MetricItem[]): void {
  const container = document.getElementById('metrics-strip');
  if (!container) return;
  container.innerHTML = metrics
    .map(
      (m) => `
      <div class="metric-box">
        <div class="val">${m.value}</div>
        <div class="lbl">${m.label}</div>
      </div>`
    )
    .join('');
}

function renderServices(services: ServiceItem[]): void {
  const container = document.getElementById('services-bento');
  if (!container) return;
  container.innerHTML = services
    .map(
      (s) => `
      <article class="bento-card">
        <div class="card-graphic">
          <span class="code-num">// SYS_NODE_${s.code}</span>
          <div class="eq-bars">
            <span></span><span></span><span></span><span></span><span></span>
          </div>
        </div>
        <h3>${s.title}</h3>
        <p>${s.desc}</p>
        <ul class="spec-list">
          ${s.specs.map((sp) => `<li>${sp}</li>`).join('')}
        </ul>
      </article>`
    )
    .join('');
}

function renderProjects(projects: ProjectItem[], filter: string): void {
  const container = document.getElementById('projects-grid');
  if (!container) return;

  const filtered =
    filter === 'all' ? projects : projects.filter((p) => p.category === filter);

  container.innerHTML = filtered
    .map(
      (p) => `
      <article class="project-card">
        <div>
          <div class="mockup-3d">
            <div class="win-dots"><span></span><span></span><span></span></div>
            <div class="win-bars">
              <div class="bar-main"></div>
              <div class="bar-sub"></div>
              <div class="bar-grid"><div></div><div></div><div></div></div>
            </div>
          </div>
          <span class="p-badge">${p.badge}</span>
          <h3>${p.title}</h3>
          <p>${p.desc}</p>
        </div>
        <div>
          <div class="tags">
            ${p.stack.map((t) => `<span>${t}</span>`).join('')}
          </div>
          <a href="${p.url}" ${p.url.startsWith('http') ? 'target="_blank"' : ''} class="p-link">
            ${p.url.startsWith('http') ? 'Buka Live Demo ↗' : 'Lihat Modul ↓'}
          </a>
        </div>
      </article>`
    )
    .join('');
}

function setupProjectFilters(projects: ProjectItem[]): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>('.filter-btn');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      renderProjects(projects, btn.dataset.filter || 'all');
    });
  });
}

function setupVectorSlider(): void {
  const slider = document.getElementById('vector-range') as HTMLInputElement | null;
  const vectorLayer = document.getElementById('vector-layer');
  const sliderLine = document.getElementById('slider-line');
  if (!slider || !vectorLayer || !sliderLine) return;

  const update = () => {
    const val = Number(slider.value);
    vectorLayer.style.clipPath = `inset(0 ${100 - val}% 0 0)`;
    sliderLine.style.left = `${val}%`;
  };

  slider.addEventListener('input', update);
}

function setupEstimator(): void {
  const checkboxes = document.querySelectorAll<HTMLInputElement>('.est-check');
  const timeDisplay = document.getElementById('est-days');
  const sendBtn = document.getElementById('est-wa-btn');
  if (!timeDisplay || !sendBtn) return;

  const calculate = () => {
    let totalDays = 0;
    const selected: string[] = [];

    checkboxes.forEach((cb) => {
      if (cb.checked) {
        totalDays += Number(cb.dataset.days || 0);
        selected.push(cb.value);
      }
    });

    timeDisplay.textContent = totalDays > 0 ? `${totalDays} Hari Kerja` : 'Pilih Modul';
    return selected;
  };

  checkboxes.forEach((cb) => cb.addEventListener('change', calculate));
  calculate();

  sendBtn.addEventListener('click', () => {
    const items = calculate();
    const listText = items.length > 0 ? items.join(', ') : 'Konsultasi Umum';
    const msg = encodeURIComponent(
      `Halo Nans Dev, saya tertarik diskusi proyek untuk modul: ${listText}.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  });
}

document.addEventListener('DOMContentLoaded', bootApp);
  
