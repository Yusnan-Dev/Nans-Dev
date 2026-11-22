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

const WHATSAPP_NUMBER = '6283187521130'; // Ganti nomor WA lu (diawali 62)

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

function setupAudioToggle(): void {
  const btn = document.getElementById('audio-toggle');
  const icon = document.getElementById('audio-icon');
  const label = document.getElementById('audio-label');
  if (!btn || !icon || !label) return;

  btn.addEventListener('click', () => {
    const isOn = sfx.toggle();
    btn.classList.toggle('active', isOn);
    icon.innerHTML = isOn ? SVG_ICONS.volOn : SVG_ICONS.volOff;
    label.textContent = isOn ? 'SFX ON' : 'SFX OFF';
  });
}

function createRocketHullTexture(): any {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const hullGrad = ctx.createLinearGradient(0, 0, 256, 0);
  hullGrad.addColorStop(0, '#e2e8f0');
  hullGrad.addColorStop(0.5, '#ffffff');
  hullGrad.addColorStop(1, '#cbd5e1');
  ctx.fillStyle = hullGrad;
  ctx.fillRect(0, 0, 256, 256);

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 24, 256, 27);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(0, 56, 256, 11);
  ctx.fillStyle = '#f97316';
  ctx.fillRect(0, 69, 256, 4);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 208, 256, 48);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(0, 202, 256, 6);

  ctx.strokeStyle = 'rgba(15, 23, 42, 0.22)';
  ctx.lineWidth = 1.5;
  for (let y = 0; y < 256; y += 32) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(256, y); ctx.stroke();
  }
  for (let x = 0; x < 256; x += 64) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 256); ctx.stroke();
  }
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(118, 80, 20, 110);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function createSmokeTexture(): any {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(32, 32, 3, 32, 32, 31);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.45, 'rgba(226, 232, 240, 0.65)');
  grad.addColorStop(1, 'rgba(148, 163, 184, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}
function initPhotorealisticEarth(): void {
  const container = document.getElementById('earth-3d-container');
  if (!container || typeof THREE === 'undefined') return;

  const width = container.offsetWidth || 320;
  const height = container.offsetHeight || 340;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
  camera.position.z = 3.15;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  const earthGroup = new THREE.Group();
  scene.add(earthGroup);
  earthGroup.rotation.y = -2.25;
  earthGroup.rotation.x = 0.22;

  const textureLoader = new THREE.TextureLoader();
  textureLoader.setCrossOrigin('anonymous');
  const earthMap = textureLoader.load('https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg');
  const bumpMap = textureLoader.load('https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png');
  const specularMap = textureLoader.load('https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-water.png');

  const earthGeo = new THREE.SphereGeometry(1, 44, 44);
  const earthMat = new THREE.MeshPhongMaterial({
    map: earthMap, bumpMap, bumpScale: 0.035, specularMap, specular: new THREE.Color('#38bdf8'), shininess: 18,
  });
  earthGroup.add(new THREE.Mesh(earthGeo, earthMat));

  const atmoGeo = new THREE.SphereGeometry(1.06, 36, 36);
  const atmoMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#38bdf8'), transparent: true, opacity: 0.14, side: THREE.BackSide });
  earthGroup.add(new THREE.Mesh(atmoGeo, atmoMat));

  scene.add(new THREE.AmbientLight(0xffffff, 0.75));
  const sunLight = new THREE.DirectionalLight(0xffffff, 1.6);
  sunLight.position.set(4, 2.5, 4);
  scene.add(sunLight);
  const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.8);
  rimLight.position.set(-4, -2, -3);
  scene.add(rimLight);

  function latLonToVector3(lat: number, lon: number, radius = 1.005) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return new THREE.Vector3(-radius * Math.sin(phi) * Math.cos(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta));
  }

  const hubs = [
    { lat: -7.25, lon: 112.75 }, { lat: -6.2, lon: 106.8 }, { lat: 1.35, lon: 103.8 },
    { lat: 35.68, lon: 139.69 }, { lat: 25.2, lon: 55.27 }, { lat: 51.5, lon: -0.12 },
    { lat: 40.71, lon: -74.0 }, { lat: -33.86, lon: 151.2 }, { lat: -23.55, lon: -46.63 }
  ];

  const beaconGeo = new THREE.SphereGeometry(0.016, 10, 10);
  let indonesiaBeacon: any = null;
  hubs.forEach((h, i) => {
    const pos = latLonToVector3(h.lat, h.lon, 1.008);
    const dot = new THREE.Mesh(beaconGeo, new THREE.MeshBasicMaterial({ color: i <= 1 ? 0x34d399 : 0x38bdf8 }));
    dot.position.copy(pos);
    earthGroup.add(dot);
    if (i === 0) indonesiaBeacon = dot;
  });

  const shockGeo = new THREE.RingGeometry(0.015, 0.036, 24);
  const shockMat = new THREE.MeshBasicMaterial({ color: 0xfb923c, side: THREE.DoubleSide, transparent: true, opacity: 0 });
  const shockRing = new THREE.Mesh(shockGeo, shockMat);
  if (indonesiaBeacon) {
    shockRing.position.copy(indonesiaBeacon.position).multiplyScalar(1.01);
    shockRing.lookAt(indonesiaBeacon.position.clone().multiplyScalar(2));
  }
  earthGroup.add(shockRing);

  interface LaserArc { line: any; head: any; curvePoints: any[]; progress: number; speed: number; }
  const laserArcs: LaserArc[] = [];
  const arcPalette = [0x38bdf8, 0xa855f7, 0x34d399, 0x22d3ee, 0xf472b6];
  const sharedHeadGeo = new THREE.SphereGeometry(0.018, 8, 8);
  const sharedHeadMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

  for (let i = 0; i < 8; i++) {
    const startIdx = i % 2 === 0 ? 0 : Math.floor(Math.random() * hubs.length);
    let endIdx = Math.floor(Math.random() * hubs.length);
    if (endIdx === startIdx) endIdx = (startIdx + 3) % hubs.length;
    const vStart = latLonToVector3(hubs[startIdx].lat, hubs[startIdx].lon, 1.005);
    const vEnd = latLonToVector3(hubs[endIdx].lat, hubs[endIdx].lon, 1.005);
    const midPoint = vStart.clone().add(vEnd).multiplyScalar(0.5).normalize().multiplyScalar(1.05 + vStart.distanceTo(vEnd) * 0.32);
    const curvePoints = new THREE.QuadraticBezierCurve3(vStart, midPoint, vEnd).getPoints(48);
    const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
    geometry.setDrawRange(0, 0);
    const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: arcPalette[i % arcPalette.length], transparent: true, opacity: 0.9 }));
    earthGroup.add(line);
    const head = new THREE.Mesh(sharedHeadGeo, sharedHeadMat);
    head.visible = false;
    earthGroup.add(head);
    laserArcs.push({ line, head, curvePoints, progress: -i * 0.14, speed: 0.008 + Math.random() * 0.004 });
  }

  const overlayCanvas = document.createElement('canvas');
  Object.assign(overlayCanvas.style, {
    position: 'fixed', inset: '0', width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: '9999', display: 'none',
  });
  document.body.appendChild(overlayCanvas);

  const ovScene = new THREE.Scene();
  const ovCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  ovCamera.position.set(0, 0, 10);

  const ovRenderer = new THREE.WebGLRenderer({ canvas: overlayCanvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
  ovRenderer.setSize(window.innerWidth, window.innerHeight);
  ovRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));

  ovScene.add(new THREE.AmbientLight(0xffffff, 1.1));
  const ovSunLight = new THREE.DirectionalLight(0xffffff, 2.0);
  ovSunLight.position.set(6, 10, 9);
  ovScene.add(ovSunLight);
  const engineGlowLight = new THREE.PointLight(0xff7b00, 4, 6);
  ovScene.add(engineGlowLight);

  const rocketGroup = new THREE.Group();
  rocketGroup.visible = false;
  ovScene.add(rocketGroup);

  const hullTexture = createRocketHullTexture();
  const smokeTexture = createSmokeTexture();
  rocketGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.145, 0.165, 1.05, 24), new THREE.MeshStandardMaterial({ map: hullTexture, metalness: 0.45, roughness: 0.28 })));

  const fairingMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.125, 0.145, 0.18, 24), new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.5, roughness: 0.25 }));
  fairingMesh.position.y = 0.615;
  rocketGroup.add(fairingMesh);

  const noseMesh = new THREE.Mesh(new THREE.ConeGeometry(0.125, 0.36, 24), new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.45, roughness: 0.25 }));
  noseMesh.position.y = 0.885;
  rocketGroup.add(noseMesh);

  const tipMesh = new THREE.Mesh(new THREE.ConeGeometry(0.032, 0.1, 16), new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85, roughness: 0.2 }));
  tipMesh.position.y = 1.06;
  rocketGroup.add(tipMesh);

  const nozzleMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.135, 0.18, 20, 1, true), new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.25, side: THREE.DoubleSide }));
  nozzleMesh.position.y = -0.6;
  rocketGroup.add(nozzleMesh);

  const finGeo = new THREE.BoxGeometry(0.025, 0.36, 0.22);
  const finMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.75, roughness: 0.3 });
  for (let i = 0; i < 4; i++) {
    const fin = new THREE.Mesh(finGeo, finMat);
    const angle = (i * Math.PI) / 2;
    fin.position.set(Math.sin(angle) * 0.185, -0.36, Math.cos(angle) * 0.185);
    fin.rotation.y = angle;
    rocketGroup.add(fin);
  }

  const flameRed = new THREE.Mesh(new THREE.ConeGeometry(0.16, 1.15, 18), new THREE.MeshBasicMaterial({ color: 0xea580c, transparent: true, opacity: 0.72 }));
  flameRed.rotation.x = Math.PI; flameRed.position.y = -1.24; rocketGroup.add(flameRed);

  const flameOrange = new THREE.Mesh(new THREE.ConeGeometry(0.115, 0.85, 18), new THREE.MeshBasicMaterial({ color: 0xfacc15, transparent: true, opacity: 0.9 }));
  flameOrange.rotation.x = Math.PI; flameOrange.position.y = -1.08; rocketGroup.add(flameOrange);

  const flameCore = new THREE.Mesh(new THREE.ConeGeometry(0.068, 0.52, 16), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  flameCore.rotation.x = Math.PI; flameCore.position.y = -0.92; rocketGroup.add(flameCore);

  const smokeMatCool = new THREE.SpriteMaterial({ map: smokeTexture, color: 0xe2e8f0, transparent: true, opacity: 0.55, depthWrite: false });
  const smokeMatWarm = new THREE.SpriteMaterial({ map: smokeTexture, color: 0xfed7aa, transparent: true, opacity: 0.55, depthWrite: false });
  const sparkMatOrange = new THREE.SpriteMaterial({ map: smokeTexture, color: 0xfb923c, transparent: true, opacity: 0.9, depthWrite: false });
  const sparkMatYellow = new THREE.SpriteMaterial({ map: smokeTexture, color: 0xfef08a, transparent: true, opacity: 0.9, depthWrite: false });

  interface ExhaustParticle { sprite: any; vel: any; life: number; decay: number; baseScale: number; growRate: number; }
  const particles: ExhaustParticle[] = [];

  function spawnSmokeAndEmbers(origin: any, tangent: any, rocketScale: number): void {
    if (particles.length >= 65) return;
    const smoke = new THREE.Sprite(Math.random() > 0.65 ? smokeMatWarm : smokeMatCool);
    smoke.position.copy(origin);
    smoke.position.x += (Math.random() - 0.5) * 0.14 * rocketScale;
    smoke.position.y += (Math.random() - 0.5) * 0.14 * rocketScale;
    const initialSize = (0.24 + Math.random() * 0.14) * rocketScale;
    smoke.scale.set(initialSize, initialSize, 1);
    ovScene.add(smoke);
    const backwardVel = tangent.clone().multiplyScalar(-(0.035 + Math.random() * 0.03) * rocketScale);
    backwardVel.x += (Math.random() - 0.5) * 0.025; backwardVel.y += (Math.random() - 0.5) * 0.025;
    particles.push({ sprite: smoke, vel: backwardVel, life: 1.0, decay: 0.022 + Math.random() * 0.01, baseScale: initialSize, growRate: 0.042 * rocketScale });

    if (particles.length < 65 && Math.random() > 0.35) {
      const spark = new THREE.Sprite(Math.random() > 0.4 ? sparkMatOrange : sparkMatYellow);
      spark.position.copy(origin);
      const sparkSize = (0.09 + Math.random() * 0.05) * rocketScale;
      spark.scale.set(sparkSize, sparkSize, 1);
      ovScene.add(spark);
      const sparkVel = tangent.clone().multiplyScalar(-(0.08 + Math.random() * 0.05) * rocketScale);
      sparkVel.x += (Math.random() - 0.5) * 0.045; sparkVel.y += (Math.random() - 0.5) * 0.045;
      particles.push({ sprite: spark, vel: sparkVel, life: 1.0, decay: 0.048, baseScale: sparkSize, growRate: -0.002 });
    }
  }

  let rocketActive = false, launchProgress = 0;
  let startWorldPos = new THREE.Vector3(), midControlPos = new THREE.Vector3(), endWorldPos = new THREE.Vector3();
  const stageBox = container.closest('.hero-3d-stage') as HTMLElement | null;
  let earthInViewport = true;

  if ('IntersectionObserver' in window && stageBox) {
    new IntersectionObserver((entries) => { earthInViewport = entries[0].isIntersecting; }, { threshold: 0.05 }).observe(stageBox);
  }

  function screenToOverlayWorld(screenX: number, screenY: number, targetZ: number) {
    const vec = new THREE.Vector3((screenX / window.innerWidth) * 2 - 1, -(screenY / window.innerHeight) * 2 + 1, 0.5).unproject(ovCamera);
    const dir = vec.sub(ovCamera.position).normalize();
    return ovCamera.position.clone().add(dir.multiplyScalar((targetZ - ovCamera.position.z) / dir.z));
  }

  function triggerRocketLaunch(): void {
    if (rocketActive || document.hidden || !earthInViewport) return;
    const rect = renderer.domElement.getBoundingClientRect();
    if (rect.bottom < 80 || rect.top > window.innerHeight) return;

    let lx = rect.left + rect.width * 0.52, ly = rect.top + rect.height * 0.54;
    if (indonesiaBeacon) {
      earthGroup.updateMatrixWorld(true);
      const wp = new THREE.Vector3();
      indonesiaBeacon.getWorldPosition(wp);
      if (wp.z > -0.2) {
        const proj = wp.clone().project(camera);
        lx = rect.left + ((proj.x + 1) * 0.5) * rect.width;
        ly = rect.top + ((-proj.y + 1) * 0.5) * rect.height;
      }
    }

    startWorldPos = screenToOverlayWorld(lx, ly, 1.5);
    endWorldPos = screenToOverlayWorld(window.innerWidth * (0.35 + Math.random() * 0.3), -150, 7.8);
    midControlPos = new THREE.Vector3((startWorldPos.x + endWorldPos.x) * 0.5 + (Math.random() - 0.5) * 1.4, (startWorldPos.y + endWorldPos.y) * 0.48, 5.2);

    rocketActive = true; launchProgress = 0;
    overlayCanvas.style.display = 'block';
    rocketGroup.visible = true; rocketGroup.position.copy(startWorldPos); rocketGroup.scale.setScalar(0.16);
    shockMat.opacity = 0.95; shockRing.scale.setScalar(1);
    sfx.playRocketLaunch();
  }

  setTimeout(triggerRocketLaunch, 2500);
  setInterval(triggerRocketLaunch, 12000);

  let prevX = 0, prevY = 0, isTouching = false, velY = 0.004, velX = 0;
  const domElem = renderer.domElement;
  domElem.style.touchAction = 'none';
  domElem.addEventListener('pointerdown', (e: PointerEvent) => { isTouching = true; prevX = e.clientX; prevY = e.clientY; });
  window.addEventListener('pointerup', () => { isTouching = false; });
  domElem.addEventListener('pointermove', (e: PointerEvent) => {
    if (!isTouching) return;
    velY = THREE.MathUtils.clamp((e.clientX - prevX) * 0.014, -0.35, 0.35);
    velX = THREE.MathUtils.clamp((e.clientY - prevY) * 0.006, -0.15, 0.15);
    prevX = e.clientX; prevY = e.clientY;
  });

  function animate(): void {
    requestAnimationFrame(animate);
    if (document.hidden) return;

    if (earthInViewport) {
      earthGroup.rotation.y += velY;
      earthGroup.rotation.x = THREE.MathUtils.clamp(earthGroup.rotation.x + velX, -0.65, 0.65);
      velY *= 0.985; velX *= 0.94;
      if (Math.abs(velY) < 0.004) velY += ((velY >= 0 ? 0.004 : -0.004) - velY) * 0.04;
      if (shockMat.opacity > 0.01) { shockRing.scale.addScalar(0.18); shockMat.opacity *= 0.92; }

      laserArcs.forEach((arc) => {
        arc.progress += arc.speed;
        if (arc.progress > 1.45) arc.progress = -0.15;
        const totalPts = arc.curvePoints.length;
        if (arc.progress <= 0) { arc.line.geometry.setDrawRange(0, 0); arc.head.visible = false; return; }
        const headIdx = Math.min(totalPts - 1, Math.floor(arc.progress * totalPts));
        const tailIdx = Math.max(0, Math.floor((arc.progress - 0.42) * totalPts));
        arc.line.geometry.setDrawRange(tailIdx, Math.max(0, headIdx - tailIdx));
        if (arc.progress <= 1.0 && headIdx < totalPts) { arc.head.visible = true; arc.head.position.copy(arc.curvePoints[headIdx]); }
        else arc.head.visible = false;
      });
      renderer.render(scene, camera);
    }

    if (rocketActive || particles.length > 0) {
      if (rocketActive) {
        launchProgress += 0.014;
        const t = Math.min(1, launchProgress), ease = t * t * (2.2 - 1.2 * t), invT = 1 - ease;
        const pos = new THREE.Vector3().addScaledVector(startWorldPos, invT * invT).addScaledVector(midControlPos, 2 * invT * ease).addScaledVector(endWorldPos, ease * ease);
        const ne = Math.min(1, ease + 0.02), ine = 1 - ne;
        const nextPos = new THREE.Vector3().addScaledVector(startWorldPos, ine * ine).addScaledVector(midControlPos, 2 * ine * ne).addScaledVector(endWorldPos, ne * ne);
        const tangent = nextPos.sub(pos).normalize();
        if (tangent.lengthSq() > 0.0001) rocketGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);

        rocketGroup.position.copy(pos); rocketGroup.rotateY(t * 7);
        const currentScale = 0.16 + ease * 1.02;
        rocketGroup.scale.setScalar(currentScale);
        flameRed.scale.set(0.95 + Math.random() * 0.15, 0.85 + Math.random() * 0.5, 0.95 + Math.random() * 0.15);
        flameOrange.scale.set(1, 0.8 + Math.random() * 0.45, 1);
        flameCore.scale.set(1, 0.9 + Math.random() * 0.35, 1);

        const nozzleWorldPos = pos.clone().addScaledVector(tangent, -0.65 * currentScale);
        engineGlowLight.position.copy(nozzleWorldPos); engineGlowLight.intensity = 3.5 + Math.random() * 2.5;
        if (stageBox && t < 0.35 && earthInViewport) {
          const shake = (0.35 - t) * 6;
          stageBox.style.transform = `translate3d(${(Math.random() - 0.5) * shake}px, ${(Math.random() - 0.5) * shake}px, 0)`;
        } else if (stageBox && stageBox.style.transform) stageBox.style.transform = '';

        spawnSmokeAndEmbers(nozzleWorldPos, tangent, currentScale);
        if (launchProgress >= 1.06) { rocketActive = false; rocketGroup.visible = false; engineGlowLight.intensity = 0; if (stageBox) stageBox.style.transform = ''; }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.sprite.position.add(p.vel); p.life -= p.decay; p.baseScale = Math.max(0.01, p.baseScale + p.growRate);
        p.sprite.scale.set(p.baseScale, p.baseScale, 1);
        if (p.life <= 0) { ovScene.remove(p.sprite); particles.splice(i, 1); }
      }
      ovRenderer.render(ovScene, ovCamera);
      if (!rocketActive && particles.length === 0) overlayCanvas.style.display = 'none';
    }
  }
  animate();
  }
    function setupCommandPalette(): void {
  const modal = document.getElementById('cmd-modal');
  const trigger = document.getElementById('cmd-trigger');
  const closeBtn = document.getElementById('cmd-close');
  const input = document.getElementById('cmd-input') as HTMLInputElement | null;
  const results = document.getElementById('cmd-results');
  if (!modal || !trigger || !closeBtn || !input || !results) return;

  const actions = [
    { label: 'Buka Live Demo: KlinPro Express Laundry', tag: 'WEB APP', run: () => window.open('https://klinpro-express-laundry.github.io/', '_blank') },
    { label: 'Buka Live Demo: TokoBukYul E-Commerce', tag: 'STORE', run: () => window.open('https://tokobukyul.github.io/TokoBukYul/', '_blank') },
    { label: 'Eksplorasi Platform Direktori: bizsnap', tag: 'SYSTEM', run: () => location.assign('#portfolio') },
    { label: 'Jalankan Live Lighthouse Performance Audit', tag: 'BENCHMARK', run: () => { location.assign('#blueprint'); document.getElementById('run-audit-btn')?.click(); } },
    { label: 'Uji Ketajaman Logo di Vector 3D Lab', tag: 'VECTOR', run: () => location.assign('#vector-lab') },
    { label: 'Buka AI Scope & Kalkulator Estimasi Biaya', tag: 'ESTIMATOR', run: () => location.assign('#estimator') },
    { label: 'Hubungi Nans Dev Langsung via WhatsApp', tag: 'DIRECT', run: () => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank') },
  ];

  const renderList = (q: string) => {
    const filtered = actions.filter((a) => a.label.toLowerCase().includes(q.toLowerCase()) || a.tag.toLowerCase().includes(q.toLowerCase()));
    results.innerHTML = filtered.map((a, idx) => `<button type="button" class="cmd-item" data-idx="${idx}"><span>${a.label}</span><small>${a.tag}</small></button>`).join('');
    results.querySelectorAll<HTMLButtonElement>('.cmd-item').forEach((btn, idx) => {
      btn.addEventListener('click', () => { sfx.playUiClick(700); modal.hidden = true; filtered[idx].run(); });
    });
  };

  const openModal = () => { sfx.playUiClick(640); modal.hidden = false; input.value = ''; renderList(''); setTimeout(() => input.focus(), 40); };
  trigger.addEventListener('click', openModal);
  closeBtn.addEventListener('click', () => { modal.hidden = true; });
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.hidden = true; });
  input.addEventListener('input', () => renderList(input.value));
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openModal(); }
    if (e.key === 'Escape' && !modal.hidden) modal.hidden = true;
  });
}

