import { renderPolyglotStrip } from './components/StackBadge';
import { mountWasmBenchmarkLab, mountV4EstimatorTools, applyV4ThemeColors, applyV4ThemeMode, mountNavbarThemeSwitcher, mountGlobeInspectorAndTrigger, mountVectorLabModeSwitch, ThemeMode } from './components/V4InteractiveSuite';
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
  setupV4Suite();
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
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  const hullGrad = ctx.createLinearGradient(0, 0, 512, 0);
  hullGrad.addColorStop(0, '#cbd5e1');
  hullGrad.addColorStop(0.25, '#f8fafc');
  hullGrad.addColorStop(0.5, '#ffffff');
  hullGrad.addColorStop(0.75, '#f1f5f9');
  hullGrad.addColorStop(1, '#94a3b8');
  ctx.fillStyle = hullGrad;
  ctx.fillRect(0, 0, 512, 512);

  // Strip interstage hitam & merah khas roket orbital (Falcon / Saturn style)
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 36, 512, 42);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(0, 86, 512, 18);
  ctx.fillStyle = '#f97316';
  ctx.fillRect(0, 108, 512, 8);

  // Tangki oksidator & seksi mesin bawah
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 415, 512, 97);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(0, 402, 512, 12);

  // Garis panel & paku keling (rivet seams)
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.28)';
  ctx.lineWidth = 2;
  for (let y = 0; y < 512; y += 64) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke();
  }
  for (let x = 0; x < 512; x += 128) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 512); ctx.stroke();
  }

  // Jalur pipa LOX eksternal (raceway) & kode seri
  ctx.fillStyle = '#334155';
  ctx.fillRect(242, 130, 28, 260);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(110, 175, 16, 170);
  ctx.fillRect(386, 175, 16, 170);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function createSmokeTexture(): any {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 31);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.5, 'rgba(226, 232, 240, 0.72)');
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

  // Badan utama roket (Stage 1 & Stage 2)
  rocketGroup.add(new THREE.Mesh(
    new THREE.CylinderGeometry(0.145, 0.165, 1.08, 32),
    new THREE.MeshStandardMaterial({ map: hullTexture, metalness: 0.5, roughness: 0.25 })
  ));

  // Cincin interstage & tangki samping (side boosters) biar tampak seperti roket berat asli
  const interstageRing = new THREE.Mesh(
    new THREE.CylinderGeometry(0.152, 0.152, 0.06, 32),
    new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.85, roughness: 0.2 })
  );
  interstageRing.position.y = 0.24;
  rocketGroup.add(interstageRing);

  const boosterGeo = new THREE.CylinderGeometry(0.055, 0.062, 0.68, 20);
  const boosterNoseGeo = new THREE.ConeGeometry(0.055, 0.14, 20);
  const boosterMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.45, roughness: 0.28 });
  const boosterCapMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.5, roughness: 0.25 });
  [-1, 1].forEach((side) => {
    const b = new THREE.Mesh(boosterGeo, boosterMat);
    b.position.set(side * 0.205, -0.18, 0);
    rocketGroup.add(b);
    const bn = new THREE.Mesh(boosterNoseGeo, boosterCapMat);
    bn.position.set(side * 0.205, 0.23, 0);
    rocketGroup.add(bn);
  });

  // Jendela kabin / sensor avionik berbingkai metalik
  const portFrame = new THREE.Mesh(
    new THREE.TorusGeometry(0.042, 0.01, 12, 24),
    new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.2 })
  );
  portFrame.position.set(0, 0.36, 0.148);
  rocketGroup.add(portFrame);
  const portGlass = new THREE.Mesh(
    new THREE.CircleGeometry(0.038, 20),
    new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.6, roughness: 0.1 })
  );
  portGlass.position.set(0, 0.36, 0.15);
  rocketGroup.add(portGlass);

  // Payload fairing & kerucut hidung aerodinamis + menara escape tower
  const fairingMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.128, 0.148, 0.19, 32),
    new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.5, roughness: 0.22 })
  );
  fairingMesh.position.y = 0.635;
  rocketGroup.add(fairingMesh);

  const noseMesh = new THREE.Mesh(
    new THREE.ConeGeometry(0.128, 0.38, 32),
    new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.45, roughness: 0.25 })
  );
  noseMesh.position.y = 0.92;
  rocketGroup.add(noseMesh);

  const tipMesh = new THREE.Mesh(
    new THREE.ConeGeometry(0.026, 0.14, 16),
    new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9, roughness: 0.18 })
  );
  tipMesh.position.y = 1.15;
  rocketGroup.add(tipMesh);

  // Nozzle lonceng mesin utama (Bell Nozzle)
  const nozzleMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.082, 0.142, 0.22, 24, 1, true),
    new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.92, roughness: 0.22, side: THREE.DoubleSide })
  );
  nozzleMesh.position.y = -0.63;
  rocketGroup.add(nozzleMesh);

  // 4 Sirip Delta Aerodinamis dengan trim merah
  const finGeo = new THREE.BoxGeometry(0.022, 0.38, 0.23);
  const finMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.25 });
  for (let i = 0; i < 4; i++) {
    const fin = new THREE.Mesh(finGeo, finMat);
    const angle = (i * Math.PI) / 2;
    fin.position.set(Math.sin(angle) * 0.185, -0.38, Math.cos(angle) * 0.185);
    fin.rotation.y = angle;
    rocketGroup.add(fin);
  }

  // Lidah api roket proporsional
  const flameRed = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.85, 18), new THREE.MeshBasicMaterial({ color: 0xea580c, transparent: true, opacity: 0.78 }));
  flameRed.rotation.x = Math.PI; flameRed.position.y = -1.12; rocketGroup.add(flameRed);

  const flameOrange = new THREE.Mesh(new THREE.ConeGeometry(0.095, 0.62, 18), new THREE.MeshBasicMaterial({ color: 0xfacc15, transparent: true, opacity: 0.92 }));
  flameOrange.rotation.x = Math.PI; flameOrange.position.y = -0.98; rocketGroup.add(flameOrange);

  const flameCore = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.38, 16), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  flameCore.rotation.x = Math.PI; flameCore.position.y = -0.86; rocketGroup.add(flameCore);

  // Jejak asap panjang seperti contrail pesawat terbang yang memudar perlahan
  const trailPoints: any[] = [];
  const MAX_TRAIL_POINTS = 95;
  const trailPosArray = new Float32Array(MAX_TRAIL_POINTS * 3);
  const trailGeo = new THREE.BufferGeometry();
  trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPosArray, 3));
  trailGeo.setDrawRange(0, 0);
  const trailMat = new THREE.LineBasicMaterial({ color: 0xf1f5f9, transparent: true, opacity: 0, visible: false });
  const contrailLine = new THREE.Line(trailGeo, trailMat);
  contrailLine.frustumCulled = false;
  ovScene.add(contrailLine);

  // Sprite asap lembut sepanjang jalur lingkaran yang menghilang perlahan
  interface ExhaustParticle { sprite: any; mat: any; vel: any; life: number; decay: number; baseScale: number; growRate: number; }
  const particles: ExhaustParticle[] = [];

  let lastNozzlePos: any = null;
  function spawnContrailPuff(origin: any, tangent: any, rocketScale: number): void {
    const startPt = lastNozzlePos ? lastNozzlePos.clone() : origin.clone();
    lastNozzlePos = origin.clone();
    const steps = 3;
    for (let s = 1; s <= steps; s++) {
      if (particles.length >= 260) break;
      const frac = s / steps;
      const puffPos = new THREE.Vector3().lerpVectors(startPt, origin, frac);
      const mat = new THREE.SpriteMaterial({
        map: smokeTexture,
        color: Math.random() > 0.25 ? 0xffffff : 0xe2e8f0,
        transparent: true,
        opacity: 0.68,
        depthWrite: false
      });
      const smoke = new THREE.Sprite(mat);
      smoke.position.copy(puffPos);
      smoke.position.x += (Math.random() - 0.5) * 0.035 * rocketScale;
      smoke.position.y += (Math.random() - 0.5) * 0.035 * rocketScale;
      const initialSize = (0.16 + Math.random() * 0.05) * rocketScale;
      smoke.scale.set(initialSize, initialSize, 1);
      ovScene.add(smoke);

      // Asap jet rapat menyatu sepanjang jalur lingkaran & memudar perlahan
      const driftVel = tangent.clone().multiplyScalar(-0.0035 * rocketScale);
      driftVel.x += (Math.random() - 0.5) * 0.0035;
      driftVel.y += (Math.random() - 0.5) * 0.0035;
      particles.push({
        sprite: smoke,
        mat,
        vel: driftVel,
        life: 1.0,
        decay: 0.0105,
        baseScale: initialSize,
        growRate: 0.006 * rocketScale
      });
    }
  }

  let rocketActive = false, launchProgress = 0;
  let launchOrigin = new THREE.Vector3();
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

  // Kurva parametrik 100% kontinu: terbang dari Bumi ke atas -> berputar melingkar 360 derajat -> lurus menembus atas layar
  function evalFlightPoint(u: number, origin: any): any {
    const isMobile = window.innerWidth < 769;
    const loopRadiusX = isMobile ? 0.95 : 1.45;
    const loopRadiusY = isMobile ? 0.85 : 1.15;
    const climbBeforeLoop = isMobile ? 0.95 : 1.15;
    const climbDuringLoop = isMobile ? 0.55 : 0.75;
    const straightClimb = isMobile ? 5.2 : 6.0;

    let x = origin.x;
    let y = origin.y;
    let z = origin.z;

    if (u <= 0.24) {
      // Fase 1: Meluncur naik dari Bumi ke titik masuk lingkaran
      const p = u / 0.24;
      const easeIn = p * p * (2 - p);
      x = origin.x + Math.sin(p * Math.PI * 0.5) * (loopRadiusX * 0.15);
      y = origin.y + easeIn * climbBeforeLoop;
      z = origin.z + easeIn * 0.8;
    } else if (u <= 0.74) {
      // Fase 2: Berputar melingkar 1 putaran penuh (0 -> 2*PI) di langit atas Bumi
      const p = (u - 0.24) / 0.50;
      const theta = p * Math.PI * 2;
      const entryX = origin.x + loopRadiusX * 0.15;
      const entryY = origin.y + climbBeforeLoop;
      // Mulai tangen mengarah ke atas, memutar melingkar mulus lalu kembali mengarah lurus ke atas
      x = entryX - loopRadiusX * (1 - Math.cos(theta));
      y = entryY + loopRadiusY * Math.sin(theta) + p * climbDuringLoop;
      z = origin.z + 0.8 + Math.sin(p * Math.PI) * 0.65 + p * 0.5;
    } else {
      // Fase 3: Sehabis melingkar, langsung melesat lurus ke atas keluar layar tanpa patah arah
      const p = (u - 0.74) / 0.26;
      const exitX = origin.x + loopRadiusX * 0.15;
      const exitY = origin.y + climbBeforeLoop + climbDuringLoop;
      const exitZ = origin.z + 1.3;
      // Kecepatan tangen keluar lingkaran: dx/du = 0, dy/du = (loopRadiusY * 2*PI + climbDuringLoop) / 0.50
      const exitVelY = (loopRadiusY * Math.PI * 2 + climbDuringLoop) / 0.50;
      const du = u - 0.74;
      x = exitX;
      y = exitY + exitVelY * du * 0.55 + p * p * straightClimb;
      z = exitZ + p * 0.6;
    }
    return new THREE.Vector3(x, y, z);
  }

  function triggerRocketLaunch(): void {
    if (rocketActive || document.hidden || !earthInViewport) return;
    const rect = renderer.domElement.getBoundingClientRect();
    if (rect.bottom < 80 || rect.top > window.innerHeight) return;

    let lx = rect.left + rect.width * 0.52, ly = rect.top + rect.height * 0.52;
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

    launchOrigin = screenToOverlayWorld(lx, ly, 1.5);
    lastNozzlePos = null;
    trailPoints.length = 0;
    trailGeo.setDrawRange(0, 0);
    trailMat.opacity = 0.65;

    rocketActive = true;
    launchProgress = 0;
    overlayCanvas.style.display = 'block';
    rocketGroup.visible = true;
    rocketGroup.position.copy(launchOrigin);
    rocketGroup.scale.setScalar(0.18);
    shockMat.opacity = 0.95;
    shockRing.scale.setScalar(1);
    sfx.playRocketLaunch();
  }

  setTimeout(triggerRocketLaunch, 2200);
  setInterval(triggerRocketLaunch, 13500);

  if (stageBox) {
    mountGlobeInspectorAndTrigger(stageBox);
    const launchBtn = document.getElementById('v4-launch-rocket-btn');
    launchBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      sfx.playUiClick(760);
      triggerRocketLaunch();
    });
  }

  const hubNames = [
    'Surabaya/ID (14ms)', 'Jakarta/ID (16ms)', 'Singapore (24ms)',
    'Tokyo/JP (68ms)', 'Dubai/AE (92ms)', 'London/UK (148ms)',
    'New York/US (195ms)', 'Sydney/AU (76ms)', 'Sao Paulo/BR (245ms)'
  ];
  let hubCycleIdx = 0;
  const hubReadout = document.getElementById('v4-hub-readout');
  renderer.domElement.addEventListener('click', () => {
    hubCycleIdx = (hubCycleIdx + 1) % hubNames.length;
    sfx.playUiClick(650);
    if (hubReadout) hubReadout.textContent = `HUB: ${hubNames[hubCycleIdx]}`;
  });
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

    if (rocketActive || particles.length > 0 || trailPoints.length > 0) {
      if (rocketActive) {
        launchProgress += 0.0085;
        const u = Math.min(1, launchProgress);
        const pos = evalFlightPoint(u, launchOrigin);
        const nextPos = evalFlightPoint(u + 0.006, launchOrigin);
        const tangent = nextPos.sub(pos).normalize();

        if (tangent.lengthSq() > 0.0001) {
          rocketGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
        }

        rocketGroup.position.copy(pos);
        rocketGroup.rotateY(u * 8);

        // Skala roket tetap mungil proporsional dari awal meluncur sampai lurus ke atas
        const currentScale = 0.18 + Math.min(u, 0.85) * 0.22;
        rocketGroup.scale.setScalar(currentScale);

        flameRed.scale.set(0.95 + Math.random() * 0.12, 0.85 + Math.random() * 0.35, 0.95 + Math.random() * 0.12);
        flameOrange.scale.set(1, 0.82 + Math.random() * 0.3, 1);
        flameCore.scale.set(1, 0.9 + Math.random() * 0.25, 1);

        const nozzleWorldPos = pos.clone().addScaledVector(tangent, -0.68 * currentScale);
        engineGlowLight.position.copy(nozzleWorldPos);
        engineGlowLight.intensity = 2.8 + Math.random() * 1.6;

        if (stageBox && u < 0.18 && earthInViewport) {
          const shake = (0.18 - u) * 7;
          stageBox.style.transform = `translate3d(${(Math.random() - 0.5) * shake}px, ${(Math.random() - 0.5) * shake}px, 0)`;
        } else if (stageBox && stageBox.style.transform) {
          stageBox.style.transform = '';
        }

        // Rekam titik jejak garis contrail melingkar & lurus ke atas
        trailPoints.push(nozzleWorldPos.clone());
        if (trailPoints.length > MAX_TRAIL_POINTS) trailPoints.shift();
        for (let k = 0; k < trailPoints.length; k++) {
          trailPosArray[k * 3] = trailPoints[k].x;
          trailPosArray[k * 3 + 1] = trailPoints[k].y;
          trailPosArray[k * 3 + 2] = trailPoints[k].z;
        }
        trailGeo.attributes.position.needsUpdate = true;
        trailGeo.setDrawRange(0, trailPoints.length);

        // Munculkan puff asap halus di sepanjang lintasan melingkar & lurus
        spawnContrailPuff(nozzleWorldPos, tangent, currentScale);

        if (launchProgress >= 1.02) {
          rocketActive = false;
          rocketGroup.visible = false;
          engineGlowLight.intensity = 0;
          if (stageBox) stageBox.style.transform = '';
        }
      } else if (trailPoints.length > 0) {
        // Setelah roket keluar ke atas, garis jejak contrail ikut memudar perlahan hingga hilang
        trailMat.opacity = Math.max(0, trailMat.opacity - 0.012);
        if (trailMat.opacity <= 0.01) {
          trailPoints.length = 0;
          trailGeo.setDrawRange(0, 0);
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.sprite.position.add(p.vel);
        p.life -= p.decay;
        p.baseScale += p.growRate;
        p.sprite.scale.set(p.baseScale, p.baseScale, 1);
        // Opasitas asap tebal di awal lalu memudar perlahan hingga hilang
        p.mat.opacity = Math.max(0, p.life * 0.68);
        if (p.life <= 0) {
          ovScene.remove(p.sprite);
          p.mat.dispose();
          particles.splice(i, 1);
        }
      }

      ovRenderer.render(ovScene, ovCamera);
      if (!rocketActive && particles.length === 0 && trailPoints.length === 0) {
        overlayCanvas.style.display = 'none';
      }
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

async function loadRustWasmEngine(): Promise<any> {
  try {
    const res = await fetch('./perf_engine.wasm');
    if (!res.ok) return null;
    const bytes = await res.arrayBuffer();
    const { instance } = await WebAssembly.instantiate(bytes);
    return instance.exports;
  } catch {
    return null;
  }
}

async function setupLighthouseAudit(): Promise<void> {
  const btn = document.getElementById('run-audit-btn');
  const gauges = document.querySelectorAll<HTMLElement>('.g-val');
  const auditPanel = document.querySelector<HTMLElement>('.audit-panel');
  if (auditPanel && !auditPanel.querySelector('.polyglot-strip')) {
    renderPolyglotStrip(auditPanel);
  }
  if (!btn || !gauges.length) return;

  const wasmExports = await loadRustWasmEngine();

  btn.addEventListener('click', () => {
    sfx.playUiClick(720);
    btn.textContent = wasmExports ? 'WASM Auditing...' : 'Auditing...';
    gauges.forEach((g) => {
      const target = Number(g.dataset.score || 99);
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / 900);
        const pct = Math.round(p * 100);
        const scoreVal = wasmExports?.compute_eased_score
          ? wasmExports.compute_eased_score(pct, target)
          : Math.round(45 + (target - 45) * (1 - Math.pow(1 - p, 3)));
        g.textContent = String(scoreVal);
        if (p < 1) requestAnimationFrame(tick);
        else {
          g.textContent = String(target);
          btn.textContent = wasmExports ? 'WASM Verified ✓' : 'Verified ✓';
        }
      };
      requestAnimationFrame(tick);
    });
  });

  if (auditPanel) {
    mountWasmBenchmarkLab(auditPanel);
    const rangeEl = document.getElementById('wasm-traffic-range') as HTMLInputElement | null;
    const outEl = document.getElementById('wasm-latency-out');
    const badgeEl = document.getElementById('wasm-node-badge');
    const logEl = document.getElementById('go-telemetry-log');

    const updateLatency = () => {
      const nodes = Number(rangeEl?.value || 12);
      if (badgeEl) badgeEl.textContent = `${nodes} EDGE NODES`;
      const ms = wasmExports?.compute_edge_latency_ms
        ? wasmExports.compute_edge_latency_ms(38, nodes)
        : Math.round(38 / (1 + nodes * 0.18));
      if (outEl) outEl.textContent = `${ms} ms`;
    };

    rangeEl?.addEventListener('input', updateLatency);
    updateLatency();

    try {
      const gRes = await fetch('./go-telemetry.json');
      if (gRes.ok && logEl) {
        const gData = await gRes.json();
        logEl.textContent = `Go Probe (${gData.go_version}) · Status: ${gData.status} · Edge Latency: ${gData.latency_ms}ms · ${gData.generated_utc}`;
      }
    } catch {}
  }
}

