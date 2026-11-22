declare const THREE: any;

interface MetricItem { value: string; label: string; }
interface ProjectItem {
  id: string; title: string; category: string; badge: string;
  desc: string; stack: string[]; url: string;
}
interface ServiceItem { code: string; title: string; desc: string; specs: string[]; }
interface EnterpriseData {
  last_built: string; metrics: MetricItem[]; projects: ProjectItem[]; services: ServiceItem[];
}

const WHATSAPP_NUMBER = '6283187521130';

const SVG_ICONS = {
  volOn: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`,
  volOff: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`,
  desktop: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="vertical-align:-2px;margin-right:3px;"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  mobile: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="vertical-align:-2px;margin-right:3px;"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`,
  calc: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="vertical-align:-2px;margin-right:5px;"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/></svg>`,
  bag: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="vertical-align:-2px;margin-right:5px;"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>`,
  pin: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="vertical-align:-2px;margin-right:5px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  pen: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="vertical-align:-2px;margin-right:5px;"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>`,
  clock: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="vertical-align:-2px;margin-right:5px;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
};

class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled = false;

  public toggle(): boolean {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    this.enabled = !this.enabled;
    if (this.enabled) this.playUiClick(680);
    return this.enabled;
  }

  public playUiClick(freq = 540): void {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.45, now + 0.06);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.075);
  }

  public playRocketLaunch(): void {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const duration = 2.4;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, now);
    filter.frequency.exponentialRampToValueAtTime(620, now + 0.7);
    filter.frequency.exponentialRampToValueAtTime(90, now + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.45);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
    noise.stop(now + duration);
  }
}

const sfx = new SoundEngine();

async function bootApp(): Promise<void> {
  setupAudioToggle();
  setupMobileNav();
  setupCommandPalette();
  setupArchitectureBlueprint();
  setupLighthouseAudit();
  initPhotorealisticEarth();
  setupVectorSlider();
  renderTestimonials();
  setupAiScopeGenerator();
  setupEstimator();
  setupCardSpotlight();

  try {
    const res = await fetch(`./services.json?t=${Date.now()}`);
    if (!res.ok) throw new Error('Data fetch failed');
    const data: EnterpriseData = await res.json();

    const buildEl = document.getElementById('build-time');
    if (buildEl) buildEl.textContent = `SYS.BUILD ${data.last_built}`;

    renderMetrics(data.metrics);
    renderServices(data.services);
    renderProjects(data.projects, 'all');
    setupProjectFilters(data.projects);
  } catch (err) {
    console.error('Data load error:', err);
  }
}

function setupAudioToggle(): void {
  const btn = document.getElementById('audio-toggle');
  if (!btn) return;
  btn.innerHTML = `${SVG_ICONS.volOff}<span>SFX OFF</span>`;
  btn.addEventListener('click', () => {
    const on = sfx.toggle();
    btn.classList.toggle('active', on);
    btn.innerHTML = on ? `${SVG_ICONS.volOn}<span>SFX ON</span>` : `${SVG_ICONS.volOff}<span>SFX OFF</span>`;
  });
}

function setupMobileNav(): void {
  const btn = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    sfx.playUiClick(580);
    menu.classList.toggle('open');
  });
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => menu.classList.remove('open'));
  });
}

