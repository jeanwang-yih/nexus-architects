import * as THREE from 'three';

/**
 * Generates crisp procedural CanvasTextures for architectural surfaces
 * (travertine stone, warm oak planks, exposed concrete, red brick, fabric rug).
 */
function createMaterialLibrary() {
  const makeTexture = (width, height, drawFn, repeatX = 2, repeatY = 2) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    drawFn(ctx, width, height);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  };

  const travertineTex = makeTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#dfd4c1';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 60; i++) {
      const y = (i / 60) * h;
      ctx.fillStyle = i % 2 === 0 ? 'rgba(182, 165, 138, 0.25)' : 'rgba(248, 243, 234, 0.28)';
      ctx.fillRect(0, y, w, 2 + (i % 3));
    }
    ctx.strokeStyle = 'rgba(120, 104, 82, 0.14)';
    ctx.lineWidth = 1;
    for (let y = 0; y < h; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  }, 3, 2);

  const oakTex = makeTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#9c7751';
    ctx.fillRect(0, 0, w, h);
    const plankH = 32;
    for (let y = 0; y < h; y += plankH) {
      const shade = ((y / plankH) % 3) * 8 - 8;
      ctx.fillStyle = `rgb(${156 + shade}, ${119 + shade}, ${81 + shade})`;
      ctx.fillRect(0, y, w, plankH - 1);
      ctx.fillStyle = 'rgba(72, 48, 28, 0.18)';
      ctx.fillRect(0, y + plankH - 1, w, 1);
      for (let g = 0; g < 6; g++) {
        ctx.fillStyle = 'rgba(84, 56, 34, 0.08)';
        ctx.fillRect(0, y + 4 + g * 4, w, 1);
      }
    }
  }, 4, 4);

  const concreteTex = makeTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#9d9890';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 450; i++) {
      const x = (i * 53) % w;
      const y = (i * 97) % h;
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.06)' : 'rgba(40,36,32,0.06)';
      ctx.fillRect(x, y, 4, 4);
    }
    ctx.strokeStyle = 'rgba(65, 60, 56, 0.22)';
    ctx.lineWidth = 1;
    for (let y = 0; y < h; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  }, 3, 2);

  const brickTex = makeTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#c4bab0'; // mortar
    ctx.fillRect(0, 0, w, h);
    const rowH = 16;
    const brickW = 42;
    const palette = ['#964b3b', '#873f31', '#a45745', '#7e3a2d'];
    for (let row = 0; row < h / rowH; row++) {
      const offset = (row % 2) * (brickW / 2);
      for (let col = -1; col < w / brickW + 1; col++) {
        ctx.fillStyle = palette[(row * 7 + col * 3 + 10) % palette.length];
        ctx.fillRect(col * brickW + offset + 1, row * rowH + 1, brickW - 2, rowH - 2);
      }
    }
  }, 4, 3);

  return {
    travertine: new THREE.MeshStandardMaterial({ map: travertineTex, roughness: 0.72, metalness: 0.04 }),
    plaster: new THREE.MeshStandardMaterial({ color: 0xf4efe6, roughness: 0.85, metalness: 0.02 }),
    plasterWarm: new THREE.MeshStandardMaterial({ color: 0xe7dccb, roughness: 0.82, metalness: 0.02 }),
    oak: new THREE.MeshStandardMaterial({ map: oakTex, roughness: 0.58, metalness: 0.05 }),
    walnut: new THREE.MeshStandardMaterial({ color: 0x563c28, roughness: 0.52, metalness: 0.06 }),
    concrete: new THREE.MeshStandardMaterial({ map: concreteTex, roughness: 0.8, metalness: 0.05 }),
    brick: new THREE.MeshStandardMaterial({ map: brickTex, roughness: 0.86, metalness: 0.02 }),
    darkSteel: new THREE.MeshStandardMaterial({ color: 0x2b2826, roughness: 0.42, metalness: 0.65 }),
    brass: new THREE.MeshStandardMaterial({ color: 0xb88e23, roughness: 0.32, metalness: 0.82 }),
    fabricCream: new THREE.MeshStandardMaterial({ color: 0xebe3d5, roughness: 0.92 }),
    fabricTaupe: new THREE.MeshStandardMaterial({ color: 0x8f8375, roughness: 0.92 }),
    terracotta: new THREE.MeshStandardMaterial({ color: 0xc26a4a, roughness: 0.78 }),
    foliage: new THREE.MeshStandardMaterial({ color: 0x6f7f56, roughness: 0.85 }),
    foliageOlive: new THREE.MeshStandardMaterial({ color: 0x828f6a, roughness: 0.84 }),
    groundSand: new THREE.MeshStandardMaterial({ color: 0xe5dac8, roughness: 0.96 }),
    stonePath: new THREE.MeshStandardMaterial({ color: 0xcfc4b2, roughness: 0.86 }),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0xdff0f5,
      transparent: true,
      opacity: 0.28,
      roughness: 0.08,
      metalness: 0.1,
      reflectivity: 0.85,
      side: THREE.DoubleSide,
      depthWrite: false
    }),
    water: new THREE.MeshPhysicalMaterial({
      color: 0x4b747a,
      roughness: 0.06,
      metalness: 0.15,
      transparent: true,
      opacity: 0.86
    }),
    emissiveWarm: new THREE.MeshStandardMaterial({
      color: 0xfff0cc,
      emissive: 0xffb85c,
      emissiveIntensity: 1.35,
      roughness: 0.3
    })
  };
}