function setupV4Suite(): void {
  mountNavbarThemeSwitcher();

  let currentMode: ThemeMode = 'dark';
  try {
    const savedMode = localStorage.getItem('nans_theme_mode');
    if (savedMode === 'light' || savedMode === 'dark') currentMode = savedMode;
  } catch {}
  applyV4ThemeMode(currentMode);

  let selectedPalette = 'Cyber Cyan (#38bdf8, #818cf8)';
  try {
    const savedAcc = localStorage.getItem('nans_theme_accent');
    if (savedAcc) {
      const parsed = JSON.parse(savedAcc);
      if (Array.isArray(parsed) && parsed.length === 2) {
        applyV4ThemeColors(parsed[0], parsed[1]);
        const matchedBtn = document.querySelector<HTMLButtonElement>(`.v4-nav-swatch[data-accent="${parsed[0]}"]`);
        if (matchedBtn?.dataset.palette) selectedPalette = matchedBtn.dataset.palette;
      }
    }
  } catch {}

  const modeBtn = document.getElementById('v4-theme-mode-btn');
  modeBtn?.addEventListener('click', () => {
    sfx.playUiClick(650);
    currentMode = currentMode === 'dark' ? 'light' : 'dark';
    applyV4ThemeMode(currentMode);
  });

  document.querySelectorAll<HTMLButtonElement>('.v4-nav-swatch').forEach((btn) => {
    btn.addEventListener('click', () => {
      sfx.playUiClick(620);
      selectedPalette = btn.dataset.palette || selectedPalette;
      const acc1 = btn.dataset.accent || '#38bdf8';
      const acc2 = btn.dataset.accent2 || '#818cf8';
      applyV4ThemeColors(acc1, acc2);
      const notes = document.getElementById('client-notes') as HTMLTextAreaElement | null;
      if (notes) {
        if (notes.value.includes('Palet:')) {
          notes.value = notes.value.replace(/Palet:[^|]+/, `Palet: ${selectedPalette} `).trim();
        } else {
          notes.value = (notes.value ? notes.value + ' | ' : '') + `Palet: ${selectedPalette}`;
        }
      }
    });
  });

  const estBox = document.querySelector<HTMLElement>('.estimator-box');
  if (estBox) {
    mountV4EstimatorTools(estBox);
  }

  const roiRange = document.getElementById('roi-visitors-range') as HTMLInputElement | null;
  const roiVal = document.getElementById('roi-visitors-val');
  const roiText = document.getElementById('roi-result-text');
  const updateRoi = () => {
    const daily = Number(roiRange?.value || 150);
    if (roiVal) roiVal.textContent = `${daily} / hari`;
    const monthlyLeads = Math.round(daily * 30 * 0.10);
    if (roiText) {
      roiText.textContent = `Proyeksi ~${monthlyLeads} leads/bln (estimasi konversi +10% dengan CTA & kalkulator terstruktur).`;
    }
  };
  roiRange?.addEventListener('input', updateRoi);
  updateRoi();

  const getBriefText = () => {
    const brand = (document.getElementById('client-brand') as HTMLInputElement | null)?.value.trim() || '-';
    const notes = (document.getElementById('client-notes') as HTMLTextAreaElement | null)?.value.trim() || '-';
    const price = document.getElementById('est-price')?.textContent?.trim() || '-';
    const days = document.getElementById('est-days')?.textContent?.trim() || '-';
    const mods = Array.from(document.querySelectorAll<HTMLInputElement>('.est-check:checked')).map((c) => `• ${c.value}`);
    return `NANS DEV BRIEF
Brand: ${brand}
Modul:
${mods.join('\n') || '• Konsultasi'}
Estimasi: ${price} (${days})
Palet: ${selectedPalette}
Catatan: ${notes}`;
  };

  const copyBtn = document.getElementById('v4-copy-brief-btn');
  copyBtn?.addEventListener('click', async () => {
    sfx.playUiClick(680);
    try {
      await navigator.clipboard.writeText(getBriefText());
      if (copyBtn) {
        const prev = copyBtn.textContent;
        copyBtn.textContent = 'Tersalin ✓';
        setTimeout(() => { copyBtn.textContent = prev || 'Salin Brief'; }, 1600);
      }
    } catch {}
  });

  const pdfBtn = document.getElementById('v4-pdf-quote-btn');
  pdfBtn?.addEventListener('click', () => {
    sfx.playUiClick(740);
    const win = window.open('', '_blank');
    if (!win) return;
    const text = getBriefText().replace(/\n/g, '<br>');
    win.document.write(`<!DOCTYPE html><html><head><title>Penawaran Nans Dev</title><style>body{font-family:sans-serif;padding:32px;color:#0f172a;line-height:1.6;}h1{color:#0284c7;margin-bottom:8px;}.box{border:1px solid #cbd5e1;border-radius:12px;padding:20px;background:#f8fafc;}</style></head><body><h1>NANS DEV — Ringkasan Penawaran Proyek</h1><p>Dokumen estimasi layanan web & identitas visual.</p><div class="box">${text}</div><script>window.print();</script></body></html>`);
    win.document.close();
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

function setupVectorLabModes(): void {
  const labEl = document.querySelector<HTMLElement>('.vector-lab');
  if (!labEl) return;
  mountVectorLabModeSwitch(labEl);

  const rasterBox = labEl.querySelector<HTMLElement>('.raster-layer');
  const vectorBox = labEl.querySelector<HTMLElement>('.vector-layer');
  const headingEl = labEl.querySelector<HTMLElement>('h3');
  const descEl = labEl.querySelector<HTMLElement>('p');
  const rangeEl = document.getElementById('vector-range');
  const axisSpans = rangeEl?.nextElementSibling?.querySelectorAll('span');

  const logoRasterSvg = rasterBox?.querySelector('svg')?.outerHTML || '';
  const logoVectorSvg = vectorBox?.querySelector('svg')?.outerHTML || '';

  const legacyWebSvg = `
    <svg width="210" height="132" viewBox="0 0 210 132" fill="none" style="border-radius:6px;box-shadow:0 6px 18px rgba(0,0,0,0.55);">
      <rect x="1" y="1" width="208" height="130" rx="5" fill="#d1d5db" stroke="#6b7280" stroke-width="2"/>
      <rect x="2" y="2" width="206" height="18" fill="#4b5563"/>
      <rect x="8" y="6" width="120" height="9" fill="#e5e7eb"/>
      <rect x="176" y="6" width="24" height="9" fill="#ef4444"/>
      <rect x="8" y="25" width="194" height="16" fill="#1e3a8a"/>
      <text x="14" y="36" fill="#fef08a" font-family="monospace" font-size="8" font-weight="bold">SELAMAT DATANG DI WEB KAMI...</text>
      <rect x="8" y="46" width="54" height="76" fill="#9ca3af" stroke="#4b5563"/>
      <rect x="13" y="52" width="44" height="8" fill="#374151"/>
      <rect x="13" y="65" width="44" height="8" fill="#374151"/>
      <rect x="13" y="78" width="44" height="8" fill="#374151"/>
      <rect x="68" y="46" width="134" height="44" fill="#f3f4f6" stroke="#6b7280"/>
      <line x1="74" y1="56" x2="188" y2="56" stroke="#4b5563" stroke-width="3"/>
      <line x1="74" y1="66" x2="165" y2="66" stroke="#6b7280" stroke-width="2.5"/>
      <line x1="74" y1="75" x2="192" y2="75" stroke="#6b7280" stroke-width="2.5"/>
      <rect x="68" y="95" width="84" height="27" fill="#fee2e2" stroke="#dc2626"/>
      <text x="74" y="107" fill="#b91c1c" font-family="monospace" font-size="7" font-weight="bold">NO MOBILE VIEW</text>
      <text x="74" y="117" fill="#b91c1c" font-family="monospace" font-size="7">LOAD: 6.4s (!)</text>
      <rect x="157" y="95" width="45" height="27" fill="#e5e7eb" stroke="#6b7280"/>
      <text x="163" y="111" fill="#374151" font-family="monospace" font-size="7">NO CTA</text>
    </svg>`;

  const modernWebSvg = `
    <svg width="210" height="132" viewBox="0 0 210 132" fill="none" style="border-radius:8px;filter:drop-shadow(0 8px 20px rgba(56,189,248,0.28));">
      <defs>
        <linearGradient id="modCardGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#1e293b"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
        <linearGradient id="modBtnGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#818cf8"/>
          <stop offset="100%" stop-color="#38bdf8"/>
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="208" height="130" rx="8" fill="#070b14" stroke="#38bdf8" stroke-width="1.5"/>
      <rect x="2" y="2" width="206" height="17" rx="7" fill="#0d1424"/>
      <circle cx="11" cy="10.5" r="2.5" fill="#ef4444"/>
      <circle cx="19" cy="10.5" r="2.5" fill="#f59e0b"/>
      <circle cx="27" cy="10.5" r="2.5" fill="#10b981"/>
      <rect x="52" y="6.5" width="106" height="8" rx="4" fill="#1e293b"/>
      <rect x="168" y="6.5" width="32" height="8" rx="4" fill="rgba(52,211,153,0.2)" stroke="#34d399" stroke-width="0.8"/>
      <text x="173" y="12.5" fill="#34d399" font-family="monospace" font-size="6" font-weight="bold">99 FPS</text>
      <rect x="10" y="24" width="190" height="50" rx="6" fill="url(#modCardGrad)" stroke="rgba(56,189,248,0.35)"/>
      <rect x="18" y="31" width="54" height="7" rx="3.5" fill="rgba(56,189,248,0.22)"/>
      <rect x="18" y="42" width="110" height="7" rx="3.5" fill="#f8fafc"/>
      <rect x="18" y="52" width="84" height="5" rx="2.5" fill="#94a3b8"/>
      <rect x="18" y="60" width="58" height="9" rx="4.5" fill="url(#modBtnGrad)"/>
      <text x="26" y="66.5" fill="#05070c" font-family="sans-serif" font-size="6" font-weight="800">ORDER WA ↗</text>
      <circle cx="166" cy="49" r="16" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" stroke-width="1.2"/>
      <path d="M159 55V43L166 50L173 43V55" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="10" y="80" width="60" height="42" rx="6" fill="#0d1424" stroke="rgba(255,255,255,0.1)"/>
      <rect x="16" y="87" width="26" height="5" rx="2.5" fill="#38bdf8"/>
      <rect x="16" y="96" width="46" height="4" rx="2" fill="#64748b"/>
      <rect x="16" y="104" width="38" height="4" rx="2" fill="#64748b"/>
      <rect x="75" y="80" width="60" height="42" rx="6" fill="#0d1424" stroke="rgba(255,255,255,0.1)"/>
      <rect x="81" y="87" width="26" height="5" rx="2.5" fill="#818cf8"/>
      <rect x="81" y="96" width="46" height="4" rx="2" fill="#64748b"/>
      <rect x="81" y="104" width="38" height="4" rx="2" fill="#64748b"/>
      <rect x="140" y="80" width="60" height="42" rx="6" fill="#0d1424" stroke="rgba(52,211,153,0.35)"/>
      <rect x="146" y="87" width="30" height="5" rx="2.5" fill="#34d399"/>
      <rect x="146" y="96" width="46" height="4" rx="2" fill="#cbd5e1"/>
      <rect x="146" y="104" width="40" height="8" rx="4" fill="rgba(52,211,153,0.18)"/>
    </svg>`;

  labEl.querySelectorAll<HTMLButtonElement>('.v4-lab-mode-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      sfx.playUiClick(640);
      labEl.querySelectorAll<HTMLButtonElement>('.v4-lab-mode-btn').forEach((b) => {
        b.style.borderColor = 'rgba(255,255,255,0.12)';
        b.style.color = '#94a3b8';
        b.style.background = 'rgba(255,255,255,0.03)';
      });
      btn.style.borderColor = '#38bdf8';
      btn.style.color = '#f8fafc';
      btn.style.background = 'rgba(56,189,248,0.16)';

      const isWeb = btn.dataset.labMode === 'web';
      if (headingEl) {
        headingEl.textContent = isWeb
          ? 'Geser Perbandingan Web Jadul vs Arsitektur Modern'
          : 'Geser untuk Menguji Ketajaman Geometri';
      }
      if (descEl) {
        descEl.textContent = isWeb
          ? 'Bandingkan layout statis/lambat tanpa struktur konversi dengan sistem web responsif, cepat, dan siap closing WhatsApp.'
          : 'Bandingkan langsung aset beresolusi rendah dengan hasil rekonstruksi vektor murni yang tetap tajam hingga skala baliho maupun layar Retina.';
      }
      if (axisSpans && axisSpans.length >= 2) {
        axisSpans[0].textContent = isWeb ? '← WEB JADUL' : '← RASTER BLUR';
        axisSpans[1].textContent = isWeb ? 'WEB MODERN →' : 'VECTOR SHARP →';
      }
      if (rasterBox) {
        const oldSvg = rasterBox.querySelector('svg');
        if (oldSvg) oldSvg.outerHTML = isWeb ? legacyWebSvg : logoRasterSvg;
        const sm = rasterBox.querySelector('small');
        if (sm) sm.textContent = isWeb ? 'LEGACY WEB (SLOW & CLUTTERED)' : 'LOW-RES RASTER (PECAH)';
      }
      if (vectorBox) {
        const oldSvg = vectorBox.querySelector('svg');
        if (oldSvg) oldSvg.outerHTML = isWeb ? modernWebSvg : logoVectorSvg;
        const sm = vectorBox.querySelector('small');
        if (sm) sm.textContent = isWeb ? 'NANS DEV MODERN WEB (60FPS & WA READY)' : '100% VECTOR GEOMETRY (PRESISI)';
      }
    });
  });
}

function setupVectorSlider(): void {
  setupVectorLabModes();
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
  }, 2200);
});
