declare const THREE: any;

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
  initPhotorealisticEarth();
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

/* Photorealistic 3D Earth with Satellite Textures + Flying 3D Laser Arcs */
function initPhotorealisticEarth(): void {
  const container = document.getElementById('earth-3d-container');
  if (!container || typeof THREE === 'undefined') return;

  const width = container.offsetWidth || 320;
  const height = container.offsetHeight || 340;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
  camera.position.z = 3.15;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  const earthGroup = new THREE.Group();
  scene.add(earthGroup);

  // Rotate initial view to face Indonesia & Asia-Pacific
  earthGroup.rotation.y = -2.25;
  earthGroup.rotation.x = 0.22;

  const textureLoader = new THREE.TextureLoader();
  textureLoader.setCrossOrigin('anonymous');

  const earthMap = textureLoader.load(
    'https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg'
  );
  const bumpMap = textureLoader.load(
    'https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png'
  );
  const specularMap = textureLoader.load(
    'https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-water.png'
  );

  // 1. Real Earth Sphere
  const earthGeo = new THREE.SphereGeometry(1, 64, 64);
  const earthMat = new THREE.MeshPhongMaterial({
    map: earthMap,
    bumpMap: bumpMap,
    bumpScale: 0.035,
    specularMap: specularMap,
    specular: new THREE.Color('#38bdf8'),
    shininess: 18,
  });
  const earthMesh = new THREE.Mesh(earthGeo, earthMat);
  earthGroup.add(earthMesh);

  // 2. Atmospheric Blue Halo Rim
  const atmoGeo = new THREE.SphereGeometry(1.06, 64, 64);
  const atmoMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#38bdf8'),
    transparent: true,
    opacity: 0.14,
    side: THREE.BackSide,
  });
  const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
  earthGroup.add(atmoMesh);

  // 3. Studio Lighting (Sun + Rim Light)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xffffff, 1.6);
  sunLight.position.set(4, 2.5, 4);
  scene.add(sunLight);

  const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.8);
  rimLight.position.set(-4, -2, -3);
  scene.add(rimLight);

  // Convert Lat/Lon to 3D Vector on Sphere
  function latLonToVector3(lat: number, lon: number, radius = 1.005) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }

  // Global Hub Cities (Indonesia centered)
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

  // Add glowing city beacon dots
  const beaconGeo = new THREE.SphereGeometry(0.016, 12, 12);
  hubs.forEach((h, i) => {
    const pos = latLonToVector3(h.lat, h.lon, 1.008);
    const beaconMat = new THREE.MeshBasicMaterial({
      color: i <= 1 ? 0x34d399 : 0x38bdf8,
    });
    const dot = new THREE.Mesh(beaconGeo, beaconMat);
    dot.position.copy(pos);
    earthGroup.add(dot);
  });

  // 4. Flying 3D Laser Arcs Across Continents
  interface LaserArc {
    line: any;
    head: any;
    curvePoints: any[];
    progress: number;
    speed: number;
  }

  const laserArcs: LaserArc[] = [];
  const arcPalette = [0x38bdf8, 0xa855f7, 0x34d399, 0x22d3ee, 0xf472b6];

  function createLaserArc(index: number): LaserArc {
    const startIdx = index % 2 === 0 ? 0 : Math.floor(Math.random() * hubs.length);
    let endIdx = Math.floor(Math.random() * hubs.length);
    if (endIdx === startIdx) endIdx = (startIdx + 3) % hubs.length;

    const vStart = latLonToVector3(hubs[startIdx].lat, hubs[startIdx].lon, 1.005);
    const vEnd = latLonToVector3(hubs[endIdx].lat, hubs[endIdx].lon, 1.005);

    const distance = vStart.distanceTo(vEnd);
    const midPoint = vStart.clone().add(vEnd).multiplyScalar(0.5);
    midPoint.normalize().multiplyScalar(1.05 + distance * 0.32);

    const curve = new THREE.QuadraticBezierCurve3(vStart, midPoint, vEnd);
    const curvePoints = curve.getPoints(64);

    const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
    geometry.setDrawRange(0, 0);

    const material = new THREE.LineBasicMaterial({
      color: arcPalette[index % arcPalette.length],
      transparent: true,
      opacity: 0.9,
    });

    const line = new THREE.Line(geometry, material);
    earthGroup.add(line);

    const headGeo = new THREE.SphereGeometry(0.018, 10, 10);
    const headMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const head = new THREE.Mesh(headGeo, headMat);
    head.visible = false;
    earthGroup.add(head);

    return {
      line,
      head,
      curvePoints,
      progress: -index * 0.14,
      speed: 0.008 + Math.random() * 0.004,
    };
  }

  for (let i = 0; i < 9; i++) {
    laserArcs.push(createLaserArc(i));
  }

  // Interactive Touch & Mouse Drag Rotation
  let isDragging = false;
  let prevX = 0;
  let prevY = 0;
  let rotSpeedY = 0.0035;

  const domElem = renderer.domElement;
  domElem.addEventListener('pointerdown', (e: PointerEvent) => {
    isDragging = true;
    prevX = e.clientX;
    prevY = e.clientY;
  });

  window.addEventListener('pointerup', () => {
    isDragging = false;
  });

  domElem.addEventListener('pointermove', (e: PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - prevX;
    const dy = e.clientY - prevY;
    prevX = e.clientX;
    prevY = e.clientY;

    earthGroup.rotation.y += dx * 0.007;
    earthGroup.rotation.x = Math.max(
      -0.65,
      Math.min(0.65, earthGroup.rotation.x + dy * 0.007)
    );
    rotSpeedY = dx * 0.002;
  });

  window.addEventListener('resize', () => {
    if (!container) return;
    const w = container.offsetWidth || 320;
    const h = container.offsetHeight || 340;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  function animate(): void {
    requestAnimationFrame(animate);

    if (!isDragging) {
      earthGroup.rotation.y += rotSpeedY;
      rotSpeedY *= 0.96;
      if (Math.abs(rotSpeedY) < 0.0032) {
        rotSpeedY = rotSpeedY >= 0 ? 0.0032 : -0.0032;
      }
    }

    // Animate Flying Laser Beams
    laserArcs.forEach((arc) => {
      arc.progress += arc.speed;
      if (arc.progress > 1.45) {
        arc.progress = -0.15;
      }

      const totalPts = arc.curvePoints.length;
      if (arc.progress <= 0) {
        arc.line.geometry.setDrawRange(0, 0);
        arc.head.visible = false;
        return;
      }

      const headIdx = Math.min(totalPts - 1, Math.floor(arc.progress * totalPts));
      const tailIdx = Math.max(0, Math.floor((arc.progress - 0.42) * totalPts));
      const count = Math.max(0, headIdx - tailIdx);

      arc.line.geometry.setDrawRange(tailIdx, count);

      if (arc.progress <= 1.0 && headIdx < totalPts) {
        arc.head.visible = true;
        arc.head.position.copy(arc.curvePoints[headIdx]);
      } else {
        arc.head.visible = false;
      }
    });

    renderer.render(scene, camera);
  }

  animate();
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
                               