function addBox(parent, w, h, d, x, y, z, material, castShadow = true, receiveShadow = true) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = castShadow;
  mesh.receiveShadow = receiveShadow;
  parent.add(mesh);
  return mesh;
}

function addWindowWall(parent, w, h, x, y, z, rotY, frameMat, glassMat) {
  const group = new THREE.Group();
  group.position.set(x, y, z);
  group.rotation.y = rotY;

  // Glass pane
  const pane = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.12, h - 0.12), glassMat);
  pane.renderOrder = 2;
  group.add(pane);

  // Perimeter mullions
  const t = 0.08;
  addBox(group, w, t, t, 0, h / 2 - t / 2, 0, frameMat);
  addBox(group, w, t, t, 0, -h / 2 + t / 2, 0, frameMat);
  addBox(group, t, h, t, -w / 2 + t / 2, 0, 0, frameMat);
  addBox(group, t, h, t, w / 2 - t / 2, 0, 0, frameMat);

  const panels = Math.max(2, Math.round(w / 2.2));
  for (let i = 1; i < panels; i++) {
    const mx = -w / 2 + (w / panels) * i;
    addBox(group, 0.05, h, 0.07, mx, 0, 0, frameMat);
  }
  parent.add(group);
  return group;
}

function addOliveTree(parent, x, y, z, scale, mats) {
  const tree = new THREE.Group();
  tree.position.set(x, y, z);
  tree.scale.setScalar(scale);

  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.18, 2.2, 8), mats.walnut);
  trunk.position.y = 1.1;
  trunk.castShadow = true;
  tree.add(trunk);

  const puffs = [
    [0, 2.5, 0, 1.05],
    [-0.65, 2.25, 0.35, 0.72],
    [0.65, 2.35, -0.3, 0.78],
    [0.1, 2.95, 0.25, 0.68]
  ];
  puffs.forEach(([px, py, pz, r], idx) => {
    const crown = new THREE.Mesh(
      new THREE.IcosahedronGeometry(r, 1),
      idx % 2 === 0 ? mats.foliageOlive : mats.foliage
    );
    crown.position.set(px, py, pz);
    crown.castShadow = true;
    crown.receiveShadow = true;
    tree.add(crown);
  });

  parent.add(tree);
}