function setupArchitectureBlueprint(): void {
  const nodes = document.querySelectorAll<HTMLButtonElement>('.bp-node');
  const inspector = document.getElementById('bp-inspector');
  if (!nodes.length || !inspector) return;

  const steps = [
    { title: '01. High-Impact UI/UX & Interactive 3D', desc: 'Perancangan antarmuka modern responsif Mobile-First dengan aset vektor tajam dan aksen 3D WebGL ringan.', code: 'renderTarget: "60FPS Mobile" | assets: ["SVG", "WebGL2", "SCSS"]' },
    { title: '02. Modular TypeScript & Python Engine', desc: 'Arsitektur kode terstruktur, bersih dari script berlebih, dan siap dikembangkan untuk katalog maupun kalkulator bisnis.', code: 'pipeline: "Python JSON Builder -> Strict TypeScript Bundle"' },
    { title: '03. Automated WhatsApp & Payment Flow', desc: 'Integrasi kalkulator pesanan otomatis yang mengubah pilihan pelanggan menjadi format invoice/brief langsung ke WhatsApp.', code: 'checkoutBridge: "Dynamic Cart -> Encoded WhatsApp API"' },
    { title: '04. Global Edge CDN & Zero-Downtime CI/CD', desc: 'Otomatisasi build dan deployment dengan kompresi aset statis super cepat untuk akses instan dari berbagai wilayah.', code: 'status: "DEPLOYED" | uptime: "99.9%" | ttfb: "<45ms"' },
  ];

  const showStep = (i: number) => {
    const s = steps[i] || steps[0];
    inspector.innerHTML = `<div class="bp-title">${s.title}</div><p class="bp-desc">${s.desc}</p><div class="bp-code">${s.code}</div>`;
  };
  showStep(0);
  nodes.forEach((n) => n.addEventListener('click', () => {
    sfx.playUiClick(600);
    nodes.forEach((b) => b.classList.remove('active'));
    n.classList.add('active');
    showStep(Number(n.dataset.step || 0));
  }));
}

