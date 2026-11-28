import { mountNansSmartAssistant } from './nans-smart-assistant';
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

const WHATSAPP_NUMBER = '6283187521130';
const WHATSAPP_DISPLAY = '0831-8752-1130';
const FASTWORK_ID = '@yusnanyulyakso1';
const FASTWORK_URL = 'https://fastwork.id/user/yusnanyulyakso1';
const CONTACT_EMAIL = 'yusnanyulyakso29@gmail.com';

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

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 36, 512, 42);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(0, 86, 512, 18);
  ctx.fillStyle = '#f97316';
  ctx.fillRect(0, 108, 512, 8);

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 415, 512, 97);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(0, 402, 512, 12);

  ctx.strokeStyle = 'rgba(15, 23, 42, 0.28)';
  ctx.lineWidth = 2;
  for (let y = 0; y < 512; y += 64) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke();
  }
  for (let x = 0; x < 512; x += 128) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 512); ctx.stroke();
  }

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

  rocketGroup.add(new THREE.Mesh(
    new THREE.CylinderGeometry(0.145, 0.165, 1.08, 32),
    new THREE.MeshStandardMaterial({ map: hullTexture, metalness: 0.5, roughness: 0.25 })
  ));

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

  const nozzleMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.082, 0.142, 0.22, 24, 1, true),
    new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.92, roughness: 0.22, side: THREE.DoubleSide })
  );
  nozzleMesh.position.y = -0.63;
  rocketGroup.add(nozzleMesh);

  const finGeo = new THREE.BoxGeometry(0.022, 0.38, 0.23);
  const finMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.25 });
  for (let i = 0; i < 4; i++) {
    const fin = new THREE.Mesh(finGeo, finMat);
    const angle = (i * Math.PI) / 2;
    fin.position.set(Math.sin(angle) * 0.185, -0.38, Math.cos(angle) * 0.185);
    fin.rotation.y = angle;
    rocketGroup.add(fin);
  }

  const flameRed = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.85, 18), new THREE.MeshBasicMaterial({ color: 0xea580c, transparent: true, opacity: 0.78 }));
  flameRed.rotation.x = Math.PI; flameRed.position.y = -1.12; rocketGroup.add(flameRed);

  const flameOrange = new THREE.Mesh(new THREE.ConeGeometry(0.095, 0.62, 18), new THREE.MeshBasicMaterial({ color: 0xfacc15, transparent: true, opacity: 0.92 }));
  flameOrange.rotation.x = Math.PI; flameOrange.position.y = -0.98; rocketGroup.add(flameOrange);

  const flameCore = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.38, 16), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  flameCore.rotation.x = Math.PI; flameCore.position.y = -0.86; rocketGroup.add(flameCore);

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
      const p = u / 0.24;
      const easeIn = p * p * (2 - p);
      x = origin.x + Math.sin(p * Math.PI * 0.5) * (loopRadiusX * 0.15);
      y = origin.y + easeIn * climbBeforeLoop;
      z = origin.z + easeIn * 0.8;
    } else if (u <= 0.74) {
      const p = (u - 0.24) / 0.50;
      const theta = p * Math.PI * 2;
      const entryX = origin.x + loopRadiusX * 0.15;
      const entryY = origin.y + climbBeforeLoop;
      x = entryX - loopRadiusX * (1 - Math.cos(theta));
      y = entryY + loopRadiusY * Math.sin(theta) + p * climbDuringLoop;
      z = origin.z + 0.8 + Math.sin(p * Math.PI) * 0.65 + p * 0.5;
    } else {
      const p = (u - 0.74) / 0.26;
      const exitX = origin.x + loopRadiusX * 0.15;
      const exitY = origin.y + climbBeforeLoop + climbDuringLoop;
      const exitZ = origin.z + 1.3;
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

        trailPoints.push(nozzleWorldPos.clone());
        if (trailPoints.length > MAX_TRAIL_POINTS) trailPoints.shift();
        for (let k = 0; k < trailPoints.length; k++) {
          trailPosArray[k * 3] = trailPoints[k].x;
          trailPosArray[k * 3 + 1] = trailPoints[k].y;
          trailPosArray[k * 3 + 2] = trailPoints[k].z;
        }
        trailGeo.attributes.position.needsUpdate = true;
        trailGeo.setDrawRange(0, trailPoints.length);

        spawnContrailPuff(nozzleWorldPos, tangent, currentScale);

        if (launchProgress >= 1.02) {
          rocketActive = false;
          rocketGroup.visible = false;
          engineGlowLight.intensity = 0;
          if (stageBox) stageBox.style.transform = '';
        }
      } else if (trailPoints.length > 0) {
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
    { label: 'Buka Portofolio Web: KlinPro Express Laundry', tag: 'WEB APP', run: () => window.open('https://klinpro-express-laundry.github.io/', '_blank') },
    { label: 'Buka Portofolio Web: TokoBukYul E-Commerce', tag: 'STORE', run: () => window.open('https://tokobukyul.github.io/TokoBukYul/', '_blank') },
    { label: 'Buka Portofolio Web: Laundry God', tag: 'WEB APP', run: () => window.open('https://laundry-god.github.io/', '_blank') },
    { label: 'Eksplorasi Platform Direktori: bizsnap', tag: 'SYSTEM', run: () => location.assign('#portfolio') },
    { label: 'Jalankan Live Lighthouse Performance Audit', tag: 'BENCHMARK', run: () => { location.assign('#blueprint'); document.getElementById('run-audit-btn')?.click(); } },
    { label: 'Uji Ketajaman Logo di Vector 3D Lab', tag: 'VECTOR', run: () => location.assign('#vector-lab') },
    { label: 'Buka AI Scope & Kalkulator Estimasi Biaya', tag: 'ESTIMATOR', run: () => location.assign('#estimator') },
    { label: `Order Resmi via Fastwork (${FASTWORK_ID})`, tag: 'FASTWORK', run: () => window.open(FASTWORK_URL, '_blank') },
    { label: `Hubungi Nans Dev via WhatsApp (${WHATSAPP_DISPLAY})`, tag: 'DIRECT', run: () => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank') },
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
  const bpPanel = document.querySelector<HTMLElement>('.blueprint-panel');
  if (!nodes.length || !inspector) return;

  const steps = [
    {
      title: '01. High-Impact UI/UX & Interactive 3D',
      desc: 'Perancangan antarmuka modern responsif Mobile-First dengan aset vektor tajam dan aksen 3D WebGL ringan.',
      code: 'renderTarget: "60FPS Mobile" | assets: ["SVG", "WebGL2", "SCSS"]',
      short: 'UI / 3D',
      log: '[0.14s] UI/UX Stage -> WebGL2 & Mobile-First 60FPS layout hydrated ✓',
    },
    {
      title: '02. Modular TypeScript & Python Engine',
      desc: 'Arsitektur kode terstruktur, bersih dari script berlebih, dan siap dikembangkan untuk katalog maupun kalkulator bisnis.',
      code: 'pipeline: "Python JSON Builder -> Strict TypeScript Bundle"',
      short: 'Engine',
      log: '[0.36s] Core Engine -> Strict TypeScript & JSON data payload verified ✓',
    },
    {
      title: '03. Automated WhatsApp & Payment Flow',
      desc: 'Integrasi kalkulator pesanan otomatis yang mengubah pilihan pelanggan menjadi format invoice/brief langsung ke WhatsApp.',
      code: 'checkoutBridge: "Dynamic Cart -> Encoded WhatsApp API"',
      short: 'WA / API',
      log: '[0.61s] WA & API -> Dynamic order cart encoded to WhatsApp bridge ✓',
    },
    {
      title: '04. Global Edge CDN & Zero-Downtime CI/CD',
      desc: 'Otomatisasi build dan deployment dengan kompresi aset statis super cepat untuk akses instan dari berbagai wilayah.',
      code: 'status: "DEPLOYED" | uptime: "99.9%" | ttfb: "<45ms"',
      short: 'Edge CDN',
      log: '[0.84s] Edge CDN -> Global cache HIT (TTFB <45ms) · DEPLOYED ✓',
    },
  ];

  let simWrap = bpPanel?.querySelector<HTMLElement>('#bp-flow-simulator') || null;
  if (bpPanel && !simWrap) {
    if (!document.getElementById('bp-flow-sim-css')) {
      const style = document.createElement('style');
      style.id = 'bp-flow-sim-css';
      style.textContent = `
        @keyframes bpPacketPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.55); }
          50% { transform: scale(1.06); box-shadow: 0 0 14px 2px rgba(56, 189, 248, 0.45); }
        }
        #bp-flow-simulator .flow-node.active {
          border-color: var(--v4-accent, #38bdf8) !important;
          background: rgba(56, 189, 248, 0.16) !important;
          color: #f8fafc !important;
          animation: bpPacketPulse 0.7s ease;
        }
        #bp-flow-simulator .flow-node.passed {
          border-color: #34d399 !important;
          color: #34d399 !important;
        }
        #bp-flow-simulator .flow-wire-fill.active {
          width: 100% !important;
        }
      `;
      document.head.appendChild(style);
    }

    simWrap = document.createElement('div');
    simWrap.id = 'bp-flow-simulator';
    simWrap.style.cssText = 'margin-top:14px;padding:12px;border-radius:14px;background:#05070c;border:1px solid rgba(56,189,248,0.22);';
    simWrap.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:10px;">
        <span style="font-family:monospace;font-size:0.7rem;font-weight:800;color:var(--v4-accent,#38bdf8);letter-spacing:0.6px;">LIVE DATA FLOW &amp; PACKET SIMULATOR</span>
        <button type="button" id="bp-sim-btn" style="background:rgba(56,189,248,0.14);border:1px solid var(--v4-accent,#38bdf8);color:var(--v4-accent,#38bdf8);font-size:0.72rem;font-weight:800;padding:5px 10px;border-radius:8px;cursor:pointer;white-space:nowrap;">Simulate Flow ▶</button>
      </div>
      <div style="display:grid;grid-template-columns:1fr auto 1fr auto 1fr auto 1fr;align-items:center;gap:4px;margin-bottom:10px;">
        ${steps.map((st, idx) => `
          <button type="button" class="flow-node${idx === 0 ? ' active' : ''}" data-flow-idx="${idx}" style="padding:7px 4px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.03);color:#94a3b8;font-family:monospace;font-size:0.64rem;font-weight:700;cursor:pointer;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${st.short}</button>
          ${idx < steps.length - 1 ? `<div style="width:14px;height:3px;border-radius:99px;background:rgba(255,255,255,0.1);overflow:hidden;"><div class="flow-wire-fill" data-wire-idx="${idx}" style="width:0%;height:100%;background:linear-gradient(90deg,var(--v4-accent2,#818cf8),var(--v4-accent,#38bdf8),#34d399);transition:width 0.35s ease;"></div></div>` : ''}
        `).join('')}
      </div>
      <div id="bp-flow-log" style="font-family:monospace;font-size:0.68rem;line-height:1.55;color:#cbd5e1;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);border-radius:9px;padding:8px 10px;min-height:68px;">
        <div style="color:#34d399;">● PACKET STREAM READY</div>
        <div style="color:#94a3b8;">Klik "Simulate Flow" untuk melacak paket data dari UI ke Edge CDN.</div>
      </div>
    `;
    bpPanel.appendChild(simWrap);
  }

  if (bpPanel && !bpPanel.querySelector('#bp-security-strip')) {
    const secStrip = document.createElement('div');
    secStrip.id = 'bp-security-strip';
    secStrip.style.cssText = 'margin-top:12px;padding:11px 12px;border-radius:14px;background:#05070c;border:1px solid rgba(52,211,153,0.22);font-family:monospace;';
    secStrip.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px;">
        <span style="font-size:0.68rem;font-weight:800;color:#34d399;letter-spacing:0.6px;">ENTERPRISE SECURITY &amp; UPTIME</span>
        <span style="display:inline-flex;align-items:center;gap:5px;font-size:0.66rem;font-weight:700;color:#f8fafc;background:rgba(52,211,153,0.12);border:1px solid rgba(52,211,153,0.35);padding:2px 8px;border-radius:999px;">
          <span class="live-dot" style="width:6px;height:6px;border-radius:50%;background:#34d399;display:inline-block;"></span>
          LIVE PING: <strong id="bp-live-ping-val" style="color:#34d399;">14 ms</strong>
        </span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;">
        <div style="padding:7px 6px;border-radius:9px;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.08);text-align:center;">
          <div style="font-size:0.61rem;color:#34d399;font-weight:800;margin-bottom:2px;">✓ ACTIVE</div>
          <div style="font-size:0.63rem;color:#e2e8f0;font-weight:700;">SSL/TLS 1.3</div>
        </div>
        <div style="padding:7px 6px;border-radius:9px;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.08);text-align:center;">
          <div style="font-size:0.61rem;color:var(--v4-accent,#38bdf8);font-weight:800;margin-bottom:2px;">✓ PROTECTED</div>
          <div style="font-size:0.63rem;color:#e2e8f0;font-weight:700;">Edge DDoS Shield</div>
        </div>
        <div style="padding:7px 6px;border-radius:9px;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.08);text-align:center;">
          <div style="font-size:0.61rem;color:#a855f7;font-weight:800;margin-bottom:2px;">✓ 99.98% SLA</div>
          <div style="font-size:0.63rem;color:#e2e8f0;font-weight:700;">Zero-Downtime Git</div>
        </div>
      </div>
    `;
    bpPanel.appendChild(secStrip);

    const pingEl = document.getElementById('bp-live-ping-val');
    const measureLivePing = async () => {
      if (document.hidden || !pingEl) return;
      const t0 = performance.now();
      try {
        await fetch('./services.json', { method: 'HEAD', cache: 'no-store' });
        const rtt = Math.max(9, Math.min(48, Math.round(performance.now() - t0)));
        pingEl.textContent = `${rtt} ms`;
      } catch {
        const jitter = 12 + Math.floor(Math.random() * 7);
        pingEl.textContent = `${jitter} ms`;
      }
    };
    measureLivePing();
    window.setInterval(measureLivePing, 4500);
  }

  const flowNodes = simWrap ? Array.from(simWrap.querySelectorAll<HTMLButtonElement>('.flow-node')) : [];
  const flowWires = simWrap ? Array.from(simWrap.querySelectorAll<HTMLElement>('.flow-wire-fill')) : [];
  const flowLog = document.getElementById('bp-flow-log');
  const simBtn = document.getElementById('bp-sim-btn') as HTMLButtonElement | null;

  const syncFlowDiagram = (activeIdx: number, passedAll = false) => {
    flowNodes.forEach((fn, idx) => {
      fn.classList.toggle('active', !passedAll && idx === activeIdx);
      fn.classList.toggle('passed', passedAll || idx < activeIdx);
    });
    flowWires.forEach((fw, idx) => {
      fw.classList.toggle('active', passedAll || idx < activeIdx);
    });
  };

  const showStep = (i: number) => {
    const s = steps[i] || steps[0];
    nodes.forEach((b, idx) => b.classList.toggle('active', idx === i));
    inspector.innerHTML = `<div class="bp-title">${s.title}</div><p class="bp-desc">${s.desc}</p><div class="bp-code">${s.code}</div>`;
    syncFlowDiagram(i, false);
  };

  showStep(0);

  nodes.forEach((n) => n.addEventListener('click', () => {
    sfx.playUiClick(600);
    const idx = Number(n.dataset.step || 0);
    showStep(idx);
    if (flowLog) {
      flowLog.innerHTML = `<div style="color:var(--v4-accent,#38bdf8);">● NODE 0${idx + 1} INSPECTED</div><div>${steps[idx].log}</div>`;
    }
  }));

  flowNodes.forEach((fn) => fn.addEventListener('click', () => {
    sfx.playUiClick(620);
    const idx = Number(fn.dataset.flowIdx || 0);
    showStep(idx);
    if (flowLog) {
      flowLog.innerHTML = `<div style="color:var(--v4-accent,#38bdf8);">● PACKET HOP 0${idx + 1}</div><div>${steps[idx].log}</div>`;
    }
  }));

  let simTimers: number[] = [];
  simBtn?.addEventListener('click', () => {
    sfx.playUiClick(740);
    simTimers.forEach((t) => clearTimeout(t));
    simTimers = [];
    if (simBtn) {
      simBtn.disabled = true;
      simBtn.textContent = 'Routing Packet...';
    }
    if (flowLog) {
      flowLog.innerHTML = `<div style="color:#fbbf24;">⚡ PACKET DISPATCHED [ID: #ND-${Math.floor(1000 + Math.random() * 9000)}]</div>`;
    }

    steps.forEach((st, idx) => {
      const timer = window.setTimeout(() => {
        sfx.playUiClick(560 + idx * 70);
        showStep(idx);
        if (flowLog) {
          const line = document.createElement('div');
          line.style.color = idx === steps.length - 1 ? '#34d399' : '#e2e8f0';
          line.textContent = st.log;
          flowLog.appendChild(line);
        }
        if (idx === steps.length - 1) {
          const doneTimer = window.setTimeout(() => {
            syncFlowDiagram(idx, true);
            if (simBtn) {
              simBtn.disabled = false;
              simBtn.textContent = 'Replay Flow ↻';
            }
          }, 380);
          simTimers.push(doneTimer);
        }
      }, idx * 520);
      simTimers.push(timer);
    });
  });
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
  let activeAcc1 = '#38bdf8';
  let activeAcc2 = '#818cf8';
  try {
    const savedAcc = localStorage.getItem('nans_theme_accent');
    if (savedAcc) {
      const parsed = JSON.parse(savedAcc);
      if (Array.isArray(parsed) && parsed.length === 2) {
        activeAcc1 = parsed[0];
        activeAcc2 = parsed[1];
        applyV4ThemeColors(activeAcc1, activeAcc2);
        const matchedBtn = document.querySelector<HTMLButtonElement>(`.v4-nav-swatch[data-accent="${activeAcc1}"]`);
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
      activeAcc1 = btn.dataset.accent || '#38bdf8';
      activeAcc2 = btn.dataset.accent2 || '#818cf8';
      applyV4ThemeColors(activeAcc1, activeAcc2);
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

  // PART 4: Add Fastwork Order Option & Official Contact Strip in Estimator
  const waBtn = document.getElementById('est-wa-btn');
  if (waBtn && waBtn.parentElement && !document.getElementById('est-fastwork-btn')) {
    const fwBtn = document.createElement('button');
    fwBtn.type = 'button';
    fwBtn.id = 'est-fastwork-btn';
    fwBtn.style.cssText = 'width:100%;margin-top:9px;padding:11px 14px;border-radius:12px;border:1px solid rgba(56,189,248,0.45);background:linear-gradient(135deg,rgba(14,165,233,0.16),rgba(99,102,241,0.16));color:#f8fafc;font-weight:800;font-size:0.84rem;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:7px;transition:transform 0.2s ease,border-color 0.2s ease;';
    fwBtn.innerHTML = `<span>🛡️ Order via Fastwork Escrow (${FASTWORK_ID})</span><span style="font-size:0.9rem;">↗</span>`;
    fwBtn.addEventListener('click', async () => {
      sfx.playUiClick(720);
      try { await navigator.clipboard.writeText(getBriefText()); } catch {}
      window.open(FASTWORK_URL, '_blank');
    });
    waBtn.insertAdjacentElement('afterend', fwBtn);

    const contactBar = document.createElement('div');
    contactBar.id = 'est-direct-contacts';
    contactBar.style.cssText = 'margin-top:10px;padding:9px 10px;border-radius:10px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);font-size:0.71rem;color:#94a3b8;line-height:1.55;text-align:center;';
    contactBar.innerHTML = `
      <div style="color:#cbd5e1;font-weight:700;margin-bottom:2px;">Official Channels · Nans Dev</div>
      <div>WA: <a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" style="color:#34d399;text-decoration:none;font-weight:700;">${WHATSAPP_DISPLAY}</a> · Fastwork: <a href="${FASTWORK_URL}" target="_blank" style="color:#38bdf8;text-decoration:none;font-weight:700;">${FASTWORK_ID}</a></div>
      <div>Email: <a href="mailto:${CONTACT_EMAIL}" style="color:#a855f7;text-decoration:none;font-weight:700;">${CONTACT_EMAIL}</a></div>
    `;
    const copyRow = document.getElementById('v4-copy-brief-btn')?.parentElement;
    if (copyRow) copyRow.insertAdjacentElement('afterend', contactBar);
    else fwBtn.insertAdjacentElement('afterend', contactBar);
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
Catatan: ${notes}
Kontak Resmi: WA ${WHATSAPP_DISPLAY} | Fastwork ${FASTWORK_ID} | ${CONTACT_EMAIL}`;
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

  // PART 4: Full-Page Executive A4 Proposal Print Layout (Zero Blank Space)
  const pdfBtn = document.getElementById('v4-pdf-quote-btn');
  pdfBtn?.addEventListener('click', () => {
    sfx.playUiClick(740);
    const win = window.open('', '_blank');
    if (!win) return;

    const brand = (document.getElementById('client-brand') as HTMLInputElement | null)?.value.trim() || 'Calon Mitra / Klien Bisnis';
    const notes = (document.getElementById('client-notes') as HTMLTextAreaElement | null)?.value.trim() || 'Pengembangan sistem digital responsif & rekonstruksi aset visual HD siap produksi.';
    const totalPrice = document.getElementById('est-price')?.textContent?.trim() || 'Rp 0';
    const daysText = document.getElementById('est-days')?.textContent?.trim() || 'Sesuai Kesepakatan Modul';
    const isUsd = totalPrice.includes('$') || totalPrice.includes('USD');

    const checkedBoxes = Array.from(document.querySelectorAll<HTMLInputElement>('.est-check:checked'));
    const items = checkedBoxes.length > 0
      ? checkedBoxes.map((cb) => {
          const d = Number(cb.dataset.days || 2);
          const costNum = Number(isUsd ? cb.dataset.usd || 0 : cb.dataset.idr || 0);
          const costFmt = isUsd ? `$${costNum.toLocaleString('en-US')} USD` : `Rp ${costNum.toLocaleString('id-ID')}`;
          return { name: cb.value, days: `${d} Hari Kerja`, price: costFmt };
        })
      : [{ name: 'Konsultasi Arsitektur Web & Identitas Visual', days: '1–3 Hari Kerja', price: 'Custom Quote' }];

    const now = new Date();
    const docNum = `QT-ND-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const dateStr = now.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    const paletteClean = selectedPalette.split('(')[0].trim();

        const rowsHtml = items.map((it, idx) => {
      const isSub = it.name.trim().startsWith('↳');
      return `
      <tr>
        <td style="text-align:center;font-weight:700;color:#475569;">0${idx + 1}</td>
        <td>
          <div style="font-weight:${isSub ? '600' : '700'};color:#0f172a;">${it.name}</div>
          ${isSub ? '' : '<div style="font-size:9px;color:#64748b;margin-top:1px;">Arsitektur modular Mobile-First 60FPS, optimasi aset, dan integrasi siap deploy.</div>'}
        </td>
        <td style="text-align:center;font-weight:600;color:#334155;">${it.days}</td>
        <td style="text-align:right;font-weight:700;color:#0f172a;">${it.price}</td>
      </tr>
    `;
    }).join('');
    
 win.document.write(`<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>${docNum} — Penawaran Resmi Nans Dev</title>
    <style>
    @page { size: A4 portrait; margin: 7mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #e2e8f0;
      color: #0f172a;
      font-size: 11px;
      line-height: 1.38;
    }
    .sheet {
      width: 210mm;
      height: 282mm;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
    }
    @media print {
      body { background: #ffffff; }
      .sheet { width: 100%; height: 282mm; max-height: 282mm; border: none; margin: 0; }
    }
    .header-banner {
      background: linear-gradient(135deg, #060a14 0%, #0f172a 65%, #1e293b 100%);
      color: #f8fafc;
      padding: 14px 20px;
      border-bottom: 3.5px solid ${activeAcc1};
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand-block { display: flex; align-items: center; gap: 11px; }
    .brand-logo {
      width: 38px; height: 38px; border-radius: 9px;
      background: linear-gradient(135deg, ${activeAcc2}, ${activeAcc1});
      display: flex; align-items: center; justify-content: center;
      font-weight: 900; font-size: 17px; color: #05070c; letter-spacing: -0.5px;
    }
    .brand-title { font-size: 17.5px; font-weight: 900; letter-spacing: 0.8px; color: #ffffff; }
    .brand-sub { font-size: 10px; color: #94a3b8; margin-top: 1px; }
    .doc-meta { text-align: right; font-family: monospace; font-size: 10px; }
    .doc-badge {
      display: inline-block; background: rgba(52, 211, 153, 0.16); color: #34d399;
      border: 1px solid rgba(52, 211, 153, 0.45); padding: 2px 8px; border-radius: 999px;
      font-weight: 800; font-size: 9px; margin-bottom: 4px;
    }
    .body-wrap { padding: 12px 20px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; gap: 9px; }
    .info-grid { display: grid; grid-template-columns: 1.35fr 1fr; gap: 10px; }
    .card {
      border: 1px solid #cbd5e1; border-radius: 9px; padding: 9px 12px; background: #f8fafc;
    }
    .card-label {
      font-size: 9px; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase;
      color: #0284c7; margin-bottom: 4px;
    }
    .swatch-row { display: flex; align-items: center; gap: 7px; margin-top: 6px; }
    .swatch-box { width: 18px; height: 18px; border-radius: 5px; border: 1px solid rgba(15,23,42,0.2); }
    table { width: 100%; border-collapse: collapse; border: 1px solid #cbd5e1; border-radius: 9px; overflow: hidden; }
    thead th {
      background: #0f172a; color: #f8fafc; font-size: 9.5px; text-transform: uppercase;
      letter-spacing: 0.6px; padding: 7px 9px; text-align: left;
    }
    tbody td { padding: 6px 9px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
    tbody tr:nth-child(even) { background: #f8fafc; }
    tfoot td {
      background: #eff6ff; padding: 8px 10px; font-weight: 900; font-size: 12px;
      color: #0f172a; border-top: 2px solid #0284c7;
    }
    .section-head {
      font-size: 9.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px;
      color: #0f172a; border-left: 3px solid ${activeAcc1}; padding-left: 7px; margin-bottom: 6px;
    }
    .spec-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 7px; }
    .spec-item {
      border: 1px solid #cbd5e1; border-radius: 7px; padding: 7px 8px; background: #ffffff;
    }
    .spec-item strong { display: block; font-size: 10px; color: #0f172a; margin-bottom: 1px; }
    .spec-item span { font-size: 9px; color: #475569; line-height: 1.3; display: block; }
    .timeline-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 7px; }
    .step-box {
      background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 7px; padding: 7px 8px;
    }
    .step-num { font-family: monospace; font-weight: 900; font-size: 9.5px; color: #0284c7; }
    .step-title { font-weight: 800; font-size: 10px; color: #0f172a; margin: 1px 0; }
    .step-desc { font-size: 9px; color: #475569; line-height: 1.3; }
    .terms-box {
      background: #f8fafc; border: 1px dashed #94a3b8; border-radius: 8px; padding: 8px 12px;
      display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 9.5px; color: #334155;
    }
    .sign-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding-top: 2px;
    }
    .sign-card {
      border: 1px solid #cbd5e1; border-radius: 9px; padding: 8px 12px; background: #ffffff;
      display: flex; flex-direction: column; justify-content: space-between; min-height: 72px;
    }
    .stamp {
      display: inline-block; border: 1.5px solid #0284c7; color: #0284c7; font-family: monospace;
      font-weight: 900; font-size: 9px; padding: 2px 7px; border-radius: 5px; letter-spacing: 0.5px;
      background: rgba(2, 132, 199, 0.06); width: fit-content;
    }
    .footer-bar {
      background: #060a14; color: #cbd5e1; padding: 8px 20px; font-size: 9.5px;
      display: flex; justify-content: space-between; align-items: center;
      border-top: 3px solid ${activeAcc2};
    }
    .footer-bar strong { color: #38bdf8; }
  </style>
  
</head>
<body>
  <div class="sheet">
    <div>
      <header class="header-banner">
        <div class="brand-block">
          <div class="brand-logo">ND</div>
          <div>
            <div class="brand-title">NANS DEV ARCHITECTURE</div>
            <div class="brand-sub">Enterprise Web Systems · Interactive 3D · Precision Vector Identity</div>
          </div>
        </div>
        <div class="doc-meta">
          <div class="doc-badge">OFFICIAL QUOTATION</div>
          <div>No. Dokumen: <strong>${docNum}</strong></div>
          <div>Tanggal Terbit: ${dateStr}</div>
          <div>Validitas: 14 Hari Kalender</div>
        </div>
      </header>

      <div class="body-wrap">
        <div class="info-grid">
          <div class="card">
            <div class="card-label">Ditujukan Kepada / Profil Klien</div>
            <div style="font-size:14px;font-weight:900;color:#0f172a;margin-bottom:4px;">${brand}</div>
            <div style="font-size:10.5px;color:#334155;margin-bottom:4px;"><strong>Estimasi Waktu:</strong> ${daysText}</div>
            <div style="font-size:10px;color:#475569;"><strong>Brief & Catatan:</strong> ${notes}</div>
          </div>
          <div class="card">
            <div class="card-label">Konfigurasi Identitas Visual</div>
            <div style="font-weight:800;color:#0f172a;font-size:11.5px;">${paletteClean}</div>
            <div class="swatch-row">
              <div class="swatch-box" style="background:${activeAcc1};"></div>
              <div class="swatch-box" style="background:${activeAcc2};"></div>
              <div class="swatch-box" style="background:#0f172a;"></div>
              <span style="font-family:monospace;font-size:9.5px;color:#475569;">${activeAcc1} · ${activeAcc2}</span>
            </div>
            <div style="font-size:9.5px;color:#64748b;margin-top:7px;">Sistem warna adaptif siap mode Gelap & Terang dengan kontras aksesibilitas tinggi.</div>
          </div>
        </div>

        <div>
          <div class="section-head">Rincian Lingkup Pekerjaan & Estimasi Investasi</div>
          <table>
            <thead>
              <tr>
                <th style="width:42px;text-align:center;">No</th>
                <th>Modul Layanan & Deliverable</th>
                <th style="width:110px;text-align:center;">Durasi</th>
                <th style="width:130px;text-align:right;">Investasi</th>
              </tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
            <tfoot>
              <tr>
                <td colspan="2">TOTAL ESTIMASI INVESTASI PROYEK</td>
                <td style="text-align:center;font-size:11px;color:#0284c7;">${daysText.replace('Estimasi: ', '')}</td>
                <td style="text-align:right;font-size:14px;color:#0284c7;">${totalPrice}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div>
          <div class="section-head">Standar Arsitektur & Jaminan Kualitas Teknis</div>
          <div class="spec-grid">
            <div class="spec-item">
              <strong>⚡ 60FPS Mobile-First</strong>
              <span>Responsif presisi di seluruh layar smartphone & desktop tanpa lag.</span>
            </div>
            <div class="spec-item">
              <strong>🚀 Lighthouse 98+</strong>
              <span>Struktur kode bersih, SEO teknis siap indeks, dan muat sub-detik.</span>
            </div>
            <div class="spec-item">
              <strong>🛡️ SSL & Edge CDN</strong>
              <span>Proteksi HTTPS aktif, DDoS shield, dan deployment global 99.9% uptime.</span>
            </div>
            <div class="spec-item">
              <strong>📦 100% Hak Milik</strong>
              <span>Penyerahan penuh source code bersih & file master vektor (SVG/EPS/PNG).</span>
            </div>
          </div>
        </div>

        <div>
          <div class="section-head">Alur Eksekusi & Milestone Pengerjaan</div>
          <div class="timeline-grid">
            <div class="step-box">
              <div class="step-num">STEP 01</div>
              <div class="step-title">Kickoff & Blueprint</div>
              <div class="step-desc">Finalisasi brief, struktur halaman, dan konsep palet warna.</div>
            </div>
            <div class="step-box">
              <div class="step-num">STEP 02</div>
              <div class="step-title">Core Engineering</div>
              <div class="step-desc">Pengembangan kode sistem, kalkulator WA, & rekonstruksi vektor.</div>
            </div>
            <div class="step-box">
              <div class="step-num">STEP 03</div>
              <div class="step-title">QA & Revisi Klien</div>
              <div class="step-desc">Uji performa perangkat seluler serta penyempurnaan detail.</div>
            </div>
            <div class="step-box">
              <div class="step-num">STEP 04</div>
              <div class="step-title">Live Deploy & Serah</div>
              <div class="step-desc">Publikasi live domain/CDN beserta seluruh aset master proyek.</div>
            </div>
          </div>
        </div>

        <div class="terms-box">
          <div>
            <strong style="color:#0f172a;display:block;margin-bottom:3px;">Skema Pembayaran & Keamanan Transaksi:</strong>
            • Pembayaran langsung via Transfer (DP 50% mulai kerja, Pelunasan 50% sebelum serah terima final).<br/>
            • Tersedia opsi transaksi aman melalui rekening bersama <strong>Fastwork (${FASTWORK_ID})</strong>.
          </div>
          <div>
            <strong style="color:#0f172a;display:block;margin-bottom:3px;">Garansi & Dukungan Pasca-Rilis:</strong>
            • Termasuk revisi minor desain & tata letak sesuai ruang lingkup modul.<br/>
            • Gratis dukungan teknis & panduan pengelolaan setelah website live.
          </div>
        </div>

        <div class="sign-grid">
          <div class="sign-card">
            <div style="font-size:10px;color:#64748b;font-weight:700;">Persetujuan Klien / Pemesan,</div>
            <div style="border-top:1px solid #94a3b8;padding-top:5px;margin-top:34px;">
              <div style="font-weight:800;color:#0f172a;font-size:11px;">${brand}</div>
              <div style="font-size:9.5px;color:#64748b;">Tanda Tangan & Nama Terang</div>
            </div>
          </div>
          <div class="sign-card">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:10px;color:#64748b;font-weight:700;">Hormat Kami,</span>
              <span class="stamp">VERIFIED DIGITAL PROPOSAL</span>
            </div>
            <div style="border-top:1px solid #94a3b8;padding-top:5px;margin-top:24px;">
              <div style="font-weight:900;color:#0f172a;font-size:11px;">Nans Dev Architecture</div>
              <div style="font-size:9.5px;color:#0284c7;font-weight:700;">WA: ${WHATSAPP_DISPLAY} · Fastwork: ${FASTWORK_ID}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="footer-bar">
      <div><strong>WhatsApp:</strong> ${WHATSAPP_DISPLAY} &nbsp;|&nbsp; <strong>Fastwork:</strong> ${FASTWORK_ID}</div>
      <div><strong>Email:</strong> ${CONTACT_EMAIL}</div>
    </footer>
  </div>
  <script>window.onload = () => { setTimeout(() => window.print(), 250); };</script>
</body>
</html>`);
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
  const toggle = document.getElementById('menu-toggle');
  const links = document.getElementById('nav-links');
  if (!toggle || !links) return;

  const setOpen = (open: boolean) => {
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? '✕' : '☰';
  };

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    sfx.playUiClick(520);
    setOpen(!links.classList.contains('open'));
  });

  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('click', (e) => {
    const target = e.target as Node | null;
    if (links.classList.contains('open') && target && !links.contains(target) && !toggle.contains(target)) {
      setOpen(false);
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && links.classList.contains('open')) {
      setOpen(false);
    }
  });
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

function getProjectImages(p: ProjectItem): { desktop: string; mobile: string; url: string } {
  const t = p.title.toLowerCase();
  if (t.includes('laundrygod') || p.id === 'Laundry-God') {
    return {
      desktop: './images/laundrygod-desktop.jpg',
      mobile: './images/laundrygod-hp.jpg',
      url: 'laundry-kiloan.io',
    };
  }
  if (t.includes('klinpro') || t.includes('laundry')) {
    return {
      desktop: './images/klinpro-desktop.jpg',
      mobile: './images/klinpro-hp.jpg',
      url: 'klinpro-express.io',
    };
  }
  
  if (t.includes('tokobuk') || t.includes('toko')) {
    return {
      desktop: './images/tokobukyul-desktop.jpg',
      mobile: './images/tokobukyul-hp.jpg',
      url: 'tokobukyul.store',
    };
  }
  if (t.includes('bizsnap') || p.category === 'system') {
    return {
      desktop: './images/bizsnap-desktop.jpg',
      mobile: './images/bizsnap-hp.jpg',
      url: 'bizsnap.id/directory',
    };
  }
  return {
    desktop: './images/vector-desktop.jpg',
    mobile: './images/vector-hp.jpg',
    url: 'vector-hd.svg',
  };
}

function getProjectMockupHTML(p: ProjectItem): string {
  const media = getProjectImages(p);
  return `
    <div class="frame-top">
      <div class="dots"><span></span><span></span><span></span></div>
      <span class="frame-url">${media.url}</span>
    </div>
    <div class="ui-mock-body" style="padding:0 !important;margin:0;overflow:hidden;display:flex;flex:1;">
      <img
        src="${media.desktop}"
        data-desktop="${media.desktop}"
        data-mobile="${media.mobile}"
        alt="${p.title}"
        class="project-shot"
        style="width:100%;height:175px;object-fit:cover;object-position:top center;display:block;"
      />
    </div>
  `;
}

function renderProjects(projects: ProjectItem[], filter: string): void {
  const container = document.getElementById('projects-grid');
  if (!container) return;
  const filtered = filter === 'all' ? projects : projects.filter((p) => p.category === filter);
  container.innerHTML = filtered.map((p) => `
    <article class="project-card">
      <div>
        <div class="preview-stage">
          <div class="device-toggle">
            <button type="button" class="dev-btn active" data-mode="desktop">${SVG_ICONS.desktop}Desktop</button>
            <button type="button" class="dev-btn" data-mode="mobile">${SVG_ICONS.mobile}HP</button>
          </div>
          <div class="device-frame" style="overflow:hidden;display:flex;flex-direction:column;">${getProjectMockupHTML(p)}</div>
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
    const img = stage.querySelector<HTMLImageElement>('.project-shot');
    const btns = stage.querySelectorAll<HTMLButtonElement>('.dev-btn');
    if (!frame) return;

    btns.forEach((btn) => btn.addEventListener('click', () => {
      sfx.playUiClick(620);
      btns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const isMobile = btn.dataset.mode === 'mobile';
      frame.classList.toggle('mobile-mode', isMobile);
      if (img) {
        img.src = (isMobile ? img.dataset.mobile : img.dataset.desktop) || img.src;
        img.style.height = isMobile ? '230px' : '175px';
      }
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
  const parentCheckboxes = document.querySelectorAll<HTMLInputElement>('.est-parent-check');
  const currButtons = document.querySelectorAll<HTMLButtonElement>('.curr-btn');
  const priceDisplay = document.getElementById('est-price'), timeDisplay = document.getElementById('est-days');
  const brandInput = document.getElementById('client-brand') as HTMLInputElement | null;
  const notesInput = document.getElementById('client-notes') as HTMLTextAreaElement | null;
  const sendBtn = document.getElementById('est-wa-btn');
  if (!priceDisplay || !timeDisplay || !sendBtn) return;

  let activeCurrency: 'IDR' | 'USD' = 'IDR';
  const formatMoney = (amount: number, curr: 'IDR' | 'USD') =>
    curr === 'IDR' ? 'Rp ' + amount.toLocaleString('id-ID') : '$' + amount.toLocaleString('en-US') + ' USD';

  const syncDrawers = () => {
    parentCheckboxes.forEach((parentCb) => {
      const group = parentCb.closest<HTMLElement>('.est-group');
      if (!group) return;
      const isOpen = parentCb.checked;
      group.classList.toggle('open', isOpen);
      if (!isOpen) {
        group.querySelectorAll<HTMLInputElement>('.est-sub-check').forEach((sub) => {
          sub.checked = false;
        });
      }
    });
  };

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
    priceDisplay.textContent = totalCost > 0
      ? formatMoney(totalCost, activeCurrency)
      : (activeCurrency === 'IDR' ? 'Rp 0' : '$0 USD');
    timeDisplay.innerHTML = totalDays > 0
      ? (activeCurrency === 'IDR'
          ? `${SVG_ICONS.clock}Estimasi: ${totalDays} Hari Kerja`
          : `${SVG_ICONS.clock}Est. Delivery: ${totalDays} Business Days`)
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

    checkboxes.forEach((cb) => cb.addEventListener('change', () => {
    sfx.playUiClick(cb.checked ? 620 : 460);
    requestAnimationFrame(() => {
      if (cb.classList.contains('est-parent-check')) {
        syncDrawers();
      }
      calculate();
    });
  }));
  

  syncDrawers();
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

 mountNansSmartAssistant();