function addSofa(parent, x, y, z, rotY, mats, width = 3.2) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = rotY;
  addBox(g, width, 0.22, 0.95, 0, 0.22, 0, mats.oak);
  addBox(g, width - 0.12, 0.22, 0.88, 0, 0.42, 0.03, mats.fabricCream);
  addBox(g, width - 0.08, 0.52, 0.2, 0, 0.62, -0.36, mats.fabricCream);
  addBox(g, 0.2, 0.42, 0.92, -width / 2 + 0.1, 0.52, 0, mats.fabricCream);
  addBox(g, 0.2, 0.42, 0.92, width / 2 - 0.1, 0.52, 0, mats.fabricCream);
  parent.add(g);
}

function addDiningSet(parent, x, y, z, mats) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  addBox(g, 2.8, 0.09, 1.15, 0, 0.76, 0, mats.oak);
  addBox(g, 0.12, 0.72, 0.85, -1.05, 0.36, 0, mats.darkSteel);
  addBox(g, 0.12, 0.72, 0.85, 1.05, 0.36, 0, mats.darkSteel);
  [-0.85, 0, 0.85].forEach((cx) => {
    [-0.78, 0.78].forEach((cz) => {
      const chair = new THREE.Group();
      chair.position.set(cx, 0, cz);
      addBox(chair, 0.44, 0.05, 0.44, 0, 0.45, 0, mats.walnut);
      addBox(chair, 0.44, 0.42, 0.05, 0, 0.67, cz > 0 ? 0.2 : -0.2, mats.walnut);
      addBox(chair, 0.38, 0.44, 0.38, 0, 0.22, 0, mats.darkSteel);
      g.add(chair);
    });
  });
  parent.add(g);
}

function addPendantLight(parent, x, topY, dropLen, mats, lightList) {
  const g = new THREE.Group();
  g.position.set(x, topY, 0);
  addBox(g, 0.025, dropLen, 0.025, 0, -dropLen / 2, 0, mats.darkSteel, false);
  const shade = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.24, 16), mats.brass);
  shade.position.y = -dropLen;
  g.add(shade);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), mats.emissiveWarm);
  bulb.position.y = -dropLen - 0.08;
  g.add(bulb);

  const pt = new THREE.PointLight(0xffcb80, 0.8, 12, 1.6);
  pt.position.set(0, -dropLen - 0.2, 0);
  g.add(pt);
  lightList.push(pt);

  parent.add(g);
  return g;
}

function addStaircase(parent, x, y, z, steps, stepH, stepD, width, dirZ, mats) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  for (let i = 0; i < steps; i++) {
    addBox(
      g,
      width,
      stepH * 0.6,
      stepD,
      0,
      stepH * (i + 0.5),
      dirZ * stepD * i,
      mats.oak
    );
  }
  parent.add(g);
}

function createSiteBase(parent, sizeX, sizeZ, mats) {
  const terrain = new THREE.Mesh(new THREE.BoxGeometry(sizeX, 0.6, sizeZ), mats.groundSand);
  terrain.position.y = -0.35;
  terrain.receiveShadow = true;
  parent.add(terrain);

  // Subtle architectural grid lines around the site
  const grid = new THREE.GridHelper(sizeX, 24, 0xb8a892, 0xd8cbb8);
  grid.position.y = -0.04;
  grid.material.opacity = 0.38;
  grid.material.transparent = true;
  parent.add(grid);
}

/**
 * 1. Hillside Courtyard Villa (建築設計與規劃)
 */