function setupLighthouseAudit(): void {
  const btn = document.getElementById('run-audit-btn');
  const gauges = document.querySelectorAll<HTMLElement>('.g-val');
  if (!btn || !gauges.length) return;

  btn.addEventListener('click', () => {
    sfx.playUiClick(720);
    btn.textContent = 'Auditing...';
    gauges.forEach((g) => {
      const target = Number(g.dataset.score || 99);
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / 900);
        g.textContent = String(Math.round(45 + (target - 45) * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
        else { g.textContent = String(target); btn.textContent = 'Verified ✓'; }
      };
      requestAnimationFrame(tick);
    });
  });
}

function setupAiScopeGenerator(): void {
  const input = document.getElementById('ai-niche-input') as HTMLInputElement | null;
  const btn = document.getElementById('ai-scope-btn');
  const output = document.getElementById('ai-scope-output');
  const notesInput = document.getElementById('client-notes') as HTMLTextAreaElement | null;
  if (!input || !btn || !output) return;

  btn.addEventListener('click', () => {
    sfx.playUiClick(680);
    const niche = input.value.trim() || 'Bisnis & Jasa Modern';
    const lower = niche.toLowerCase();
    const isStore = lower.includes('toko') || lower.includes('jual') || lower.includes('produk') || lower.includes('cafe') || lower.includes('kopi');

    const cbs = document.querySelectorAll<HTMLInputElement>('.est-check');
    if (cbs.length >= 3) {
      cbs[0].checked = true;
      cbs[1].checked = isStore;
      cbs[2].checked = true;
      cbs[0].dispatchEvent(new Event('change'));
    }

    const recText = isStore
      ? `Rekomendasi Arsitektur untuk "${niche}": Katalog Produk Interaktif + Keranjang Otomatis + Rekonstruksi Logo HD + Integrasi Order WhatsApp.`
      : `Rekomendasi Arsitektur untuk "${niche}": Landing Page Konversi Tinggi + Kalkulator Estimasi Layanan + Rekonstruksi Logo HD + Integrasi WhatsApp.`;

    output.hidden = false;
    output.innerHTML = `<strong style="color:#38bdf8;">AI Blueprint Generated:</strong> ${recText}`;
    if (notesInput && !notesInput.value) notesInput.value = `Kebutuhan sistem untuk usaha: ${niche}`;
  });
}

