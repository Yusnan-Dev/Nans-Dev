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

const WHATSAPP_NUMBER = '6281234567890'; // Ganti nomor WA lu (diawali 62)

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

/* Photorealistic 3D Earth + Full-Viewport 3D Rocket Launch Overlay */
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

  const earthGeo = new THREE.SphereGeometry(1, 64, 64);
  const earthMat = new THREE.MeshPhongMaterial({
    map: earthMap,
    bumpMap: bumpMap,
    bumpScale: 0.035,
    specularMap: specularMap,
    specular: new THREE.Color('#38bdf8'),
    shininess: 18,
  });
  earthGroup.add(new THREE.Mesh(earthGeo, earthMat));

  const atmoGeo = new THREE.SphereGeometry(1.06, 64, 64);
  const atmoMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#38bdf8'),
    transparent: true,
    opacity: 0.14,
    side: THREE.BackSide,
  });
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
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }

  const hubs = [
    { lat: -7.25, lon: 112.75 }, // Index 0: Indonesia Launchpad
    { lat: -6.2, lon: 106.8 },
    { lat: 1.35, lon: 103.8 },
    { lat: 35.68, lon: 139.69 },
    { lat: 25.2, lon: 55.27 },
    { lat: 51.5, lon: -0.12 },
    { lat: 40.71, lon: -74.0 },
    { lat: -33.86, lon: 151.2 },
    { lat: -23.55, lon: -46.63 }
  ];

  const beaconGeo = new THREE.SphereGeometry(0.016, 12, 12);
  let indonesiaBeacon: any = null;

  hubs.forEach((h, i) => {
    const pos = latLonToVector3(h.lat, h.lon, 1.008);
    const beaconMat = new THREE.MeshBasicMaterial({
      color: i <= 1 ? 0x34d399 : 0x38bdf8,
    });
    const dot = new THREE.Mesh(beaconGeo, beaconMat);
    dot.position.copy(pos);
    earthGroup.add(dot);
    if (i === 0) indonesiaBeacon = dot;
  });

  // Launchpad Shockwave Ring on Earth Surface
  const shockGeo = new THREE.RingGeometry(0.015, 0.032, 32);
  const shockMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0,
  });
  const shockRing = new THREE.Mesh(shockGeo, shockMat);
  if (indonesiaBeacon) {
    shockRing.position.copy(indonesiaBeacon.position).multiplyScalar(1.01);
    shockRing.lookAt(
      indonesiaBeacon.position.clone().multiplyScalar(2)
    );
  }
  earthGroup.add(shockRing);

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

  /* =====================================================================
     FULL-VIEWPORT 3D ROCKET OVERLAY (Launches out of Earth past top of phone)
     ===================================================================== */
  const overlayCanvas = document.createElement('canvas');
  overlayCanvas.style.position = 'fixed';
  overlayCanvas.style.inset = '0';
  overlayCanvas.style.width = '100vw';
  overlayCanvas.style.height = '100vh';
  overlayCanvas.style.pointerEvents = 'none';
  overlayCanvas.style.zIndex = '9999';
  document.body.appendChild(overlayCanvas);

  const ovScene = new THREE.Scene();
  const ovCamera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  ovCamera.position.set(0, 0, 10);

  const ovRenderer = new THREE.WebGLRenderer({
    canvas: overlayCanvas,
    antialias: true,
    alpha: true,
  });
  ovRenderer.setSize(window.innerWidth, window.innerHeight);
  ovRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  ovScene.add(new THREE.AmbientLight(0xffffff, 1.1));
  const ovKeyLight = new THREE.DirectionalLight(0x38bdf8, 2.2);
  ovKeyLight.position.set(5, 8, 8);
  ovScene.add(ovKeyLight);

  const ovWarmLight = new THREE.DirectionalLight(0xffedd5, 1.5);
  ovWarmLight.position.set(-4, -3, 6);
  ovScene.add(ovWarmLight);

  // Build Detailed 3D Spacecraft / Rocket Mesh
  const rocketGroup = new THREE.Group();
  rocketGroup.visible = false;
  ovScene.add(rocketGroup);

  // Main Fuselage Body
  const bodyGeo = new THREE.CylinderGeometry(0.14, 0.17, 0.95, 24);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    metalness: 0.65,
    roughness: 0.2,
  });
  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
  rocketGroup.add(bodyMesh);

  // Sleek Nose Cone
  const noseGeo = new THREE.ConeGeometry(0.14, 0.42, 24);
  const noseMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    metalness: 0.5,
    roughness: 0.25,
    emissive: 0x0284c7,
    emissiveIntensity: 0.35,
  });
  const noseMesh = new THREE.Mesh(noseGeo, noseMat);
  noseMesh.position.y = 0.685;
  rocketGroup.add(noseMesh);

  // Cockpit Viewport Ring
  const glassGeo = new THREE.SphereGeometry(0.065, 16, 16);
  const glassMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee });
  const glassMesh = new THREE.Mesh(glassGeo, glassMat);
  glassMesh.position.set(0, 0.22, 0.12);
  rocketGroup.add(glassMesh);

  // 4 Aerodynamic Delta Fins
  const finGeo = new THREE.BoxGeometry(0.03, 0.34, 0.22);
  const finMat = new THREE.MeshStandardMaterial({
    color: 0x818cf8,
    metalness: 0.6,
    roughness: 0.3,
  });
  for (let i = 0; i < 4; i++) {
    const fin = new THREE.Mesh(finGeo, finMat);
    const angle = (i * Math.PI) / 2;
    fin.position.set(Math.sin(angle) * 0.18, -0.32, Math.cos(angle) * 0.18);
    fin.rotation.y = angle;
    rocketGroup.add(fin);
  }

  // Thruster Exhaust Plume (Outer Cyan + Inner White-Orange Core)
  const flameOuterGeo = new THREE.ConeGeometry(0.15, 0.85, 20);
  const flameOuterMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.85,
  });
  const flameOuter = new THREE.Mesh(flameOuterGeo, flameOuterMat);
  flameOuter.rotation.x = Math.PI;
  flameOuter.position.y = -0.88;
  rocketGroup.add(flameOuter);

  const flameCoreGeo = new THREE.ConeGeometry(0.08, 0.52, 16);
  const flameCoreMat = new THREE.MeshBasicMaterial({
    color: 0xfef08a,
  });
  const flameCore = new THREE.Mesh(flameCoreGeo, flameCoreMat);
  flameCore.rotation.x = Math.PI;
  flameCore.position.y = -0.72;
  rocketGroup.add(flameCore);

  // Exhaust Smoke / Spark Particle Pool
  interface ExhaustParticle {
    mesh: any;
    vel: any;
    life: number;
  }
  const particles: ExhaustParticle[] = [];
  const pGeo = new THREE.SphereGeometry(0.055, 8, 8);

  function spawnExhaustParticle(origin: any): void {
    const pMat = new THREE.MeshBasicMaterial({
      color: Math.random() > 0.35 ? 0x38bdf8 : 0xfb923c,
      transparent: true,
      opacity: 0.9,
    });
    const mesh = new THREE.Mesh(pGeo, pMat);
    mesh.position.copy(origin);
    mesh.position.x += (Math.random() - 0.5) * 0.12;
    mesh.position.y += (Math.random() - 0.5) * 0.12;
    ovScene.add(mesh);

    particles.push({
      mesh,
      vel: new THREE.Vector3(
        (Math.random() - 0.5) * 0.03,
        -0.06 - Math.random() * 0.04,
        -0.05
      ),
      life: 1.0,
    });
  }

  // Rocket Launch State Machine
  let rocketActive = false;
  let launchProgress = 0;
  let startWorldPos = new THREE.Vector3(0, -1, 0);
  let midControlPos = new THREE.Vector3(0.4, 2.2, 4.5);
  let endWorldPos = new THREE.Vector3(-0.3, 6.8, 7.6);
  const stageBox = container.closest('.hero-3d-stage') as HTMLElement | null;

  function screenToOverlayWorld(screenX: number, screenY: number, targetZ: number) {
    const ndcX = (screenX / window.innerWidth) * 2 - 1;
    const ndcY = -(screenY / window.innerHeight) * 2 + 1;
    const vec = new THREE.Vector3(ndcX, ndcY, 0.5);
    vec.unproject(ovCamera);
    const dir = vec.sub(ovCamera.position).normalize();
    const distance = (targetZ - ovCamera.position.z) / dir.z;
    return ovCamera.position.clone().add(dir.multiplyScalar(distance));
  }

  function triggerRocketLaunch(): void {
    if (rocketActive) return;

    // Project Indonesia hub position on Earth canvas onto screen coordinates
    const rect = renderer.domElement.getBoundingClientRect();
    let launchScreenX = rect.left + rect.width * 0.52;
    let launchScreenY = rect.top + rect.height * 0.54;

    if (indonesiaBeacon) {
      earthGroup.updateMatrixWorld(true);
      const worldPos = new THREE.Vector3();
      indonesiaBeacon.getWorldPosition(worldPos);
      // Only use exact beacon screen coords if facing front of globe
      if (worldPos.z > -0.2) {
        const projected = worldPos.clone().project(camera);
        launchScreenX = rect.left + ((projected.x + 1) * 0.5) * rect.width;
        launchScreenY = rect.top + ((-projected.y + 1) * 0.5) * rect.height;
      }
    }

    // Start small & distant at Earth surface (z = 1.5), sweep up & close past top of phone (z = 7.8)
    startWorldPos = screenToOverlayWorld(launchScreenX, launchScreenY, 1.5);
    const topTargetX = window.innerWidth * (0.35 + Math.random() * 0.3);
    endWorldPos = screenToOverlayWorld(topTargetX, -140, 7.8);

    midControlPos = new THREE.Vector3(
      (startWorldPos.x + endWorldPos.x) * 0.5 + (Math.random() - 0.5) * 1.4,
      (startWorldPos.y + endWorldPos.y) * 0.48,
      5.2
    );

    rocketActive = true;
    launchProgress = 0;
    rocketGroup.visible = true;
    rocketGroup.position.copy(startWorldPos);
    rocketGroup.scale.setScalar(0.16);

    // Trigger launchpad shockwave on Earth
    shockMat.opacity = 0.95;
    shockRing.scale.setScalar(1);
  }

  // First launch 2.5s after page load, then automatically every 12 seconds
  setTimeout(triggerRocketLaunch, 2500);
  setInterval(triggerRocketLaunch, 12000);

  // Free-Spin Flick Physics
  let prevX = 0;
  let prevY = 0;
  let isTouching = false;
  let velY = 0.004;
  let velX = 0;
  const cruiseSpeed = 0.004;

  const domElem = renderer.domElement;
  domElem.style.touchAction = 'none';

  domElem.addEventListener('pointerdown', (e: PointerEvent) => {
    isTouching = true;
    prevX = e.clientX;
    prevY = e.clientY;
  });

  window.addEventListener('pointerup', () => {
    isTouching = false;
  });

  domElem.addEventListener('pointermove', (e: PointerEvent) => {
    if (!isTouching) return;
    const dx = e.clientX - prevX;
    const dy = e.clientY - prevY;
    prevX = e.clientX;
    prevY = e.clientY;

    velY = THREE.MathUtils.clamp(dx * 0.014, -0.35, 0.35);
    velX = THREE.MathUtils.clamp(dy * 0.006, -0.15, 0.15);
  });

  window.addEventListener('resize', () => {
    if (container) {
      const w = container.offsetWidth || 320;
      const h = container.offsetHeight || 340;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    ovCamera.aspect = window.innerWidth / window.innerHeight;
    ovCamera.updateProjectionMatrix();
    ovRenderer.setSize(window.innerWidth, window.innerHeight);
  });

  function animate(): void {
    requestAnimationFrame(animate);

    earthGroup.rotation.y += velY;
    earthGroup.rotation.x = THREE.MathUtils.clamp(
      earthGroup.rotation.x + velX,
      -0.65,
      0.65
    );

    velY *= 0.985;
    velX *= 0.94;

    if (Math.abs(velY) < cruiseSpeed) {
      const dir = velY >= 0 ? cruiseSpeed : -cruiseSpeed;
      velY += (dir - velY) * 0.04;
    }

    // Animate Shockwave Ring on Earth
    if (shockMat.opacity > 0.01) {
      shockRing.scale.addScalar(0.18);
      shockMat.opacity *= 0.92;
    }

    // Animate Flying Laser Beams
    laserArcs.forEach((arc) => {
      arc.progress += arc.speed;
      if (arc.progress > 1.45) arc.progress = -0.15;

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

    // Animate 3D Rocket Trajectory (Small/Distant at Earth -> Close/Fast past Top of Phone)
    if (rocketActive) {
      // Accelerating ease-in curve so it lifts off smoothly then blasts past top edge
      launchProgress += 0.0145;
      const t = Math.min(1, launchProgress);
      const ease = t * t * (2.2 - 1.2 * t);

      // Quadratic Bezier interpolation
      const invT = 1 - ease;
      const pos = new THREE.Vector3()
        .addScaledVector(startWorldPos, invT * invT)
        .addScaledVector(midControlPos, 2 * invT * ease)
        .addScaledVector(endWorldPos, ease * ease);

      // Compute forward tangent so nose points along flight arc
      const nextEase = Math.min(1, ease + 0.02);
      const invNext = 1 - nextEase;
      const nextPos = new THREE.Vector3()
        .addScaledVector(startWorldPos, invNext * invNext)
        .addScaledVector(midControlPos, 2 * invNext * nextEase)
        .addScaledVector(endWorldPos, nextEase * nextEase);

      const tangent = nextPos.sub(pos).normalize();
      if (tangent.lengthSq() > 0.0001) {
        const upAxis = new THREE.Vector3(0, 1, 0);
        rocketGroup.quaternion.setFromUnitVectors(upAxis, tangent);
      }

      rocketGroup.position.copy(pos);
      rocketGroup.rotateY(t * 6); // Subtle aerodynamic roll

      // Scale grows from distant 0.16 at Earth to close-up 1.15 near top of phone
      const currentScale = 0.16 + ease * 0.98;
      rocketGroup.scale.setScalar(currentScale);

      // Flickering thruster flame
      const flicker = 0.85 + Math.random() * 0.45;
      flameOuter.scale.set(1, flicker, 1);
      flameCore.scale.set(1, flicker * 1.1, 1);

      // Micro camera-shake on Earth stage during early ignition
      if (stageBox && t < 0.35) {
        const shake = (0.35 - t) * 7;
        stageBox.style.transform = `translate(${(Math.random() - 0.5) * shake}px, ${(Math.random() - 0.5) * shake}px)`;
      } else if (stageBox && stageBox.style.transform) {
        stageBox.style.transform = '';
      }

      // Spawn glowing exhaust trail particles
      if (Math.random() > 0.25) {
        const nozzlePos = pos.clone().addScaledVector(tangent, -0.45 * currentScale);
        spawnExhaustParticle(nozzlePos);
      }

      if (launchProgress >= 1.05) {
        rocketActive = false;
        rocketGroup.visible = false;
        if (stageBox) stageBox.style.transform = '';
      }
    }

    // Update & fade exhaust particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.mesh.position.add(p.vel);
      p.life -= 0.032;
      p.mesh.scale.setScalar(Math.max(0.01, p.life));
      p.mesh.material.opacity = Math.max(0, p.life * 0.85);

      if (p.life <= 0) {
        ovScene.remove(p.mesh);
        p.mesh.geometry.dispose();
        p.mesh.material.dispose();
        particles.splice(i, 1);
      }
    }

    renderer.render(scene, camera);
    ovRenderer.render(ovScene, ovCamera);
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

/* Animated Rolling Number Counter & Progress Gauge */
function renderMetrics(metrics: MetricItem[]): void {
  const container = document.getElementById('metrics-strip');
  if (!container) return;

  const statusLabels = ['TELEMETRY // OPTIMAL', 'LATENCY // VERIFIED', 'GEOMETRY // LOCKED'];
  const fillTargets = ['99.9%', '92%', '100%'];

  container.innerHTML = metrics
    .map(
      (m, idx) => `
      <div class="metric-box">
        <div class="metric-status">
          <span class="live-dot"></span> ${statusLabels[idx % statusLabels.length]}
        </div>
        <div class="val" data-target="${m.value}">${m.value}</div>
        <div class="lbl">${m.label}</div>
        <div class="metric-bar-track">
          <div class="metric-bar-fill" data-fill="${fillTargets[idx % fillTargets.length]}"></div>
        </div>
      </div>`
    )
    .join('');

  let hasAnimated = false;

  const triggerAnimation = () => {
    if (hasAnimated) return;
    hasAnimated = true;

    const valEls = container.querySelectorAll<HTMLElement>('.val');
    const barEls = container.querySelectorAll<HTMLElement>('.metric-bar-fill');

    barEls.forEach((bar) => {
      bar.style.width = bar.dataset.fill || '100%';
    });

    valEls.forEach((el) => {
      const raw = el.dataset.target || '';
      const match = raw.match(/^([^\d.-]*)([\d.]+)(.*)$/);
      if (!match) return;

      const prefix = match[1];
      const targetNum = parseFloat(match[2]);
      const suffix = match[3];
      const decimals = (match[2].split('.')[1] || '').length;
      const isCountdown = prefix.includes('<');
      const startNum = isCountdown ? 3.8 : 0;

      const duration = 1600;
      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = Math.min(1, (now - startTime) / duration);
        const ease = 1 - Math.pow(1 - elapsed, 4);
        const current = startNum + (targetNum - startNum) * ease;
        el.textContent = `${prefix}${current.toFixed(decimals)}${suffix}`;

        if (elapsed < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = raw;
        }
      };

      requestAnimationFrame(step);
    });
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          triggerAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(container);
  } else {
    triggerAnimation();
  }
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