function buildVilla(mats) {
  const root = new THREE.Group();
  const cutawayGroup = new THREE.Group(); // Lifts / hides in cutaway mode
  const interiorLights = [];

  createSiteBase(root, 44, 40, mats);

  // Plinth & Courtyard Deck
  addBox(root, 24, 0.3, 18.5, 0, 0.15, 0, mats.travertine, false, true);
  // 1F Interior Warm Oak Floor
  addBox(root, 20.6, 0.06, 10.6, 0, 0.33, -2.5, mats.oak, false, true);

  // Reflecting Pool in Front Courtyard
  addBox(root, 12, 0.14, 4.4, -1.5, 0.24, 5.8, mats.darkSteel, false, true);
  const water = new THREE.Mesh(new THREE.PlaneGeometry(11.6, 4.0), mats.water);
  water.rotation.x = -Math.PI / 2;
  water.position.set(-1.5, 0.33, 5.8);
  root.add(water);
  // Stepping stones across water
  [2.5, 4.0, 5.5].forEach((sx) => {
    addBox(root, 1.1, 0.12, 1.4, sx - 2.5, 0.32, 5.8, mats.stonePath);
  });

  // Olive Trees & Terracotta Planter
  addOliveTree(root, -9.2, 0, 6.2, 1.1, mats);
  addOliveTree(root, 8.8, 0, 5.6, 0.95, mats);
  addOliveTree(root, -11.4, 0, -4.5, 1.25, mats);
  const planter = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.3, 0.68, 16), mats.terracotta);
  planter.position.set(5.4, 0.64, 5.5);
  planter.castShadow = true;
  root.add(planter);

  // 1F Exterior Structural Walls (North Back Wall + East/West Side Walls with Openings)
  addBox(root, 21.0, 3.6, 0.35, 0, 2.1, -7.8, mats.travertine); // Back North Wall
  addBox(root, 0.35, 3.6, 11.0, -10.32, 2.1, -2.4, mats.plaster); // West Wall
  addBox(root, 0.35, 3.6, 4.5, 10.32, 2.1, -5.6, mats.plaster); // East Wall partial

  // 1F Front South Floor-to-Ceiling Glazing
  addWindowWall(root, 13.6, 3.55, -3.2, 2.1, 2.9, 0, mats.darkSteel, mats.glass);
  addWindowWall(root, 6.2, 3.55, 7.1, 2.1, 2.9, 0, mats.darkSteel, mats.glass);
  addWindowWall(root, 6.2, 3.55, 10.32, 2.1, -0.2, Math.PI / 2, mats.darkSteel, mats.glass);

  // Exterior Timber Louver Screen
  for (let i = 0; i < 11; i++) {
    addBox(root, 0.08, 3.6, 0.28, 3.9 + i * 0.55, 2.1, 3.15, mats.walnut);
  }

  // --- 1F INTERIOR FURNISHINGS ---
  // Feature Travertine Fireplace Wall
  addBox(root, 3.6, 6.6, 0.65, -2.4, 3.6, -7.2, mats.travertine);
  addBox(root, 1.6, 0.75, 0.4, -2.4, 0.72, -6.75, mats.darkSteel); // Hearth
  const fireGlow = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.25, 0.12), mats.emissiveWarm);
  fireGlow.position.set(-2.4, 0.88, -6.72);
  root.add(fireGlow);

  // Living Room Rug, L-Sofa & Coffee Table
  addBox(root, 5.2, 0.03, 3.8, -2.4, 0.37, -1.6, mats.fabricTaupe, false, true);
  addSofa(root, -2.4, 0.36, -3.4, 0, mats, 3.4);
  addSofa(root, -4.9, 0.36, -1.4, Math.PI / 2, mats, 2.6);
  addBox(root, 1.5, 0.34, 0.9, -2.2, 0.54, -1.5, mats.walnut);

  // Kitchen Island & Cabinets (East Side)
  addBox(root, 4.6, 2.7, 0.7, 6.2, 1.7, -7.2, mats.walnut);
  addBox(root, 3.8, 0.95, 1.15, 5.8, 0.83, -4.6, mats.travertine);
  // Dining Table & Chairs
  addDiningSet(root, 5.8, 0.36, -1.3, mats);

  // Feature Staircase to 2F Mezzanine
  addStaircase(root, -8.8, 0.36, -5.8, 12, 0.28, 0.34, 1.35, 1, mats);

  // --- 2F SLAB & MEZZANINE STUDIO (Open to Double-Height Living on East/South) ---
  // 2F Floor Slab (West wing & North bridge)
  addBox(root, 10.2, 0.28, 10.6, -5.2, 3.75, -2.5, mats.plaster);
  addBox(root, 10.4, 0.28, 4.4, 5.1, 3.75, -5.6, mats.plaster);
  // 2F Cantilevered East Terrace
  addBox(root, 6.2, 0.26, 6.2, 6.6, 3.75, 1.4, mats.oak);
  // Glass Balustrade overlooking Double-Height Living
  addWindowWall(root, 10.2, 1.05, 0.0, 4.4, -2.5, Math.PI / 2, mats.darkSteel, mats.glass);
  addWindowWall(root, 6.0, 1.05, 6.6, 4.4, 4.45, 0, mats.darkSteel, mats.glass);

  // 2F Studio Desk, Bookshelf & Lounge Chair
  addBox(root, 2.4, 0.08, 0.95, -5.2, 4.65, -4.6, mats.oak);
  addBox(root, 0.1, 0.72, 0.85, -6.2, 4.26, -4.6, mats.darkSteel);
  addBox(root, 0.1, 0.72, 0.85, -4.2, 4.26, -4.6, mats.darkSteel);
  addBox(root, 3.6, 2.4, 0.42, -5.5, 5.1, -7.3, mats.walnut); // Bookshelf

  // Interior Warm Lights
  const p1 = addPendantLight(root, -2.4, 6.7, 2.4, mats, interiorLights);
  p1.position.z = -1.5;
  const p2 = addPendantLight(root, 5.8, 3.6, 1.2, mats, interiorLights);
  p2.position.z = -1.3;
  const pt2f = new THREE.PointLight(0xffcf88, 0.75, 11, 1.6);
  pt2f.position.set(-5.2, 6.1, -2.5);
  root.add(pt2f);
  interiorLights.push(pt2f);

  // --- CUTAWAY GROUP (Upper Envelope & Roof Slabs that lift away in Cutaway Mode) ---
  // 2F Upper Walls & Clerestory Glazing
  addBox(cutawayGroup, 21.0, 3.3, 0.35, 0, 5.55, -7.8, mats.travertine);
  addBox(cutawayGroup, 0.35, 3.3, 11.0, -10.32, 5.55, -2.4, mats.plasterWarm);
  addWindowWall(cutawayGroup, 10.2, 3.25, -5.2, 5.55, 2.9, 0, mats.darkSteel, mats.glass);
  addWindowWall(cutawayGroup, 10.4, 3.25, 5.1, 5.55, -3.4, 0, mats.darkSteel, mats.glass);
  // Roof Cantilevered Slabs
  addBox(cutawayGroup, 22.8, 0.38, 12.8, 0, 7.35, -2.0, mats.plaster);
  addBox(cutawayGroup, 22.8, 0.12, 1.6, 0, 7.12, 5.1, mats.oak); // Overhang soffit
  // 1F East Dining Roof Pergola
  for (let i = 0; i < 8; i++) {
    addBox(cutawayGroup, 6.0, 0.18, 0.14, 6.6, 7.1, -2.8 + i * 0.95, mats.walnut);
  }

  root.add(cutawayGroup);
  return { root, cutawayGroup, interiorLights };
}