function setupCardSpotlight(): void {
  document.addEventListener('pointermove', (e) => {
    const card = (e.target as HTMLElement)?.closest<HTMLElement>('.bento-card, .project-card');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  }, { passive: true });
}

function setupMobileNav(): void {
  const toggle = document.getElementById('menu-toggle'), links = document.getElementById('nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => { sfx.playUiClick(520); links.classList.toggle('open'); });
  links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => links.classList.remove('open')));
}

function renderMetrics(metrics: MetricItem[]): void {
  const container = document.getElementById('metrics-strip');
  if (!container) return;
  const statusLabels = ['TELEMETRY // OPTIMAL', 'LATENCY // VERIFIED', 'GEOMETRY // LOCKED'];
  const fillTargets = ['99.9%', '92%', '100%'];
  container.innerHTML = metrics.map((m, idx) => `
    <div class="metric-box">
      <div class="metric-status"><span class="live-dot"></span> ${statusLabels[idx % 3]}</div>
      <div class="val" data-target="${m.value}">${m.value}</div>
      <div class="lbl">${m.label}</div>
      <div class="metric-bar-track"><div class="metric-bar-fill" data-fill="${fillTargets[idx % 3]}"></div></div>
    </div>`).join('');

  let hasAnimated = false;
  const triggerAnimation = () => {
    if (hasAnimated) return;
    hasAnimated = true;
    container.querySelectorAll<HTMLElement>('.metric-bar-fill').forEach((b) => { b.style.width = b.dataset.fill || '100%'; });
    container.querySelectorAll<HTMLElement>('.val').forEach((el) => {
      const raw = el.dataset.target || '', match = raw.match(/^([^\d.-]*)([\d.]+)(.*)$/);
      if (!match) return;
      const prefix = match[1], targetNum = parseFloat(match[2]), suffix = match[3];
      const decimals = (match[2].split('.')[1] || '').length, startNum = prefix.includes('<') ? 3.8 : 0;
      const startTime = performance.now();
      const step = (now: number) => {
        const elapsed = Math.min(1, (now - startTime) / 1600);
        el.textContent = `${prefix}${(startNum + (targetNum - startNum) * (1 - Math.pow(1 - elapsed, 4))).toFixed(decimals)}${suffix}`;
        if (elapsed < 1) requestAnimationFrame(step); else el.textContent = raw;
      };
      requestAnimationFrame(step);
    });
  };
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => { if (entries.some((e) => e.isIntersecting)) { triggerAnimation(); obs.disconnect(); } }, { threshold: 0.25 });
    obs.observe(container);
  } else triggerAnimation();
}