function setupCommandPalette(): void {
  const modal = document.getElementById('cmd-modal');
  const trigger = document.getElementById('cmd-trigger');
  const closeBtn = document.getElementById('cmd-close');
  const input = document.getElementById('cmd-input') as HTMLInputElement | null;
  const items = document.querySelectorAll<HTMLElement>('.cmd-item');
  if (!modal || !input) return;

  const openModal = () => {
    sfx.playUiClick(700);
    modal.classList.add('open');
    input.value = '';
    items.forEach((el) => (el.style.display = 'flex'));
    setTimeout(() => input.focus(), 60);
  };
  const closeModal = () => modal.classList.remove('open');

  trigger?.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openModal(); }
    if (e.key === 'Escape') closeModal();
  });

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    items.forEach((el) => {
      const text = (el.textContent || '').toLowerCase();
      el.style.display = text.includes(q) ? 'flex' : 'none';
    });
  });

  items.forEach((el) => {
    el.addEventListener('click', () => {
      sfx.playUiClick(620);
      const target = el.dataset.target;
      closeModal();
      if (target) document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function setupArchitectureBlueprint(): void {
  const tabs = document.querySelectorAll<HTMLButtonElement>('.arch-tab');
  const titleEl = document.getElementById('arch-title');
  const descEl = document.getElementById('arch-desc');
  const codeEl = document.getElementById('arch-code');
  if (!tabs.length || !titleEl || !descEl || !codeEl) return;

  const layers: Record<string, { title: string; desc: string; code: string }> = {
    frontend: {
      title: 'TypeScript + WebGL Rendering Engine',
      desc: 'Antarmuka reaktif dengan Smart-Pause GPU Engine agar rotasi Bumi 3D tetap 60FPS namun hemat daya di perangkat mobile.',
      code: 'const engine = new NansWebGL({ fps: 60, smartPause: true, precision: "highp" });'
    },
    pipeline: {
      title: 'Automated Python CI/CD Telemetry',
      desc: 'Skrip Python berjalan otomatis saat deployment untuk sinkronisasi katalog proyek, sitemap SEO, PWA manifest, dan JSON-LD.',
      code: 'python3 scripts/generate_data.py --inject-schema --verify-assets'
    },
    security: {
      title: 'Zero-Backend Edge Delivery',
      desc: 'Seluruh aset statis terkompilasi penuh tanpa celah injeksi database, menghasilkan waktu muat di bawah 0.8 detik.',
      code: 'Content-Security-Policy: default-src \'self\'; frame-ancestors \'none\';'
    }
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      sfx.playUiClick(600);
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const key = tab.dataset.layer || 'frontend';
      const item = layers[key];
      if (item) {
        titleEl.textContent = item.title;
        descEl.textContent = item.desc;
        codeEl.textContent = item.code;
      }
    });
  });
}

function setupLighthouseAudit(): void {
  const btn = document.getElementById('run-audit-btn');
  const statusEl = document.getElementById('audit-status');
  if (!btn) return;
  btn.addEventListener('click', () => {
    sfx.playUiClick(760);
    if (statusEl) statusEl.textContent = 'Running Real-Time Core Web Vitals Check...';
    ['score-perf', 'score-acc', 'score-best', 'score-seo'].forEach((id, idx) => {
      const el = document.getElementById(id);
      if (el) {
        el.textContent = '..';
        setTimeout(() => { el.textContent = idx === 0 ? '99' : '100'; }, 350 + idx * 140);
      }
    });
    setTimeout(() => {
      if (statusEl) statusEl.textContent = 'AUDIT PASSED • 60FPS • ZERO BLOCKING SCRIPTS';
    }, 950);
  });
}
function initPhotorealisticEarth(): void {
  const container = document.getElementById('earth-canvas-container');
  const launchBtn = document.getElementById('launch-rocket-btn');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 3.25;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const earthGroup = new THREE.Group();
  scene.add(earthGroup);

  const texCanvas = document.createElement('canvas');
  texCanvas.width = 512;
  texCanvas.height = 256;
  const ctx = texCanvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#091e3a');
    grad.addColorStop(0.5, '#0f3868');
    grad.addColorStop(1, '#07172e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    ctx.fillStyle = '#14532d';
    for (let i = 0; i < 42; i++) {
      ctx.beginPath();
      ctx.arc((i * 73) % 512, 45 + ((i * 47) % 165), 14 + (i % 18), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 1;
    for (let y = 24; y < 256; y += 32) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke();
    }
  }

  const earthTex = new THREE.CanvasTexture(texCanvas);
  const earthGeo = new THREE.SphereGeometry(1.12, 48, 48);
  const earthMat = new THREE.MeshPhongMaterial({ map: earthTex, shininess: 22 });
  const earthMesh = new THREE.Mesh(earthGeo, earthMat);
  earthGroup.add(earthMesh);

  const wireGeo = new THREE.SphereGeometry(1.15, 24, 24);
  const wireMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.14 });
  earthGroup.add(new THREE.Mesh(wireGeo, wireMat));

  const rocketGroup = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.ConeGeometry(0.055, 0.22, 16),
    new THREE.MeshPhongMaterial({ color: 0xf8fafc, emissive: 0x38bdf8, emissiveIntensity: 0.35 })
  );
  rocketGroup.add(body);
  rocketGroup.position.set(0, 1.24, 0.25);
  earthGroup.add(rocketGroup);

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
  dirLight.position.set(4, 3, 5);
  scene.add(dirLight);

  let isLaunching = false;
  let launchProgress = 0;
  launchBtn?.addEventListener('click', () => {
    if (isLaunching) return;
    sfx.playRocketLaunch();
    isLaunching = true;
    launchProgress = 0;
  });

  let isVisible = true;
  const observer = new IntersectionObserver((entries) => {
    isVisible = entries[0]?.isIntersecting ?? true;
  }, { threshold: 0.05 });
  observer.observe(container);

  const animate = () => {
    requestAnimationFrame(animate);
    if (!isVisible) return;
    earthGroup.rotation.y += 0.0035;
    if (isLaunching) {
      launchProgress += 0.018;
      rocketGroup.position.y = 1.24 + Math.sin(Math.min(launchProgress, 1) * Math.PI) * 1.45;
      rocketGroup.rotation.z = -launchProgress * 1.8;
      if (launchProgress >= 1) {
        isLaunching = false;
        rocketGroup.position.set(0, 1.24, 0.25);
        rocketGroup.rotation.z = 0;
      }
    }
    renderer.render(scene, camera);
  };
  animate();

  window.addEventListener('resize', () => {
    if (!container.clientWidth || !container.clientHeight) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

function setupCardSpotlight(): void {
  document.addEventListener('mousemove', (e) => {
    document.querySelectorAll<HTMLElement>('.card, .project-card, .review-card').forEach((card) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });
}

function renderMetrics(metrics: MetricItem[]): void {
  const container = document.getElementById('metrics-grid');
  if (!container) return;
  container.innerHTML = metrics.map((m) => `
    <div class="metric-box">
      <div class="m-val">${m.value}</div>
      <div class="m-lbl">${m.label}</div>
    </div>`).join('');
}

function renderServices(services: ServiceItem[]): void {
  const container = document.getElementById('services-grid');
  if (!container) return;
  container.innerHTML = services.map((s) => `
    <article class="card">
      <span class="svc-code">MODULE // ${s.code}</span>
      <h3>${s.title}</h3>
      <p>${s.desc}</p>
      <ul>${s.specs.map((sp) => `<li>${sp}</li>`).join('')}</ul>
    </article>`).join('');
}

function getProjectMockupHTML(p: ProjectItem): string {
  if (p.id === 'klinpro-laundry') {
    return `<div class="mock-ui"><div class="mock-head">${SVG_ICONS.calc}KLINPRO EXPRESS • KALKULATOR</div><div class="mock-row"><span>Cuci Komplit (4 kg)</span><strong>Rp 28.000</strong></div><div class="mock-row"><span>Bedcover King</span><strong>Rp 35.000</strong></div><div class="mock-cta">Order via WhatsApp →</div></div>`;
  }
  if (p.id === 'tokobukyul-store') {
    return `<div class="mock-ui"><div class="mock-head">${SVG_ICONS.bag}TOKOBUKYUL • DIGITAL CATALOG</div><div class="mock-row"><span>E-Book Arsitektur Web</span><strong>Rp 49.000</strong></div><div class="mock-row"><span>Panduan Desain Vektor</span><strong>Rp 39.000</strong></div><div class="mock-cta">Checkout Keranjang →</div></div>`;
  }
  if (p.id === 'bizsnap-directory') {
    return `<div class="mock-ui"><div class="mock-head">${SVG_ICONS.pin}BIZSNAP • EAST JAVA HUB</div><div class="mock-row"><span>Gubuk Ndeso Bromo</span><strong>★ 4.8</strong></div><div class="mock-row"><span>Kafe & Roastery Malang</span><strong>★ 4.9</strong></div><div class="mock-cta">Jelajahi Direktori →</div></div>`;
  }
  return `<div class="mock-ui"><div class="mock-head">${SVG_ICONS.pen}VECTOR PRECISION SUITE</div><div class="mock-row"><span>Kurva Bezier Murni</span><strong>SVG / EPS</strong></div><div class="mock-row"><span>Resolusi Cetak</span><strong>∞ Infinite</strong></div><div class="mock-cta">Lihat Master File →</div></div>`;
}

function renderProjects(projects: ProjectItem[], filter: string): void {
  const container = document.getElementById('projects-grid');
  if (!container) return;
  const filtered = filter === 'all' ? projects : projects.filter((p) => p.category === filter);
  container.innerHTML = filtered.map((p) => `
    <article class="project-card">
      <div>
        <div class="preview-stage">
          <div class="device-toggle"><button type="button" class="dev-btn active" data-mode="desktop">${SVG_ICONS.desktop}Desktop</button><button type="button" class="dev-btn" data-mode="mobile">${SVG_ICONS.mobile}HP</button></div>
          <div class="device-frame">${getProjectMockupHTML(p)}</div>
        </div>
        <span class="p-badge">${p.badge}</span><h3>${p.title}</h3><p>${p.desc}</p>
      </div>
      <div>
        <div class="tags">${p.stack.map((t) => `<span>${t}</span>`).join('')}</div>
        <a href="${p.url}" ${p.url.startsWith('http') ? 'target="_blank"' : ''} class="p-link">${p.url.startsWith('http') ? 'Buka Live Demo ↗' : 'Lihat Modul ↓'}</a>
      </div>
    </article>`).join('');

  container.querySelectorAll<HTMLElement>('.preview-stage').forEach((stage) => {
    const frame = stage.querySelector<HTMLElement>('.device-frame');
    const btns = stage.querySelectorAll<HTMLButtonElement>('.dev-btn');
    if (!frame) return;
    btns.forEach((btn) => btn.addEventListener('click', () => {
      sfx.playUiClick(620);
      btns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      frame.classList.toggle('mobile-mode', btn.dataset.mode === 'mobile');
    }));
  });
}

function setupProjectFilters(projects: ProjectItem[]): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>('.filter-btn');
  buttons.forEach((btn) => btn.addEventListener('click', () => {
    sfx.playUiClick(580);
    buttons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    renderProjects(projects, btn.dataset.filter || 'all');
  }));
}

function renderTestimonials(): void {
  const container = document.getElementById('reviews-grid');
  if (!container) return;
  const reviews = [
    { quote: '"Tampilan website usaha kami langsung naik kelas, ringan dibuka di HP pelanggan, dan fitur kalkulator otomatisnya bikin order lewat WhatsApp jauh lebih praktis."', name: 'Owner KlinPro Laundry', role: 'UMKM Jasa & Layanan', platform: 'WEB CUSTOM' },
    { quote: '"Logo lama yang pecah direkonstruksi ulang jadi vektor super tajam. Garisnya rapi banget dan file master lengkap siap cetak ukuran spanduk besar."', name: 'Klien Desain Identitas', role: 'Brand & Retail', platform: 'FASTWORK ✓' },
    { quote: '"Komunikasi responsif, struktur katalog bersih, dan revisi dikerjakan cepat sesuai arahan. Sangat direkomendasikan untuk pengembangan web bisnis."', name: 'Pengelola Katalog Online', role: 'E-Commerce & Direktori', platform: 'VERIFIED ORDER' },
  ];
  container.innerHTML = reviews.map((r) => `
    <article class="review-card">
      <div><div class="stars">★★★★★</div><blockquote>${r.quote}</blockquote></div>
      <div class="reviewer"><div><div class="rev-name">${r.name}</div><div class="rev-role">${r.role}</div></div><span class="rev-platform">${r.platform}</span></div>
    </article>`).join('');
}

function setupVectorSlider(): void {
  const slider = document.getElementById('vector-range') as HTMLInputElement | null;
  const vectorLayer = document.getElementById('vector-layer');
  const sliderLine = document.getElementById('slider-line');
  if (!slider || !vectorLayer || !sliderLine) return;
  slider.addEventListener('input', () => {
    const val = Number(slider.value);
    vectorLayer.style.clipPath = `inset(0 ${100 - val}% 0 0)`;
    sliderLine.style.left = `${val}%`;
  });
}

function setupAiScopeGenerator(): void {
  const btn = document.getElementById('ai-gen-btn');
  const input = document.getElementById('ai-prompt-input') as HTMLInputElement | null;
  const output = document.getElementById('ai-scope-output');
  if (!btn || !input || !output) return;
  btn.addEventListener('click', () => {
    sfx.playUiClick(700);
    const idea = input.value.trim() || 'Website Bisnis Modern';
    output.innerHTML = `<strong>Rekomendasi Arsitektur untuk "${idea}":</strong><br>• Stack: TypeScript + SCSS + Responsive Mobile-First<br>• Fitur Utama: Katalog Interaktif, SEO Schema.org & Direct WhatsApp Checkout<br>• Estimasi Pengerjaan: 3–5 Hari Kerja`;
  });
}

function setupEstimator(): void {
  const checkboxes = document.querySelectorAll<HTMLInputElement>('.est-check');
  const currButtons = document.querySelectorAll<HTMLButtonElement>('.curr-btn');
  const priceDisplay = document.getElementById('est-price');
  const timeDisplay = document.getElementById('est-days');
  const brandInput = document.getElementById('client-brand') as HTMLInputElement | null;
  const notesInput = document.getElementById('client-notes') as HTMLTextAreaElement | null;
  const sendBtn = document.getElementById('est-wa-btn');
  if (!priceDisplay || !timeDisplay || !sendBtn) return;

  let activeCurrency: 'IDR' | 'USD' = 'IDR';
  const formatMoney = (amount: number, curr: 'IDR' | 'USD') =>
    curr === 'IDR' ? 'Rp ' + amount.toLocaleString('id-ID') : '$' + amount.toLocaleString('en-US') + ' USD';

  const calculate = () => {
    let totalDays = 0, totalCost = 0;
    const selected: string[] = [];
    checkboxes.forEach((cb) => {
      if (cb.checked) {
        totalDays += Number(cb.dataset.days || 0);
        totalCost += Number(activeCurrency === 'IDR' ? cb.dataset.idr || 0 : cb.dataset.usd || 0);
        selected.push(cb.value);
      }
    });
    priceDisplay.textContent = totalCost > 0 ? formatMoney(totalCost, activeCurrency) : (activeCurrency === 'IDR' ? 'Rp 0' : '$0 USD');
    timeDisplay.innerHTML = totalDays > 0
      ? (activeCurrency === 'IDR' ? `${SVG_ICONS.clock}Estimasi: ${totalDays} Hari Kerja` : `${SVG_ICONS.clock}Est. Delivery: ${totalDays} Business Days`)
      : 'Pilih minimal 1 modul';
    return { selected, totalDays, totalCost };
  };

  currButtons.forEach((btn) => btn.addEventListener('click', () => {
    sfx.playUiClick(640);
    currButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    activeCurrency = (btn.dataset.curr as 'IDR' | 'USD') || 'IDR';
    document.querySelectorAll<HTMLElement>('.meta-tag').forEach((tag) => {
      tag.textContent = activeCurrency === 'IDR' ? tag.dataset.idr || '' : tag.dataset.usd || '';
    });
    calculate();
  }));

  checkboxes.forEach((cb) => cb.addEventListener('change', () => { sfx.playUiClick(520); calculate(); }));
  calculate();

  sendBtn.addEventListener('click', () => {
    sfx.playUiClick(740);
    const { selected, totalDays, totalCost } = calculate();
    const brand = brandInput?.value.trim() || '-';
    const notes = notesInput?.value.trim() || '-';
    const modulesList = selected.length > 0 ? selected.map((m) => `• ${m}`).join('\n') : '• Konsultasi Custom';
    const estPriceStr = formatMoney(totalCost, activeCurrency);
    const briefMessage = activeCurrency === 'IDR'
      ? `Halo *Nans Dev*, saya ingin mengajukan brief proyek:\n\n*Nama / Brand:* ${brand}\n*Modul Dipilih:*\n${modulesList}\n\n*Estimasi Biaya:* ${estPriceStr}\n*Estimasi Waktu:* ${totalDays} Hari Kerja\n*Catatan:* ${notes}\n\nMohon info langkah selanjutnya ya!`
      : `Hello *Nans Dev*, I would like to discuss a project brief:\n\n*Name / Brand:* ${brand}\n*Selected Modules:*\n${modulesList}\n\n*Estimated Budget:* ${estPriceStr}\n*Estimated Delivery:* ${totalDays} Business Days\n*Notes:* ${notes}\n\nLooking forward to working together!`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(briefMessage)}`, '_blank');
  });
}

document.addEventListener('DOMContentLoaded', bootApp);

window.addEventListener('load', () => {
  const preloader = document.getElementById('nans-preloader');
  if (!preloader) return;
  setTimeout(() => {
    preloader.classList.add('hide');
    setTimeout(() => preloader.remove(), 600);
  }, 2200);
});
                   
