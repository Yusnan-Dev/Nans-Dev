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

const WHATSAPP_NUMBER = '6281234567890'; // Ganti nomor WA lu (diawali 62)

async function bootApp(): Promise<void> {
  setupMobileNav();
  init3DWireframeGlobe();
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

/* Interactive 3D Geodesic Sphere & Orbit Engine */
function init3DWireframeGlobe(): void {
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

  interface Point3D {
    x: number;
    y: number;
    z: number;
  }

  const nodes: Point3D[] = [];
  const totalNodes = 42;
  const radius = Math.min(width, height) * 0.31;

  for (let i = 0; i < totalNodes; i++) {
    const phi = Math.acos(-1 + (2 * i) / totalNodes);
    const theta = Math.sqrt(totalNodes * Math.PI) * phi;
    nodes.push({
      x: radius * Math.cos(theta) * Math.sin(phi),
      y: radius * Math.sin(theta) * Math.sin(phi),
      z: radius * Math.cos(phi),
    });
  }

  let angleY = 0;
  let angleX = 0.25;
  let dragVelocity = 0.006;

  canvas.addEventListener('pointermove', (e) => {
    if (e.buttons === 1 || e.pointerType === 'touch') {
      dragVelocity = e.movementX * 0.0025;
      angleX += e.movementY * 0.0025;
    }
  });

  function renderFrame(): void {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    angleY += dragVelocity;
    dragVelocity *= 0.96;
    if (Math.abs(dragVelocity) < 0.004) {
      dragVelocity = dragVelocity >= 0 ? 0.004 : -0.004;
    }

    const cx = width / 2;
    const cy = height / 2;
    const cosY = Math.cos(angleY);
    const sinY = Math.sin(angleY);
    const cosX = Math.cos(angleX);
    const sinX = Math.sin(angleX);

    const projected = nodes.map((p) => {
      const x1 = p.x * cosY - p.z * sinY;
      const z1 = p.z * cosY + p.x * sinY;
      const y2 = p.y * cosX - z1 * sinX;
      const z2 = z1 * cosX + p.y * sinX;
      const scale = 600 / (600 + z2);
      return {
        x: cx + x1 * scale,
        y: cy + y2 * scale,
        z: z2,
        scale,
      };
    });

    // Draw connecting mesh lines
    for (let i = 0; i < projected.length; i++) {
      for (let j = i + 1; j < projected.length; j++) {
        const dx = projected[i].x - projected[j].x;
        const dy = projected[i].y - projected[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < radius * 0.72) {
          ctx.beginPath();
          ctx.moveTo(projected[i].x, projected[i].y);
          ctx.lineTo(projected[j].x, projected[j].y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.28 * (1 - dist / (radius * 0.72))})`;
          ctx.lineWidth = 1.4;
          ctx.stroke();
        }
      }
    }

    // Draw glowing vertices
    projected.forEach((pt) => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 3.2 * pt.scale, 0, Math.PI * 2);
      ctx.fillStyle = pt.z < 0 ? '#38bdf8' : '#818cf8';
      ctx.fill();
    });

    requestAnimationFrame(renderFrame);
  }

  renderFrame();
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
  