function renderServices(services: ServiceItem[]): void {
  const container = document.getElementById('services-bento');
  if (!container) return;
  container.innerHTML = services.map((s) => `
    <article class="bento-card">
      <div class="card-graphic"><span class="code-num">// SYS_NODE_${s.code}</span><div class="eq-bars"><span></span><span></span><span></span><span></span><span></span></div></div>
      <h3>${s.title}</h3><p>${s.desc}</p>
      <ul class="spec-list">${s.specs.map((sp) => `<li>${sp}</li>`).join('')}</ul>
    </article>`).join('');
}

function getProjectMockupHTML(p: ProjectItem): string {
  const t = p.title.toLowerCase();
  if (t.includes('klinpro') || t.includes('laundry')) return `<div class="frame-top"><div class="dots"><span></span><span></span><span></span></div><span class="frame-url">klinpro-express.io</span></div><div class="ui-mock-body"><div class="ui-banner">${SVG_ICONS.calc}Kalkulator Kiloan & Express</div><div class="ui-grid"><div class="ui-widget">Cuci Kering</div><div class="ui-widget">Setrika Uap</div><div class="ui-widget ui-chip-hide">Order WA</div></div></div>`;
  if (t.includes('tokobuk') || t.includes('toko')) return `<div class="frame-top"><div class="dots"><span></span><span></span><span></span></div><span class="frame-url">tokobukyul.store</span></div><div class="ui-mock-body"><div class="ui-banner">${SVG_ICONS.bag}Katalog Buku & Checkout</div><div class="ui-grid"><div class="ui-widget">Best Seller</div><div class="ui-widget">Keranjang</div><div class="ui-widget ui-chip-hide">Promo</div></div></div>`;
  if (t.includes('bizsnap') || p.category === 'system') return `<div class="frame-top"><div class="dots"><span></span><span></span><span></span></div><span class="frame-url">bizsnap.id/directory</span></div><div class="ui-mock-body"><div class="ui-banner">${SVG_ICONS.pin}Direktori Cafe & Bisnis Lokal</div><div class="ui-grid"><div class="ui-widget">Malang</div><div class="ui-widget">Batu</div><div class="ui-widget ui-chip-hide">Jawa</div></div></div>`;
  return `<div class="frame-top"><div class="dots"><span></span><span></span><span></span></div><span class="frame-url">vector-hd.svg</span></div><div class="ui-mock-body"><div class="ui-banner">${SVG_ICONS.pen}Kurva Bezier & Print-Ready</div><div class="ui-grid"><div class="ui-widget">SVG / EPS</div><div class="ui-widget">CMYK / RGB</div><div class="ui-widget ui-chip-hide">300 DPI</div></div></div>`;
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
      sfx.playUiClick(620); btns.forEach((b) => b.classList.remove('active')); btn.classList.add('active');
      frame.classList.toggle('mobile-mode', btn.dataset.mode === 'mobile');
    }));
  });
}