/**
 * 2. Atrium Loft & Tea Salon (室內與空間設計)
 */
function buildAtelier(mats) {
  const root = new THREE.Group();
  const cutawayGroup = new THREE.Group();
  const interiorLights = [];

  createSiteBase(root, 36, 32, mats);

  // Base Floor Slab
  addBox(root, 18.4, 0.35, 14.8, 0, 0.175, 0, mats.concrete, false, true);
  addBox(root, 17.6, 0.05, 14.0, 0, 0.38, 0, mats.oak, false, true);

  // Exterior Perimeter (Lower height on front/right so cutaway & exterior feel tactile)
  addBox(root, 18.0, 6.2, 0.32, 0, 3.45, -7.2, mats.concrete); // Back Concrete Feature Wall
  addBox(root, 0.32, 6.2, 14.4, -9.0, 3.45, 0, mats.plasterWarm); // West Wall
  addWindowWall(root, 17.8, 6.1, 0, 3.45, 7.2, 0, mats.darkSteel, mats.glass); // South Full Glazing
  addWindowWall(root, 14.2, 6.1, 9.0, 3.45, 0, Math.PI / 2, mats.darkSteel, mats.glass); // East Full Glazing

  // Curved / Sculpted Entry Screen Wall
  addBox(root, 0.28, 3.4, 5.2, -5.2, 2.1, 3.4, mats.travertine);
  // Pedestal Sculpture at Entry
  addBox(root, 0.75, 1.1, 0.75, -6.8, 0.95, 1.5, mats.travertine);
  const sculpture = new THREE.Mesh(new THREE.TorusKnotGeometry(0.24, 0.07, 48, 8), mats.brass);
  sculpture.position.set(-6.8, 1.82, 1.5);
  sculpture.castShadow = true;
  root.add(sculpture);

  // Sunken Tea Lounge Platform (Center-West)
  addBox(root, 7.4, 0.24, 6.2, -0.6, 0.48, 1.5, mats.travertine);
  addBox(root, 5.6, 0.04, 4.6, -0.6, 0.61, 1.5, mats.fabricTaupe, false, true);
  addSofa(root, -0.6, 0.62, -0.1, 0, mats, 3.6);
  addSofa(root, -2.9, 0.62, 1.6, Math.PI / 2, mats, 2.5);
  addBox(root, 1.8, 0.28, 1.1, -0.5, 0.76, 1.7, mats.walnut); // Low Tea Table

  // Sculpted Travertine Tea Bar (East)
  addBox(root, 4.4, 0.98, 1.1, 4.4, 0.89, -2.4, mats.travertine);
  addBox(root, 5.2, 2.8, 0.55, 4.6, 1.8, -6.6, mats.walnut); // Back Bar Shelving
  [3.0, 4.0, 5.0, 6.0].forEach((bx) => {
    const stool = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.16, 0.68, 12), mats.walnut);
    stool.position.set(bx, 0.74, -1.35);
    stool.castShadow = true;
    root.add(stool);
  });

  // Floating Oak Staircase & 2F Loft Mezzanine
  addStaircase(root, -7.5, 0.4, -5.5, 11, 0.3, 0.36, 1.3, 1, mats);
  addBox(root, 11.4, 0.24, 6.4, 2.8, 3.65, -3.8, mats.oak);
  // Slatted Timber Privacy Screen on Loft
  for (let i = 0; i < 18; i++) {
    addBox(root, 0.06, 2.6, 0.16, -2.5 + i * 0.45, 5.05, -0.7, mats.walnut);
  }
  // Loft Platform Bed & Side Tables
  addBox(root, 2.4, 0.34, 2.6, 4.2, 3.94, -4.4, mats.walnut);
  addBox(root, 2.2, 0.26, 2.1, 4.2, 4.24, -4.2, mats.fabricCream);

  // Exterior Olive Tree outside glass
  addOliveTree(root, 11.6, 0, 5.2, 1.05, mats);
  addOliveTree(root, -11.2, 0, 6.0, 0.9, mats);

  // Interior Warm Lights
  const pBar = addPendantLight(root, 4.4, 3.55, 1.1, mats, interiorLights);
  pBar.position.z = -2.4;
  const pLounge = addPendantLight(root, -0.5, 6.4, 2.8, mats, interiorLights);
  pLounge.position.z = 1.6;
  const ptLoft = new THREE.PointLight(0xffcb80, 0.75, 10, 1.6);
  ptLoft.position.set(4.0, 5.8, -4.0);
  root.add(ptLoft);
  interiorLights.push(ptLoft);

  // Cutaway Roof with Clerestory Skylight
  addBox(cutawayGroup, 19.6, 0.32, 5.2, 0, 6.72, -4.8, mats.plaster);
  addBox(cutawayGroup, 19.6, 0.32, 5.2, 0, 6.72, 4.8, mats.plaster);
  addBox(cutawayGroup, 4.6, 0.32, 4.8, -7.5, 6.72, 0, mats.plaster);
  addBox(cutawayGroup, 4.6, 0.32, 4.8, 7.5, 6.72, 0, mats.plaster);
  // Central Skylight Glass
  const skylight = new THREE.Mesh(new THREE.PlaneGeometry(10.4, 4.4), mats.glass);
  skylight.rotation.x = Math.PI / 2;
  skylight.position.set(0, 6.82, 0);
  cutawayGroup.add(skylight);

  root.add(cutawayGroup);
  return { root, cutawayGroup, interiorLights };
}

