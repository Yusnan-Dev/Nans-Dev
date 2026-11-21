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

const WHATSAPP_NUMBER = '6283187521130'; // Ganti nomor WA lu (diawali 62)

async function bootApp(): Promise<void> {
  setupMobileNav();
  initReal3DEarth();
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

/* Real World Coastlines + High-Density Dot Globe + Bright Flying Laser Arcs */
function initReal3DEarth(): void {
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

  // Real continental & archipelago coastline polygons [lon, lat]
  const WORLD_POLYGONS: number[][][] = [
    // North America
    [
      [-168, 66], [-162, 60], [-152, 58], [-140, 60], [-130, 54], [-124, 48],
      [-122, 37], [-117, 32], [-110, 24], [-105, 20], [-92, 15], [-84, 9],
      [-79, 9], [-83, 15], [-88, 21], [-97, 26], [-90, 29], [-82, 25],
      [-80, 32], [-75, 39], [-70, 42], [-64, 45], [-55, 52], [-64, 60],
      [-78, 63], [-85, 68], [-95, 72], [-115, 70], [-135, 69], [-156, 71]
    ],
    // Greenland
    [
      [-52, 60], [-44, 60], [-22, 70], [-18, 81], [-45, 83], [-68, 77], [-58, 68]
    ],
    // South America
    [
      [-78, 10], [-71, 12], [-60, 7], [-50, 1], [-35, -6], [-38, -14],
      [-41, -22], [-52, -33], [-62, -40], [-67, -54], [-74, -52], [-73, -40],
      [-71, -28], [-76, -14], [-81, -4]
    ],
    // Europe
    [
      [-9, 37], [-9, 43], [-2, 48], [2, 51], [8, 54], [10, 58], [5, 61],
      [15, 68], [28, 71], [42, 67], [55, 68], [58, 52], [45, 45], [30, 41],
      [24, 37], [16, 38], [12, 44], [5, 43], [-3, 36]
    ],
    // UK & Ireland
    [
      [-6, 50], [-5, 58], [-1, 58], [1, 52], [-4, 50]
    ],
    // Africa
    [
      [-17, 15], [-13, 28], [-6, 35], [10, 37], [25, 32], [33, 31],
      [43, 12], [51, 11], [41, -2], [40, -15], [33, -26], [26, -34],
      [18, -34], [14, -22], [12, -6], [9, 4], [2, 6], [-8, 5], [-16, 11]
    ],
    // Madagascar
    [
      [44, -25], [47, -13], [50, -16], [47, -25]
    ],
    // Asia Mainland
    [
      [33, 31], [36, 37], [48, 30], [56, 26], [58, 21], [45, 13], [55, 17],
      [62, 25], [70, 21], [77, 8], [82, 16], [89, 22], [94, 16], [98, 16],
      [103, 2], [105, 10], [109, 13], [108, 21], [116, 23], [121, 31],
      [119, 39], [126, 35], [129, 42], [136, 45], [142, 54], [158, 53],
      [172, 62], [178, 66], [155, 70], [125, 73], [102, 77], [75, 72],
      [58, 68], [58, 52], [45, 45], [36, 41]
    ],
    // Japan
    [
      [130, 32], [136, 34], [141, 41], [144, 44], [140, 44], [136, 37], [131, 34]
    ],
    // Sumatera
    [
      [95, 5], [99, 3], [104, -1], [106, -6], [103, -5], [98, 0]
    ],
    // Jawa
    [
      [105, -6], [110, -6.5], [114.5, -7.8], [114, -8.6], [108, -7.7], [105.5, -6.8]
    ],
    // Kalimantan
    [
      [109, 1], [114, 4], [118, 6], [118, 1], [116, -4], [111, -3], [109, -1]
    ],
    // Sulawesi
    [
      [119, -5], [120, -1], [124, 1], [123, -1], [122, -4], [120, -5]
    ],
    // Papua
    [
      [131, -1], [136, -2], [141, -3], [148, -7], [147, -10], [140, -8], [135, -5], [132, -3]
    ],
    // Australia
    [
      [114, -22], [122, -16], [131, -12], [136, -13], [142, -11], [146, -19],
      [153, -28], [150, -37], [140, -38], [131, -32], [116, -34], [113, -26]
    ],
    // New Zealand
    [
      [167, -46], [174, -41], [177, -37], [174, -35], [171, -42], [167, -46]
    ]
  ];

  // Rasterize real world map onto an offscreen mask canvas for crisp dot & coastline sampling
  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = 360;
  maskCanvas.height = 180;
  const mCtx = maskCanvas.getContext('2d')!;
  mCtx.fillStyle = '#000000';
  mCtx.fillRect(0, 0, 360, 180);

  mCtx.fillStyle = '#ffffff';
  mCtx.strokeStyle = '#ffffff';
  mCtx.lineWidth = 1.2;

  WORLD_POLYGONS.forEach((poly) => {
    mCtx.beginPath();
    poly.forEach(([lon, lat], idx) => {
      const x = lon + 180;
      const y = 90 - lat;
      if (idx === 0) mCtx.moveTo(x, y);
      else mCtx.lineTo(x, y);
    });
    mCtx.closePath();
    mCtx.fill();
    mCtx.stroke();
  });

  const maskData = mCtx.getImageData(0, 0, 360, 180).data;

  function isRealLand(lat: number, lon: number): boolean {
    const x = Math.min(359, Math.max(0, Math.floor(lon + 180)));
    const y = Math.min(179, Math.max(0, Math.floor(90 - lat)));
    return maskData[(y * 360 + x) * 4] > 100;
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

  interface GlobePoint {
    x: number;
    y: number;
    z: number;
    land: boolean;
  }

  // High-density Fibonacci/grid dots for sharp recognizable continents
  const baseDots: GlobePoint[] = [];
  const latSteps = 76;
  const lonSteps = 152;

  for (let i = 1; i < latSteps; i++) {
    const lat = -90 + (180 * i) / latSteps;
    const phi = ((90 - lat) * Math.PI) / 180;
    const ringCount = Math.max(12, Math.round(lonSteps * Math.sin(phi)));

    for (let j = 0; j < ringCount; j++) {
      const lon = -180 + (360 * j) / ringCount;
      const land = isRealLand(lat, lon);
      // Keep all land dots, and sparse ocean grid dots for spherical depth
      if (!land && (i % 3 !== 0 || j % 3 !== 0)) continue;

      const vec = latLonToVec(lat, lon);
      baseDots.push({ ...vec, land });
    }
  }

  // Convert coastline polygons to 3D lines so continent outlines glow sharply
  const coastLines3D = WORLD_POLYGONS.map((poly) =>
    poly.map(([lon, lat]) => latLonToVec(lat, lon))
  );

  // Global Hub Cities (Indonesia centered + global connections)
  const hubs = [
    { lat: -7.25, lon: 112.75 }, // Surabaya / Jatim
    { lat: -6.2, lon: 106.8 },   // Jakarta
    { lat: 1.35, lon: 103.8 },   // Singapore
    { lat: 35.68, lon: 139.69 }, // Tokyo
    { lat: 25.2, lon: 55.27 },   // Dubai
    { lat: 51.5, lon: -0.12 },   // London
    { lat: 40.71, lon: -74.0 },  // New York
    { lat: -33.86, lon: 151.2 }, // Sydney
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
  const arcColors = ['#38bdf8', '#a855f7', '#34d399', '#22d3ee', '#f472b6'];

  function spawnArc(index: number): FlyingArc {
    const startIdx = index % 2 === 0 ? 0 : Math.floor(Math.random() * hubs.length);
    let endIdx = Math.floor(Math.random() * hubs.length);
    if (endIdx === startIdx) endIdx = (startIdx + 2) % hubs.length;

    return {
      from: latLonToVec(hubs[startIdx].lat, hubs[startIdx].lon),
      to: latLonToVec(hubs[endIdx].lat, hubs[endIdx].lon),
      progress: (index / 10) * -0.8,
      speed: 0.0075 + Math.random() * 0.004,
      altitude: 0.28 + Math.random() * 0.22,
      color: arcColors[index % arcColors.length],
    };
  }

  for (let i = 0; i < 10; i++) {
    arcs.push(spawnArc(i));
  }

  let rotY = -2.0; // Facing Indonesia & Asia-Pacific
  let rotX = 0.2;
  let velY = 0.0045;

  canvas.addEventListener('pointermove', (e) => {
    if (e.buttons === 1 || e.pointerType === 'touch') {
      velY = e.movementX * 0.003;
      rotX = Math.max(-0.75, Math.min(0.75, rotX + e.movementY * 0.003));
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
    const radius = Math.min(width, height) * 0.35;

    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);

    // 1. Atmosphere Halo
    const atmoGrad = ctx.createRadialGradient(cx, cy, radius * 0.88, cx, cy, radius * 1.32);
    atmoGrad.addColorStop(0, 'rgba(56, 189, 248, 0.22)');
    atmoGrad.addColorStop(0.55, 'rgba(129, 140, 248, 0.08)');
    atmoGrad.addColorStop(1, 'rgba(4, 6, 11, 0)');
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.32, 0, Math.PI * 2);
    ctx.fillStyle = atmoGrad;
    ctx.fill();

    // 2. Globe Sphere Body
    const coreGrad = ctx.createRadialGradient(
      cx - radius * 0.3,
      cy - radius * 0.3,
      radius * 0.1,
      cx,
      cy,
      radius
    );
    coreGrad.addColorStop(0, '#0f172a');
    coreGrad.addColorStop(1, '#03050a');
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = coreGrad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 3. Draw Glowing Continent Outlines
    ctx.lineWidth = 1.4;
    coastLines3D.forEach((poly) => {
      ctx.beginPath();
      let started = false;
      poly.forEach((pt) => {
        const r = rotatePoint(pt, cosY, sinY, cosX, sinX);
        if (r.z <= 0.05) {
          const px = cx + r.x * radius;
          const py = cy + r.y * radius;
          if (!started) {
            ctx.moveTo(px, py);
            started = true;
          } else {
            ctx.lineTo(px, py);
          }
        } else {
          started = false;
        }
      });
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
      ctx.stroke();
    });

    // 4. Draw High-Density Continent Dots
    for (let i = 0; i < baseDots.length; i++) {
      const dot = baseDots[i];
      const r = rotatePoint(dot, cosY, sinY, cosX, sinX);
      if (r.z > 0.08 && !dot.land) continue;

      const isFront = r.z <= 0;
      const px = cx + r.x * radius;
      const py = cy + r.y * radius;

      ctx.beginPath();
      if (dot.land) {
        ctx.arc(px, py, isFront ? 1.85 : 1.0, 0, Math.PI * 2);
        ctx.fillStyle = isFront ? 'rgba(56, 189, 248, 0.92)' : 'rgba(56, 189, 248, 0.12)';
      } else {
        ctx.arc(px, py, 1.0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(148, 163, 184, 0.14)';
      }
      ctx.fill();
    }

    // 5. Draw Bright High-Arc Flying Laser Beams
    arcs.forEach((arc, idx) => {
      arc.progress += arc.speed;
      if (arc.progress > 1.35) {
        arcs[idx] = spawnArc(idx);
        return;
      }

      const headT = Math.min(1, Math.max(0, arc.progress));
      const tailT = Math.max(0, arc.progress - 0.45);
      if (headT <= 0) return;

      const steps = 32;
      const points: { x: number; y: number; z: number }[] = [];

      for (let s = 0; s <= steps; s++) {
        const t = tailT + ((headT - tailT) * s) / steps;
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

      // Outer glow + core beam
      for (let s = 1; s < points.length; s++) {
        const pPrev = points[s - 1];
        const pCurr = points[s];
        // Show arc whenever it's in front OR lifted above horizon
        const distFromCenter = Math.hypot(pCurr.x, pCurr.y);
        if (pCurr.z > 0.15 && distFromCenter < 1.0) continue;

        const ratio = s / points.length;
        ctx.beginPath();
        ctx.moveTo(cx + pPrev.x * radius, cy + pPrev.y * radius);
        ctx.lineTo(cx + pCurr.x * radius, cy + pCurr.y * radius);
        ctx.strokeStyle = arc.color;
        ctx.globalAlpha = ratio * 0.95;
        ctx.lineWidth = 1.5 + ratio * 3.0;
        ctx.stroke();
      }

      // Glowing Comet Head + Ripple
      const tip = points[points.length - 1];
      if (tip) {
        const distTip = Math.hypot(tip.x, tip.y);
        if (tip.z <= 0.15 || distTip >= 1.0) {
          const tx = cx + tip.x * radius;
          const ty = cy + tip.y * radius;

          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(tx, ty, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();

          if (arc.progress > 0.92) {
            const pulseR = (arc.progress - 0.92) * 55;
            ctx.beginPath();
            ctx.arc(tx, ty, pulseR, 0, Math.PI * 2);
            ctx.strokeStyle = arc.color;
            ctx.globalAlpha = Math.max(0, 1 - (arc.progress - 0.92) * 2.4);
            ctx.lineWidth = 2.5;
            ctx.stroke();
          }
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
        