function setupProjectFilters(projects: ProjectItem[]): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>('.filter-btn');
  buttons.forEach((btn) => btn.addEventListener('click', () => {
    sfx.playUiClick(580); buttons.forEach((b) => b.classList.remove('active')); btn.classList.add('active');
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
  const vectorLayer = document.getElementById('vector-layer'), sliderLine = document.getElementById('slider-line');
  if (!slider || !vectorLayer || !sliderLine) return;
  slider.addEventListener('input', () => {
    const val = Number(slider.value);
    vectorLayer.style.clipPath = `inset(0 ${100 - val}% 0 0)`;
    sliderLine.style.left = `${val}%`;
  });
}

function setupEstimator(): void {
  const checkboxes = document.querySelectorAll<HTMLInputElement>('.est-check');
  const currButtons = document.querySelectorAll<HTMLButtonElement>('.curr-btn');
  const priceDisplay = document.getElementById('est-price'), timeDisplay = document.getElementById('est-days');
  const brandInput = document.getElementById('client-brand') as HTMLInputElement | null;
  const notesInput = document.getElementById('client-notes') as HTMLTextAreaElement | null;
  const sendBtn = document.getElementById('est-wa-btn');
  if (!priceDisplay || !timeDisplay || !sendBtn) return;

  let activeCurrency: 'IDR' | 'USD' = 'IDR';
  const formatMoney = (amount: number, curr: 'IDR' | 'USD') => curr === 'IDR' ? 'Rp ' + amount.toLocaleString('id-ID') : '$' + amount.toLocaleString('en-US') + ' USD';

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
    timeDisplay.innerHTML = totalDays > 0 ? (activeCurrency === 'IDR' ? `${SVG_ICONS.clock}Estimasi: ${totalDays} Hari Kerja` : `${SVG_ICONS.clock}Est. Delivery: ${totalDays} Business Days`) : 'Pilih minimal 1 modul';
    return { selected, totalDays, totalCost };
  };

  currButtons.forEach((btn) => btn.addEventListener('click', () => {
    sfx.playUiClick(640); currButtons.forEach((b) => b.classList.remove('active')); btn.classList.add('active');
    activeCurrency = (btn.dataset.curr as 'IDR' | 'USD') || 'IDR';
    document.querySelectorAll<HTMLElement>('.meta-tag').forEach((tag) => { tag.textContent = activeCurrency === 'IDR' ? tag.dataset.idr || '' : tag.dataset.usd || ''; });
    calculate();
  }));

  checkboxes.forEach((cb) => cb.addEventListener('change', () => { sfx.playUiClick(520); calculate(); }));
  calculate();

  sendBtn.addEventListener('click', () => {
    sfx.playUiClick(740);
    const { selected, totalDays, totalCost } = calculate();
    const brand = brandInput?.value.trim() || '-', notes = notesInput?.value.trim() || '-';
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
  }, 1950);
});