/**
 * 3. Heritage Brick & Timber Renewal (老屋改造與都市更新)
 */
function buildHeritage(mats) {
  const root = new THREE.Group();
  const cutawayGroup = new THREE.Group();
  const interiorLights = [];

  createSiteBase(root, 46, 38, mats);

  // Plaza Paving & Main Floor
  addBox(root, 26, 0.24, 20, 0, 0.12, 1.5, mats.stonePath, false, true);
  addBox(root, 22.4, 0.08, 12.6, 0, 0.28, -1.0, mats.concrete, false, true);

  // Heritage Brick Perimeter Walls (North, West, East, and South Pier Columns)
  addBox(root, 22.8, 4.6, 0.42, 0, 2.55, -7.4, mats.brick);
  addBox(root, 0.42, 4.6, 13.0, -11.2, 2.55, -1.0, mats.brick);
  addBox(root, 0.42, 4.6, 13.0, 11.2, 2.55, -1.0, mats.brick);

  // South Heritage Brick Piers + Modern Glass Inserts
  [-9.2, -4.6, 4.6, 9.2].forEach((px) => {
    addBox(root, 1.6, 4.6, 0.44, px, 2.55, 5.4, mats.brick);
  });
  addWindowWall(root, 6.8, 4.5, 0, 2.55, 5.4, 0, mats.darkSteel, mats.glass);
  addWindowWall(root, 2.9, 4.5, -6.9, 2.55, 5.4, 0, mats.darkSteel, mats.glass);
  addWindowWall(root, 2.9, 4.5, 6.9, 2.55, 5.4, 0, mats.darkSteel, mats.glass);

  // Contemporary Steel Canopy over Entry Plaza
  addBox(root, 8.6, 0.16, 2.8, 0, 3.8, 6.8, mats.darkSteel);

  // Interior Café & Exhibition Space
  // Café Counter (West-Center)
  addBox(root, 4.8, 1.0, 1.0, -4.2, 0.82, -2.5, mats.oak);
  addBox(root, 4.8, 0.08, 1.15, -4.2, 1.35, -2.5, mats.travertine);
  // Community Long Table in Skylight Atrium
  addDiningSet(root, -0.8, 0.32, 1.5, mats);
  // Exhibition Plinths (East Hall)
  [
    [5.2, -2.2],
    [7.8, -2.2],
    [6.5, 1.6]
  ].forEach(([ex, ez]) => {
    addBox(root, 1.2, 0.95, 1.2, ex, 0.79, ez, mats.plaster);
    const modelMiniature = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.38, 0.45), mats.travertine);
    modelMiniature.position.set(ex, 1.46, ez);
    modelMiniature.castShadow = true;
    root.add(modelMiniature);
  });

  // Steel Staircase to 2F Glass Skybox
  addStaircase(root, -9.6, 0.32, -5.6, 12, 0.3, 0.35, 1.3, 1, mats);

  // 2F Inserted Steel & Glass Skybox Mezzanine
  addBox(root, 10.6, 0.24, 7.2, -1.8, 3.9, -1.6, mats.darkSteel);
  addBox(root, 10.2, 0.06, 6.8, -1.8, 4.05, -1.6, mats.oak);
  // Skybox Bookcases & Reading Table
  addBox(root, 4.2, 2.1, 0.45, -1.8, 5.1, -4.7, mats.walnut);
  addBox(root, 3.0, 0.76, 1.0, -1.8, 4.46, -1.2, mats.oak);

  // Urban Plaza Trees
  addOliveTree(root, -10.5, 0, 9.2, 1.15, mats);
  addOliveTree(root, 10.5, 0, 9.2, 1.05, mats);

  // Interior Warm Lights
  const pAtrium = addPendantLight(root, -0.8, 6.8, 3.2, mats, interiorLights);
  pAtrium.position.z = 1.5;
  const pGallery = addPendantLight(root, 6.5, 5.2, 1.8, mats, interiorLights);
  pGallery.position.z = -0.5;
  const ptSky = new THREE.PointLight(0xffcb80, 0.85, 12, 1.6);
  ptSky.position.set(-1.8, 6.4, -1.6);
  root.add(ptSky);
  interiorLights.push(ptSky);

  // Cutaway Group: Pitched Timber Roof Trusses, Roof Planes & Skybox Top
  for (let i = 0; i < 6; i++) {
    const tx = -10 + i * 4.0;
    addBox(cutawayGroup, 0.2, 0.24, 13.2, tx, 4.9, -1.0, mats.walnut);
    const leftRafter = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.22, 7.2), mats.walnut);
    leftRafter.position.set(tx, 6.1, -4.2);
    leftRafter.rotation.x = 0.36;
    cutawayGroup.add(leftRafter);
    const rightRafter = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.22, 7.2), mats.walnut);
    rightRafter.position.set(tx, 6.1, 2.2);
    rightRafter.rotation.x = -0.36;
    cutawayGroup.add(rightRafter);
  }
  // Pitched Roof Panels (with central Skylight gap)
  const northRoof = new THREE.Mesh(new THREE.BoxGeometry(23.2, 0.18, 6.8), mats.darkSteel);
  northRoof.position.set(0, 6.35, -4.3);
  northRoof.rotation.x = 0.36;
  northRoof.castShadow = true;
  cutawayGroup.add(northRoof);

  const southRoof = new THREE.Mesh(new THREE.BoxGeometry(23.2, 0.18, 6.8), mats.darkSteel);
  southRoof.position.set(0, 6.35, 2.3);
  southRoof.rotation.x = -0.36;
  southRoof.castShadow = true;
  cutawayGroup.add(southRoof);

  // Skybox Upper Glass Box
  addWindowWall(cutawayGroup, 10.4, 2.8, -1.8, 5.45, 1.9, 0, mats.darkSteel, mats.glass);
  addBox(cutawayGroup, 10.8, 0.22, 7.4, -1.8, 6.95, -1.6, mats.darkSteel);

  root.add(cutawayGroup);
  return { root, cutawayGroup, interiorLights };
}

export function createProjectSceneObject(projectId) {
  const mats = createMaterialLibrary();
  let built;
  if (projectId === 'atelier') {
    built = buildAtelier(mats);
  } else if (projectId === 'heritage') {
    built = buildHeritage(mats);
  } else {
    built = buildVilla(mats);
  }

  // Save original materials for style toggling (realistic / clay / blueprint)
  built.root.traverse((obj) => {
    if (obj.isMesh) {
      obj.userData.originalMaterial = obj.material;
    }
  });

  return built;
}
