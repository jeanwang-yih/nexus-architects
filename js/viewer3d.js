import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createProjectSceneObject } from './architectural-models.js';
import { PROJECTS } from './projects-data.js';

export class ArchitecturalViewer3D {
  constructor(canvas, stageEl, callbacks = {}) {
    this.canvas = canvas;
    this.stageEl = stageEl;
    this.callbacks = callbacks;

    this.currentProjectId = 'villa';
    this.viewMode = 'exterior'; // exterior | cutaway | plan | walk
    this.renderStyle = 'realistic'; // realistic | clay | blueprint
    this.sunHour = 16.5;
    this.autoRotate = false;

    this.activeModel = null;
    this.hotspotMeshes = [];
    this.interiorLights = [];

    // Smooth camera & cutaway animation states
    this.camAnim = null;
    this.cutawayTarget = 0;
    this.cutawayProgress = 0;

    // Walk mode movement state
    this.keysPressed = new Set();
    this.dpadMove = { forward: false, backward: false, left: false, right: false };
    this.clock = new THREE.Clock();

    this._initEngine();
    this._initLighting();
    this._initSharedStyleMaterials();
    this._bindEvents();
    this._animate();
  }

  _initEngine() {
    const width = this.stageEl.clientWidth || 800;
    const height = this.stageEl.clientHeight || 620;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xeee4d7);
    this.scene.fog = new THREE.FogExp2(0xeee4d7, 0.0085);

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.15, 220);
    this.camera.position.set(23, 15, 24);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.maxPolarAngle = Math.PI * 0.495;
    this.controls.minDistance = 2.0;
    this.controls.maxDistance = 68;
    this.controls.target.set(0, 3.2, 0);

    this.raycaster = new THREE.Raycaster();
    this.pointerDownPos = { x: 0, y: 0 };
  }

  _initLighting() {
    this.hemiLight = new THREE.HemisphereLight(0xfff5e4, 0x8d7b68, 0.72);
    this.scene.add(this.hemiLight);

    this.sunLight = new THREE.DirectionalLight(0xffdfad, 2.2);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 2;
    this.sunLight.shadow.camera.far = 90;
    const d = 22;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.sunLight.shadow.bias = -0.0005;
    this.scene.add(this.sunLight);

    this.fillLight = new THREE.DirectionalLight(0xcddcf0, 0.45);
    this.fillLight.position.set(-18, 12, -16);
    this.scene.add(this.fillLight);

    this.setSunHour(this.sunHour);
  }

  _initSharedStyleMaterials() {
    this.clayMat = new THREE.MeshStandardMaterial({
      color: 0xf4f0e8,
      roughness: 0.85,
      metalness: 0.02
    });
    this.clayGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xdde5e8,
      transparent: true,
      opacity: 0.25,
      roughness: 0.2,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    this.blueprintSolidMat = new THREE.MeshBasicMaterial({
      color: 0x162b44,
      transparent: true,
      opacity: 0.35,
      wireframe: true
    });
    this.blueprintLineMat = new THREE.MeshBasicMaterial({
      color: 0x7fd4ff,
      wireframe: true
    });
  }

  _bindEvents() {
    this.resizeObserver = new ResizeObserver(() => this._handleResize());
    this.resizeObserver.observe(this.stageEl);

    this.canvas.addEventListener('pointerdown', (e) => {
      this.pointerDownPos = { x: e.clientX, y: e.clientY };
    });

    this.canvas.addEventListener('pointerup', (e) => {
      const dx = e.clientX - this.pointerDownPos.x;
      const dy = e.clientY - this.pointerDownPos.y;
      if (Math.hypot(dx, dy) < 5) {
        this._handleCanvasClick(e);
      }
    });

    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        if (this.viewMode === 'walk') {
          e.preventDefault();
          this.keysPressed.add(key);
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keysPressed.delete(e.key.toLowerCase());
    });
  }

  _handleResize() {
    const w = this.stageEl.clientWidth;
    const h = this.stageEl.clientHeight;
    if (!w || !h) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }

  _handleCanvasClick(event) {
    if (!this.hotspotMeshes.length) return;
    const rect = this.canvas.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );
    this.raycaster.setFromCamera(mouse, this.camera);
    const hits = this.raycaster.intersectObjects(this.hotspotMeshes, true);
    if (hits.length > 0) {
      let obj = hits[0].object;
      while (obj && !obj.userData.hotspotId) {
        obj = obj.parent;
      }
      if (obj?.userData.hotspotId) {
        this.focusHotspot(obj.userData.hotspotId);
      }
    }
  }

  loadProject(projectId, options = {}) {
    this.currentProjectId = projectId;
    const project = PROJECTS[projectId];
    if (!project) return;

    if (this.activeModel) {
      this.scene.remove(this.activeModel.root);
    }
    this.hotspotMeshes = [];

    this.activeModel = createProjectSceneObject(projectId);
    this.interiorLights = this.activeModel.interiorLights || [];
    this.scene.add(this.activeModel.root);

    // Add 3D interactive hotspot pins inside rooms
    project.hotspots.forEach((hs) => {
      const pin = new THREE.Group();
      pin.position.set(...hs.markerPos);
      pin.userData.hotspotId = hs.id;

      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.24, 0.34, 24),
        new THREE.MeshBasicMaterial({ color: 0xb88e23, side: THREE.DoubleSide })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = -0.5;
      ring.userData.hotspotId = hs.id;
      pin.add(ring);

      const orb = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 16, 16),
        new THREE.MeshStandardMaterial({
          color: 0xc93b2b,
          emissive: 0xb88e23,
          emissiveIntensity: 0.45,
          roughness: 0.25
        })
      );
      orb.userData.hotspotId = hs.id;
      pin.add(orb);

      this.activeModel.root.add(pin);
      this.hotspotMeshes.push(pin);
    });

    this.applyRenderStyle(this.renderStyle);
    this.setSunHour(this.sunHour);
    this.setViewMode('exterior', { immediate: options.immediate });
  }

  setViewMode(mode, options = {}) {
    const project = PROJECTS[this.currentProjectId];
    if (!project) return;
    this.viewMode = mode;

    // Configure cutaway lift
    this.cutawayTarget = mode === 'cutaway' || mode === 'plan' ? 1 : 0;
    if (options.immediate) {
      this.cutawayProgress = this.cutawayTarget;
      this._applyCutawayTransform();
    }

    // Configure OrbitControls for exterior vs interior walk
    if (mode === 'walk') {
      this.autoRotate = false;
      this.controls.enablePan = false;
      this.controls.minDistance = 0.05;
      this.controls.maxDistance = 0.25;
      this.controls.maxPolarAngle = Math.PI * 0.78;
      this.controls.minPolarAngle = Math.PI * 0.22;

      const firstSpot = project.hotspots[1] || project.hotspots[0];
      if (firstSpot) {
        this._flyInsideSpot(firstSpot, options.immediate);
        this.callbacks.onHotspotSelect?.(firstSpot);
      }
    } else {
      this.controls.enablePan = true;
      this.controls.minDistance = 2.0;
      this.controls.maxDistance = 68;
      this.controls.maxPolarAngle = Math.PI * 0.495;
      this.controls.minPolarAngle = 0.08;

      const preset =
        mode === 'cutaway'
          ? project.cutawayCamera
          : mode === 'plan'
            ? project.planCamera
            : project.exteriorCamera;

      this._animateCameraTo(preset.pos, preset.target, options.immediate);
      this.callbacks.onHotspotSelect?.(null);
    }

    this.callbacks.onViewModeChange?.(mode);
  }

  focusHotspot(hotspotId) {
    const project = PROJECTS[this.currentProjectId];
    const spot = project?.hotspots.find((h) => h.id === hotspotId);
    if (!spot) return;

    this.viewMode = 'walk';
    this.autoRotate = false;
    this.cutawayTarget = 0; // Restore roof when standing inside so ceiling & skylights look realistic!
    this.controls.enablePan = false;
    this.controls.minDistance = 0.05;
    this.controls.maxDistance = 0.25;
    this.controls.maxPolarAngle = Math.PI * 0.78;
    this.controls.minPolarAngle = Math.PI * 0.22;

    this._flyInsideSpot(spot, false);
    this.callbacks.onViewModeChange?.('walk');
    this.callbacks.onHotspotSelect?.(spot);
  }

  _flyInsideSpot(spot, immediate = false) {
    const camPos = new THREE.Vector3(...spot.camPos);
    const lookTarget = new THREE.Vector3(...spot.lookAt);
    const dir = new THREE.Vector3().subVectors(lookTarget, camPos).normalize();
    const orbitTarget = camPos.clone().addScaledVector(dir, 0.15);
    this._animateCameraTo(camPos.toArray(), orbitTarget.toArray(), immediate);
  }

  _animateCameraTo(posArr, targetArr, immediate = false) {
    const endPos = new THREE.Vector3(...posArr);
    const endTarget = new THREE.Vector3(...targetArr);

    if (immediate) {
      this.camera.position.copy(endPos);
      this.controls.target.copy(endTarget);
      this.controls.update();
      this.camAnim = null;
      return;
    }

    this.camAnim = {
      startPos: this.camera.position.clone(),
      startTarget: this.controls.target.clone(),
      endPos,
      endTarget,
      progress: 0,
      duration: 0.85
    };
  }

  setAutoRotate(enabled) {
    if (this.viewMode === 'walk') return;
    this.autoRotate = enabled;
    this.controls.autoRotate = enabled;
    this.controls.autoRotateSpeed = 1.25;
  }

  setWalkDirection(dir, active) {
    this.dpadMove[dir] = active;
  }

  setSunHour(hour) {
    this.sunHour = hour;
    // Map 6..20 to sun arc across sky; 20..22 is evening twilight/night
    const dayRatio = THREE.MathUtils.clamp((hour - 6) / 13, 0, 1);
    const elevation = Math.sin(dayRatio * Math.PI); // 0 at dawn/dusk, 1 at noon
    const azimuth = THREE.MathUtils.lerp(-Math.PI * 0.42, Math.PI * 0.45, dayRatio);

    const radius = 34;
    const sunY = Math.max(2.5, elevation * 28);
    const sunX = Math.sin(azimuth) * radius;
    const sunZ = Math.cos(azimuth) * 20;
    this.sunLight.position.set(sunX, sunY, sunZ);

    // Night factor: ramps up after 18:00
    const nightFactor = THREE.MathUtils.clamp((hour - 17.5) / 3.0, 0, 1);

    // Sky & fog colors
    const dawnColor = new THREE.Color(0xf2d9c2);
    const noonColor = new THREE.Color(0xebe7df);
    const goldenColor = new THREE.Color(0xe8d0b3);
    const nightColor = new THREE.Color(0x1f242d);

    let skyColor;
    if (hour < 11) {
      skyColor = dawnColor.clone().lerp(noonColor, THREE.MathUtils.clamp((hour - 6) / 5, 0, 1));
    } else if (hour < 17.5) {
      skyColor = noonColor.clone().lerp(goldenColor, THREE.MathUtils.clamp((hour - 13) / 4.5, 0, 1));
    } else {
      skyColor = goldenColor.clone().lerp(nightColor, nightFactor);
    }

    if (this.renderStyle === 'blueprint') {
      this.scene.background.setHex(0x0f1e30);
      this.scene.fog.color.setHex(0x0f1e30);
    } else {
      this.scene.background.copy(skyColor);
      this.scene.fog.color.copy(skyColor);
    }

    // Sun & hemisphere intensities
    this.sunLight.intensity = THREE.MathUtils.lerp(0.25, 2.35, (1 - nightFactor) * (0.45 + 0.55 * elevation));
    this.sunLight.color.setHSL(
      THREE.MathUtils.lerp(0.08, 0.11, elevation),
      THREE.MathUtils.lerp(0.72, 0.25, elevation),
      THREE.MathUtils.lerp(0.68, 0.94, elevation)
    );
    this.hemiLight.intensity = THREE.MathUtils.lerp(0.28, 0.78, 1 - nightFactor);

    // Turn up warm interior architectural lights at dusk/night
    const indoorIntensity = THREE.MathUtils.lerp(0.45, 2.2, nightFactor);
    this.interiorLights.forEach((pt) => {
      pt.intensity = indoorIntensity;
    });
  }

  applyRenderStyle(style) {
    this.renderStyle = style;
    if (!this.activeModel) return;

    this.activeModel.root.traverse((obj) => {
      if (!obj.isMesh || obj.userData.hotspotId) return;
      const orig = obj.userData.originalMaterial;
      if (!orig) return;

      if (style === 'realistic') {
        obj.material = orig;
      } else if (style === 'clay') {
        obj.material = orig.transparent ? this.clayGlassMat : this.clayMat;
      } else if (style === 'blueprint') {
        obj.material = orig.transparent ? this.blueprintSolidMat : this.blueprintLineMat;
      }
    });

    this.setSunHour(this.sunHour);
  }

  _applyCutawayTransform() {
    if (!this.activeModel?.cutawayGroup) return;
    const g = this.activeModel.cutawayGroup;
    g.position.y = this.cutawayProgress * 12;
    g.visible = this.cutawayProgress < 0.92;
  }

  _updateWalkMovement(dt) {
    if (this.viewMode !== 'walk') return;

    const moveForward =
      (this.keysPressed.has('w') || this.keysPressed.has('arrowup') || this.dpadMove.forward ? 1 : 0) -
      (this.keysPressed.has('s') || this.keysPressed.has('arrowdown') || this.dpadMove.backward ? 1 : 0);
    const moveRight =
      (this.keysPressed.has('d') || this.keysPressed.has('arrowright') || this.dpadMove.right ? 1 : 0) -
      (this.keysPressed.has('a') || this.keysPressed.has('arrowleft') || this.dpadMove.left ? 1 : 0);

    if (moveForward === 0 && moveRight === 0) return;

    const forward = new THREE.Vector3();
    this.camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
    const speed = 5.2 * dt;

    const delta = new THREE.Vector3()
      .addScaledVector(forward, moveForward * speed)
      .addScaledVector(right, moveRight * speed);

    const bounds = PROJECTS[this.currentProjectId].walkBounds;
    const nextX = THREE.MathUtils.clamp(this.camera.position.x + delta.x, bounds.minX, bounds.maxX);
    const nextZ = THREE.MathUtils.clamp(this.camera.position.z + delta.z, bounds.minZ, bounds.maxZ);

    const actualDx = nextX - this.camera.position.x;
    const actualDz = nextZ - this.camera.position.z;

    this.camera.position.x = nextX;
    this.camera.position.z = nextZ;
    this.controls.target.x += actualDx;
    this.controls.target.z += actualDz;
  }

  _animate = () => {
    requestAnimationFrame(this._animate);
    const dt = Math.min(this.clock.getDelta(), 0.05);

    // Animate camera transitions
    if (this.camAnim) {
      this.camAnim.progress += dt / this.camAnim.duration;
      const t = Math.min(this.camAnim.progress, 1);
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      this.camera.position.lerpVectors(this.camAnim.startPos, this.camAnim.endPos, ease);
      this.controls.target.lerpVectors(this.camAnim.startTarget, this.camAnim.endTarget, ease);

      if (t >= 1) {
        this.camAnim = null;
      }
    }

    // Smoothly lift/lower cutaway roof
    if (Math.abs(this.cutawayTarget - this.cutawayProgress) > 0.005) {
      this.cutawayProgress = THREE.MathUtils.lerp(this.cutawayProgress, this.cutawayTarget, dt * 6);
      this._applyCutawayTransform();
    }

    // Pulse hotspot spheres subtly
    const time = this.clock.elapsedTime;
    this.hotspotMeshes.forEach((pin, idx) => {
      pin.visible = this.viewMode !== 'plan';
      const orb = pin.children[1];
      if (orb) {
        orb.position.y = Math.sin(time * 2.4 + idx) * 0.08;
      }
    });

    this._updateWalkMovement(dt);
    this.controls.autoRotate = this.autoRotate && this.viewMode !== 'walk' && !this.camAnim;
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };
}
