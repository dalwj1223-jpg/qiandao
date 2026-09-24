import { Platform, Monster, Projectile, Particle, StarBackground } from '../types';

/**
 * Summer Water Park & Beach Theme World Renderer
 * Inspired by Image 1: Bright sunshine, sparkling pool water, glossy crystal floats,
 * bubbles, tropical vibes, and dangerous red trap blocks.
 */

// Draw Fresh Cucumber & Gingham Plaid Map (Frame 2117907135 Image 1 Theme)
export function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  cameraY: number,
  dewDrops: StarBackground[],
  timeMs: number
) {
  ctx.save();

  // 1. Warm Sunny Pastel Lime & Cream Tablecloth Gradient (Image 1 Palette)
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#EAF5CE'); // Sun-drenched warm chartreuse top
  bgGrad.addColorStop(0.2, '#F1F8D9');
  bgGrad.addColorStop(0.5, '#F8FCEF'); // Crisp clean cream center
  bgGrad.addColorStop(0.85, '#EFF7DB');
  bgGrad.addColorStop(1, '#E6F3CE'); // Fresh pastel lime bottom
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Gingham Checkered Plaid Pattern (Image 1 authentic green/white tablecloth)
  ctx.save();
  const gridStep = 44;
  // Parallax scroll on vertical axis as player climbs
  const scrollY = (cameraY * 0.3) % gridStep;

  // Vertical plaid stripes
  ctx.fillStyle = 'rgba(180, 224, 130, 0.28)';
  for (let x = 0; x < width; x += gridStep * 2) {
    ctx.fillRect(x, 0, gridStep, height);
  }

  // Horizontal plaid stripes (intersections naturally blend darker, creating the gingham check!)
  for (let y = scrollY - gridStep; y < height + gridStep; y += gridStep * 2) {
    ctx.fillRect(0, y, width, gridStep);
  }

  // Intersections tactile shadow feel
  ctx.fillStyle = 'rgba(146, 198, 92, 0.12)';
  for (let x = 0; x < width; x += gridStep * 2) {
    for (let y = scrollY - gridStep; y < height + gridStep; y += gridStep * 2) {
      ctx.fillRect(x, y, gridStep, gridStep);
    }
  }
  ctx.restore();

  // 3. Ambient Top Sunlight Glow (Image 1 top right sunbeam atmosphere)
  ctx.save();
  const sunGrad = ctx.createRadialGradient(width * 0.85, 40, 10, width * 0.85, 40, 260);
  sunGrad.addColorStop(0, 'rgba(235, 252, 185, 0.45)');
  sunGrad.addColorStop(0.6, 'rgba(235, 252, 185, 0.15)');
  sunGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = sunGrad;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // 4. Floating Ambient Dew Drops & Sun Motes
  dewDrops.forEach((d) => {
    const dy = (d.y - cameraY * 0.25 - (timeMs * 0.02)) % height;
    const finalY = dy < 0 ? dy + height : dy;
    const dx = d.x + Math.sin(timeMs * 0.0015 + d.y) * 6;
    drawDewMote(ctx, dx, finalY, d.size * 1.8, d.alpha);
  });

  // 5. Top-Right Sliced Fresh Cucumber Wheel with Sunny Glow (Image 1)
  drawTopRightCucumberSlice(ctx, width, timeMs);

  // 6. Bottom-Left Giant Sliced Cucumber & Fresh Coriander Leaves (Image 1)
  drawBottomLeftCucumberAndLeaves(ctx, height, timeMs);

  ctx.restore();
}

/**
 * 🥒 Top-Right Sliced Fresh Cucumber Round (Image 1)
 */
function drawTopRightCucumberSlice(
  ctx: CanvasRenderingContext2D,
  width: number,
  timeMs: number
) {
  ctx.save();
  const cx = width - 12;
  const cy = 25;
  const outerR = 68;
  const rindThickness = 6;
  const pithThickness = 5;
  const pulpR = outerR - rindThickness - pithThickness;

  ctx.translate(cx, cy);
  const subtleSway = Math.sin(timeMs * 0.001) * 1.2;
  ctx.rotate(0.1 + subtleSway * 0.008);

  // Soft Sunny Glow behind slice
  ctx.beginPath();
  ctx.arc(0, 0, outerR + 14, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(215, 245, 145, 0.45)';
  ctx.fill();

  // Dark Green Bumpy Cucumber Rind
  ctx.beginPath();
  ctx.arc(0, 0, outerR, 0, Math.PI * 2);
  const rindGrad = ctx.createRadialGradient(0, 0, outerR - rindThickness, 0, 0, outerR);
  rindGrad.addColorStop(0, '#3A8A24');
  rindGrad.addColorStop(0.7, '#2A6B18');
  rindGrad.addColorStop(1, '#1A4D0E');
  ctx.fillStyle = rindGrad;
  ctx.fill();

  // Outer rim subtle bumps
  ctx.fillStyle = '#5CB53C';
  for (let a = 0; a < Math.PI * 2; a += 0.35) {
    const bx = Math.cos(a) * (outerR - 1.5);
    const by = Math.sin(a) * (outerR - 1.5);
    ctx.beginPath();
    ctx.arc(bx, by, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Crisp Light Green/White Pith Layer
  ctx.beginPath();
  ctx.arc(0, 0, outerR - rindThickness, 0, Math.PI * 2);
  ctx.fillStyle = '#E9F9D2';
  ctx.fill();

  // Juicy Watery Cucumber Pulp
  ctx.beginPath();
  ctx.arc(0, 0, pulpR, 0, Math.PI * 2);
  const pulpGrad = ctx.createRadialGradient(0, 0, 8, 0, 0, pulpR);
  pulpGrad.addColorStop(0, '#E8F7CE');
  pulpGrad.addColorStop(0.5, '#DEF2BF');
  pulpGrad.addColorStop(1, '#CAE8A2');
  ctx.fillStyle = pulpGrad;
  ctx.fill();

  // Radial Water Vesicles & Seed Ring
  const numSeeds = 10;
  const seedRingR = pulpR * 0.58;
  for (let i = 0; i < numSeeds; i++) {
    const angle = (i * Math.PI * 2) / numSeeds;
    const sx = Math.cos(angle) * seedRingR;
    const sy = Math.sin(angle) * seedRingR;

    ctx.beginPath();
    ctx.ellipse(sx, sy, 5.5, 3.2, angle + Math.PI / 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(244, 253, 225, 0.85)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(175, 218, 125, 0.6)';
    ctx.lineWidth = 0.6;
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(sx, sy, 3.2, 1.5, angle + Math.PI / 2, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFEE3';
    ctx.fill();
  }

  // Center core
  ctx.beginPath();
  ctx.arc(0, 0, 7, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(235, 248, 205, 0.9)';
  ctx.fill();

  ctx.restore();
}

/**
 * 🥒 & 🌿 Bottom-Left Giant Sliced Cucumber & Fresh Coriander Leaves (Image 1)
 */
function drawBottomLeftCucumberAndLeaves(
  ctx: CanvasRenderingContext2D,
  height: number,
  timeMs: number
) {
  ctx.save();
  const cx = -15;
  const cy = height - 15;
  const outerR = 100;
  const rindThickness = 8;
  const pithThickness = 6;
  const pulpR = outerR - rindThickness - pithThickness;

  // 1. Fresh Green Foliage/Leaves behind and above cucumber slice
  drawCorianderLeaves(ctx, 45, height - 95, timeMs);

  // 2. Large Cucumber Slice in bottom left
  ctx.save();
  ctx.translate(cx, cy);

  // Outer Dark Emerald Rind
  ctx.beginPath();
  ctx.arc(0, 0, outerR, 0, Math.PI * 2);
  const rindGrad = ctx.createRadialGradient(0, 0, outerR - rindThickness, 0, 0, outerR);
  rindGrad.addColorStop(0, '#327D1F');
  rindGrad.addColorStop(0.7, '#236113');
  rindGrad.addColorStop(1, '#154209');
  ctx.fillStyle = rindGrad;
  ctx.fill();

  // Bumpy texture
  ctx.fillStyle = '#52AB34';
  for (let a = 0; a < Math.PI * 2; a += 0.28) {
    const bx = Math.cos(a) * (outerR - 2);
    const by = Math.sin(a) * (outerR - 2);
    ctx.beginPath();
    ctx.arc(bx, by, 1.6, 0, Math.PI * 2);
    ctx.fill();
  }

  // Pale crispy pith layer
  ctx.beginPath();
  ctx.arc(0, 0, outerR - rindThickness, 0, Math.PI * 2);
  ctx.fillStyle = '#E8F8CE';
  ctx.fill();

  // Juicy Cucumber Pulp
  ctx.beginPath();
  ctx.arc(0, 0, pulpR, 0, Math.PI * 2);
  const pulpGrad = ctx.createRadialGradient(0, 0, 12, 0, 0, pulpR);
  pulpGrad.addColorStop(0, '#EDFADB');
  pulpGrad.addColorStop(0.5, '#DEF2BF');
  pulpGrad.addColorStop(1, '#C7E89C');
  ctx.fillStyle = pulpGrad;
  ctx.fill();

  // 3-Lobed Star Core (Botanical authentic cucumber cross-section seen in Image 1)
  const numLobes = 3;
  for (let l = 0; l < numLobes; l++) {
    const baseAngle = (l * Math.PI * 2) / numLobes - Math.PI / 6;

    ctx.save();
    ctx.rotate(baseAngle);

    ctx.beginPath();
    ctx.ellipse(32, 0, 26, 15, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(245, 254, 230, 0.7)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(168, 215, 114, 0.55)';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    for (let s = -2; s <= 2; s++) {
      const sx = 28 + Math.abs(s) * 3.5;
      const sy = s * 6;
      ctx.beginPath();
      ctx.ellipse(sx, sy, 4.5, 2, s * 0.15, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFEE6';
      ctx.fill();
      ctx.strokeStyle = 'rgba(180, 222, 130, 0.6)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
    ctx.restore();
  }

  // Central core star
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2);
  ctx.fillStyle = '#EDFADB';
  ctx.fill();

  ctx.restore();

  ctx.restore();
}

/**
 * 🌿 Lush Green Coriander / Herb Leaves (Image 1 bottom left)
 */
function drawCorianderLeaves(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  timeMs: number
) {
  ctx.save();
  const sway = Math.sin(timeMs * 0.0012) * 1.5;
  ctx.translate(x, y + sway);

  // Main Large Leaf pointing up-right
  ctx.save();
  ctx.rotate(-0.35);
  drawLeafBlade(ctx, 42, 24, '#387F25', '#245C15');
  ctx.restore();

  // Secondary Leaf pointing more up
  ctx.save();
  ctx.translate(-18, 16);
  ctx.rotate(-0.75);
  drawLeafBlade(ctx, 36, 20, '#42932C', '#286818');
  ctx.restore();

  // Small Leaf pointing right
  ctx.save();
  ctx.translate(14, 25);
  ctx.rotate(0.2);
  drawLeafBlade(ctx, 28, 16, '#4EAA35', '#2E781D');
  ctx.restore();

  ctx.restore();
}

/**
 * Helper to draw a delicate herb leaf blade with veins
 */
function drawLeafBlade(
  ctx: CanvasRenderingContext2D,
  len: number,
  w: number,
  fillColor: string,
  veinColor: string
) {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(len * 0.35, -w * 0.55, len * 0.75, -w * 0.45, len, 0);
  ctx.bezierCurveTo(len * 0.75, w * 0.45, len * 0.35, w * 0.55, 0, 0);
  ctx.closePath();

  const leafGrad = ctx.createLinearGradient(0, -w / 2, len, w / 2);
  leafGrad.addColorStop(0, fillColor);
  leafGrad.addColorStop(1, '#5BBF3C');
  ctx.fillStyle = leafGrad;
  ctx.fill();

  ctx.strokeStyle = veinColor;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(len * 0.92, 0);
  ctx.stroke();

  ctx.lineWidth = 0.7;
  for (let i = 1; i <= 3; i++) {
    const vx = len * 0.22 * i;
    ctx.beginPath();
    ctx.moveTo(vx, 0);
    ctx.lineTo(vx + 6, -w * 0.28);
    ctx.moveTo(vx, 0);
    ctx.lineTo(vx + 6, w * 0.28);
    ctx.stroke();
  }

  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.beginPath();
  ctx.arc(len * 0.55, -2, 1.8, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Ambient Dew Mote / Sparkling Droplet
 */
function drawDewMote(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  alpha: number
) {
  ctx.save();
  ctx.globalAlpha = Math.min(0.65, alpha);

  ctx.beginPath();
  ctx.arc(x, y, size * 1.6, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(235, 252, 185, 0.4)';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x - size * 0.35, y - size * 0.35, size * 0.4, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();

  ctx.restore();
}

/**
 * 🥒 Draw Fresh Cucumber Platforms (Frame 2117907135 Image 1 Theme)
 */
export function drawPlatform(ctx: CanvasRenderingContext2D, p: Platform, timeMs: number) {
  ctx.save();

  // Disappearing platform fading
  if (p.type === 'disappearing' && p.disappearAlpha !== undefined) {
    ctx.globalAlpha = Math.max(0.15, p.disappearAlpha);
  }

  // Broken fragile cucumber platform falling
  if (p.type === 'fragile' && p.broken) {
    ctx.translate(p.x, p.y);
    const drop = (p.breakProgress || 0) * 30;
    const split = (p.breakProgress || 0) * 16;

    // Left half
    ctx.save();
    ctx.translate(-split, drop);
    ctx.rotate(-((p.breakProgress || 0) * 0.45));
    drawCucumberSlab(ctx, 0, 0, p.width / 2, p.height);
    ctx.restore();

    // Right half
    ctx.save();
    ctx.translate(p.width / 2 + split, drop);
    ctx.rotate((p.breakProgress || 0) * 0.45);
    drawCucumberSlab(ctx, 0, 0, p.width / 2, p.height);
    ctx.restore();

    ctx.restore();
    return;
  }

  // Draw platform based on type & style
  if (p.type === 'trap') {
    // FATAL RED HAZARD BLOCK
    drawCucumberTrapPlatform(ctx, p, timeMs);
  } else if (p.type === 'moving') {
    // Moving Cucumber Float
    drawCucumberMovingPlatform(ctx, p, timeMs);
  } else if (p.type === 'fragile') {
    // Cracking Fragile Cucumber Slice
    drawCucumberFragilePlatform(ctx, p);
  } else if (p.type === 'disappearing') {
    // Translucent Disappearing Cucumber Slice
    drawCucumberDisappearingPlatform(ctx, p, timeMs);
  } else {
    // Standard Platforms: Variety of authentic Image 1 Cucumber styles & seasonal varieties
    if (p.style === 'ice') {
      drawCrystalAquaPlatform(ctx, p);
    } else if (p.style === 'swimring') {
      drawSwimRingPlatform(ctx, p, timeMs);
    } else if (p.style === 'lemon') {
      drawLemonPlatform(ctx, p, timeMs);
    } else if (p.style === 'lime') {
      drawLimePlatform(ctx, p, timeMs);
    } else if (p.style === 'cucumber_trio') {
      drawCucumberTrioPlatform(ctx, p, timeMs);
    } else if (p.style === 'cucumber_double') {
      drawCucumberDoublePlatform(ctx, p, timeMs);
    } else if (p.style === 'cucumber_single') {
      drawCucumberSinglePlatform(ctx, p, timeMs);
    } else {
      // Default: Long Halved Cucumber Boat (Image 1 hallmark platform - 60% of blocks)
      drawCucumberBoatPlatform(ctx, p, timeMs);
    }
  }

  // Draw item on platform if present
  if (p.item && !p.item.collected) {
    drawSummerItem(ctx, p, p.item, timeMs);
  }

  ctx.restore();
}

/**
 * 🥒 Image 1 Signature Platform: Halved Cucumber Boat / Trough Platform
 */
function drawCucumberBoatPlatform(
  ctx: CanvasRenderingContext2D,
  p: Platform,
  timeMs: number
) {
  ctx.save();
  const radius = Math.min(7, p.height / 2);

  // 1. Soft Tablecloth Shadow
  ctx.beginPath();
  ctx.roundRect(p.x, p.y + 4, p.width, p.height, radius);
  ctx.fillStyle = 'rgba(120, 160, 80, 0.28)';
  ctx.fill();

  // 2. Dark Emerald Cucumber Peel / Outer Rind
  const rindGrad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.height);
  rindGrad.addColorStop(0, '#367E22');
  rindGrad.addColorStop(0.5, '#266516');
  rindGrad.addColorStop(1, '#18470C');

  ctx.beginPath();
  ctx.roundRect(p.x, p.y, p.width, p.height, radius);
  ctx.fillStyle = rindGrad;
  ctx.fill();

  // Peel bumpy spots along bottom and sides
  ctx.fillStyle = '#4EA830';
  for (let bx = p.x + 8; bx < p.x + p.width - 6; bx += 14) {
    ctx.beginPath();
    ctx.arc(bx, p.y + p.height - 2.5, 1.3, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Crisp Light Pith Rim
  const pithMargin = 2.2;
  ctx.beginPath();
  ctx.roundRect(
    p.x + pithMargin,
    p.y + pithMargin,
    p.width - pithMargin * 2,
    p.height - pithMargin * 2,
    Math.max(1, radius - 1.5)
  );
  ctx.fillStyle = '#EBF8D5';
  ctx.fill();

  // 4. Juicy Watery Cucumber Pulp Center
  const pulpMargin = 3.6;
  const pulpW = p.width - pulpMargin * 2;
  const pulpH = p.height - pulpMargin * 2;
  ctx.beginPath();
  ctx.roundRect(
    p.x + pulpMargin,
    p.y + pulpMargin,
    pulpW,
    pulpH,
    Math.max(1, radius - 2.5)
  );
  const pulpGrad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.height);
  pulpGrad.addColorStop(0, '#E8F7CF');
  pulpGrad.addColorStop(0.5, '#D5F2AA');
  pulpGrad.addColorStop(1, '#C1E88F');
  ctx.fillStyle = pulpGrad;
  ctx.fill();

  // 5. Embedded Center Cucumber Seeds Row (Image 1 botanical cross-section)
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(
    p.x + pulpMargin,
    p.y + pulpMargin,
    pulpW,
    pulpH,
    Math.max(1, radius - 2.5)
  );
  ctx.clip();

  const numSeeds = Math.max(3, Math.floor(pulpW / 12));
  const seedStep = pulpW / (numSeeds + 1);
  const seedY = p.y + p.height * 0.52;

  for (let i = 1; i <= numSeeds; i++) {
    const sx = p.x + pulpMargin + i * seedStep;
    const tilt = (i % 2 === 0 ? 0.25 : -0.25);

    // Water pocket around seed
    ctx.beginPath();
    ctx.ellipse(sx, seedY, 5.2, 2.8, tilt, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(242, 252, 222, 0.9)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(164, 214, 108, 0.6)';
    ctx.lineWidth = 0.6;
    ctx.stroke();

    // Translucent seed core
    ctx.beginPath();
    ctx.ellipse(sx, seedY, 3.2, 1.4, tilt, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFEE3';
    ctx.fill();
  }
  ctx.restore();

  // 6. Top Specular Juice Gleam
  ctx.beginPath();
  ctx.moveTo(p.x + 8, p.y + 1.8);
  ctx.lineTo(p.x + p.width - 8, p.y + 1.8);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.lineWidth = 1.3;
  ctx.lineCap = 'round';
  ctx.stroke();

  // 7. Little glistening dewdrop in corner
  drawDewDropGleam(ctx, p.x + p.width - 6, p.y + 2.5, 2);

  // 8. Citrus & Mint Garnishes (User requested swim ring/lemon/lime styles)
  const garnish = p.garnish || 'none';
  if (garnish === 'lemon_right') {
    drawCucumberLemonWedge(ctx, p.x + p.width - 10, p.y + 1, 'right');
  } else if (garnish === 'lemon_left') {
    drawCucumberLemonWedge(ctx, p.x + 10, p.y + 1, 'left');
  } else if (garnish === 'lime_mint_left') {
    drawCucumberLimeMintWedge(ctx, p.x + 12, p.y + 1, 'left');
  } else if (garnish === 'lime_mint_right') {
    drawCucumberLimeMintWedge(ctx, p.x + p.width - 12, p.y + 1, 'right');
  } else if (garnish === 'double_lemon') {
    drawCucumberLemonWedge(ctx, p.x + 10, p.y + 1, 'left');
    drawCucumberLimeMintWedge(ctx, p.x + p.width - 12, p.y + 1, 'right');
  }

  ctx.restore();
}

/**
 * 🥒🥒🥒 Cucumber Trio: 3 Overlapping Round Slices (Image 1)
 */
function drawCucumberTrioPlatform(
  ctx: CanvasRenderingContext2D,
  p: Platform,
  timeMs: number
) {
  ctx.save();
  const sliceR = p.height * 0.85;
  const centerY = p.y + p.height / 2;

  // Shadow for whole group
  ctx.beginPath();
  ctx.ellipse(p.x + p.width / 2, p.y + p.height + 2, p.width * 0.45, 4, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(120, 160, 80, 0.25)';
  ctx.fill();

  const slice1X = p.x + sliceR + 2;
  const slice3X = p.x + p.width - sliceR - 2;
  const slice2X = (slice1X + slice3X) / 2;

  // Draw 3 layered slices (Left, Right, and Center on top)
  drawCucumberRoundSlice(ctx, slice1X, centerY, sliceR, -0.15);
  drawCucumberRoundSlice(ctx, slice3X, centerY, sliceR, 0.2);
  drawCucumberRoundSlice(ctx, slice2X, centerY - 1, sliceR * 1.05, 0.05);

  ctx.restore();
}

/**
 * 🥒🥒 Cucumber Double: 2 Overlapping Round Slices
 */
function drawCucumberDoublePlatform(
  ctx: CanvasRenderingContext2D,
  p: Platform,
  timeMs: number
) {
  ctx.save();
  const sliceR = p.height * 0.82;
  const centerY = p.y + p.height / 2;

  // Shadow
  ctx.beginPath();
  ctx.ellipse(p.x + p.width / 2, p.y + p.height + 2, p.width * 0.42, 4, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(120, 160, 80, 0.25)';
  ctx.fill();

  const slice1X = p.x + sliceR + 3;
  const slice2X = p.x + p.width - sliceR - 3;

  drawCucumberRoundSlice(ctx, slice1X, centerY, sliceR, -0.12);
  drawCucumberRoundSlice(ctx, slice2X, centerY, sliceR, 0.15);

  ctx.restore();
}

/**
 * 🥒 Cucumber Single: Wide Round Slice
 */
function drawCucumberSinglePlatform(
  ctx: CanvasRenderingContext2D,
  p: Platform,
  timeMs: number
) {
  ctx.save();
  const sliceR = Math.min(p.width * 0.48, p.height * 0.95);
  const centerX = p.x + p.width / 2;
  const centerY = p.y + p.height / 2;

  // Shadow
  ctx.beginPath();
  ctx.ellipse(centerX, p.y + p.height + 2, sliceR * 0.9, 4, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(120, 160, 80, 0.25)';
  ctx.fill();

  drawCucumberRoundSlice(ctx, centerX, centerY, sliceR, 0.1);

  ctx.restore();
}

/**
 * Helper to render an authentic circular cucumber slice wheel
 */
function drawCucumberRoundSlice(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  rot: number
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);

  // Outer Rind
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  const rindGrad = ctx.createRadialGradient(0, 0, r - 3, 0, 0, r);
  rindGrad.addColorStop(0, '#367E22');
  rindGrad.addColorStop(1, '#1A4A0D');
  ctx.fillStyle = rindGrad;
  ctx.fill();

  // Bumpy outer rim
  ctx.fillStyle = '#52B034';
  for (let a = 0; a < Math.PI * 2; a += 0.7) {
    const bx = Math.cos(a) * (r - 1);
    const by = Math.sin(a) * (r - 1);
    ctx.beginPath();
    ctx.arc(bx, by, 0.9, 0, Math.PI * 2);
    ctx.fill();
  }

  // Pale pith
  ctx.beginPath();
  ctx.arc(0, 0, r - 2.2, 0, Math.PI * 2);
  ctx.fillStyle = '#EBF8D5';
  ctx.fill();

  // Watery pulp
  const pulpR = r - 3.8;
  ctx.beginPath();
  ctx.arc(0, 0, pulpR, 0, Math.PI * 2);
  const pulpGrad = ctx.createRadialGradient(0, 0, 3, 0, 0, pulpR);
  pulpGrad.addColorStop(0, '#E8F7CF');
  pulpGrad.addColorStop(0.5, '#D5F2AA');
  pulpGrad.addColorStop(1, '#C1E88F');
  ctx.fillStyle = pulpGrad;
  ctx.fill();

  // 6 radial seeds
  const seedCount = 6;
  const seedRingR = pulpR * 0.58;
  for (let i = 0; i < seedCount; i++) {
    const a = (i * Math.PI * 2) / seedCount;
    const sx = Math.cos(a) * seedRingR;
    const sy = Math.sin(a) * seedRingR;

    ctx.beginPath();
    ctx.ellipse(sx, sy, 3.4, 1.8, a + Math.PI / 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(245, 253, 228, 0.85)';
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(sx, sy, 2, 0.9, a + Math.PI / 2, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFEE3';
    ctx.fill();
  }

  // Specular sheen
  ctx.beginPath();
  ctx.arc(0, 0, r - 1.5, -0.8, 0.2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.lineWidth = 1.1;
  ctx.stroke();

  ctx.restore();
}

/**
 * Moving Cucumber Platform (with sparkling water drops and leaf)
 */
function drawCucumberMovingPlatform(
  ctx: CanvasRenderingContext2D,
  p: Platform,
  timeMs: number
) {
  ctx.save();
  // Water ripple trail
  ctx.save();
  ctx.strokeStyle = 'rgba(168, 218, 120, 0.45)';
  ctx.lineWidth = 1.4;
  const waveW = p.width + 10;
  const waveX = p.x - 5;
  const waveY = p.y + p.height + 2;
  ctx.beginPath();
  ctx.moveTo(waveX, waveY);
  ctx.quadraticCurveTo(waveX + waveW * 0.5, waveY + Math.sin(timeMs * 0.008) * 2.5, waveX + waveW, waveY);
  ctx.stroke();
  ctx.restore();

  drawCucumberBoatPlatform(ctx, p, timeMs);

  // Little moving water shine
  const shineX = p.x + 10 + (Math.sin(timeMs * 0.003) * 0.5 + 0.5) * (p.width - 24);
  drawDewDropGleam(ctx, shineX, p.y + 2, 2.2);

  ctx.restore();
}

/**
 * Fragile Cucumber Platform (Crisp slice with hairline fracture cracks)
 */
function drawCucumberFragilePlatform(ctx: CanvasRenderingContext2D, p: Platform) {
  ctx.save();
  drawCucumberBoatPlatform(ctx, p, 0);

  // Hairline crack fracture lines across cucumber
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(p.x + p.width * 0.42, p.y + 1);
  ctx.lineTo(p.x + p.width * 0.48, p.y + p.height * 0.45);
  ctx.lineTo(p.x + p.width * 0.44, p.y + p.height - 1);
  ctx.moveTo(p.x + p.width * 0.48, p.y + p.height * 0.45);
  ctx.lineTo(p.x + p.width * 0.56, p.y + p.height * 0.7);
  ctx.stroke();

  ctx.restore();
}

/**
 * Disappearing Cucumber Platform (translucent pulse)
 */
function drawCucumberDisappearingPlatform(
  ctx: CanvasRenderingContext2D,
  p: Platform,
  timeMs: number
) {
  ctx.save();
  const pulse = Math.sin(timeMs * 0.006 + p.id) * 0.12;
  ctx.globalAlpha = Math.max(0.22, (p.disappearAlpha ?? 0.8) + pulse);
  drawCucumberBoatPlatform(ctx, p, timeMs);
  ctx.restore();
}

/**
 * Broken Cucumber Fragment Slab
 */
function drawCucumberSlab(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.save();
  const radius = 4;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  const slabGrad = ctx.createLinearGradient(x, y, x, y + h);
  slabGrad.addColorStop(0, '#D5F2AA');
  slabGrad.addColorStop(0.5, '#367E22');
  slabGrad.addColorStop(1, '#1A4A0D');
  ctx.fillStyle = slabGrad;
  ctx.fill();
  ctx.restore();
}

/**
 * ⚠️ FATAL RED TRAP PLATFORM (Hazard block that ends run if stepped on)
 */
function drawCucumberTrapPlatform(
  ctx: CanvasRenderingContext2D,
  p: Platform,
  timeMs: number
) {
  ctx.save();
  const radius = 6;

  // Pulsing danger warning aura
  const pulse = Math.sin(timeMs * 0.01 + p.id) * 3;
  ctx.shadowColor = '#EF4444';
  ctx.shadowBlur = 8 + pulse;

  // Red prickly chili spikes on top
  const spikeCount = 5;
  const spikeStep = p.width / spikeCount;
  ctx.fillStyle = '#DC2626';
  ctx.strokeStyle = '#991B1B';
  ctx.lineWidth = 1.2;

  for (let i = 0; i < spikeCount; i++) {
    const sx = p.x + i * spikeStep + spikeStep * 0.5;
    ctx.beginPath();
    ctx.moveTo(sx - 4.5, p.y);
    ctx.lineTo(sx, p.y - 7.5);
    ctx.lineTo(sx + 4.5, p.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // Base Red Hazard Block
  const trapGrad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.height);
  trapGrad.addColorStop(0, '#F87171');
  trapGrad.addColorStop(0.5, '#EF4444');
  trapGrad.addColorStop(1, '#B91C1C');

  ctx.beginPath();
  ctx.roundRect(p.x, p.y, p.width, p.height, radius);
  ctx.fillStyle = trapGrad;
  ctx.fill();

  // Yellow hazard diagonal stripes
  ctx.save();
  ctx.clip();
  ctx.strokeStyle = '#FBBF24';
  ctx.lineWidth = 4;
  for (let ix = p.x - 20; ix < p.x + p.width + 20; ix += 14) {
    ctx.beginPath();
    ctx.moveTo(ix, p.y - 2);
    ctx.lineTo(ix + 12, p.y + p.height + 2);
    ctx.stroke();
  }
  ctx.restore();

  // Dark border
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#7F1D1D';
  ctx.stroke();

  // Danger warning ✕
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 9px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✕', p.x + p.width / 2, p.y + p.height / 2);

  ctx.restore();
}

/**
 * Dew Drop Specular Gleam
 */
function drawDewDropGleam(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number
) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x - radius * 0.35, y - radius * 0.35, radius * 0.4, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
}

/**
 * 🍋 Fresh Lemon Wedge garnish perched on cucumber boat
 */
function drawCucumberLemonWedge(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  facing: 'left' | 'right'
) {
  ctx.save();
  ctx.translate(cx, cy);
  const flip = facing === 'left' ? -1 : 1;
  ctx.scale(flip, 1);
  const r = 8.5;

  // Shadow on cucumber peel
  ctx.beginPath();
  ctx.ellipse(0, 3, 8, 2.5, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(20, 60, 10, 0.25)';
  ctx.fill();

  // Outer Golden Peel
  ctx.beginPath();
  ctx.arc(0, 0, r, Math.PI, 0);
  ctx.closePath();
  ctx.fillStyle = '#F59E0B';
  ctx.fill();
  ctx.strokeStyle = '#D97706';
  ctx.lineWidth = 0.7;
  ctx.stroke();

  // Pale pith
  ctx.beginPath();
  ctx.arc(0, 0, r - 1.3, Math.PI, 0);
  ctx.closePath();
  ctx.fillStyle = '#FEFCE8';
  ctx.fill();

  // Juicy Lemon Pulp
  ctx.beginPath();
  ctx.arc(0, 0, r - 2.5, Math.PI, 0);
  ctx.closePath();
  ctx.fillStyle = '#FDE047';
  ctx.fill();

  // Segment lines
  ctx.strokeStyle = '#FEFCE8';
  ctx.lineWidth = 0.7;
  for (let a = Math.PI * 1.15; a <= Math.PI * 1.85; a += Math.PI * 0.23) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * (r - 2.5), Math.sin(a) * (r - 2.5));
    ctx.stroke();
  }

  // Specular gleam
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(-2, -4, 0.7, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * 🍈 Fresh Lime Wedge & Mint Leaf garnish perched on cucumber boat
 */
function drawCucumberLimeMintWedge(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  facing: 'left' | 'right'
) {
  ctx.save();
  ctx.translate(cx, cy);
  const flip = facing === 'left' ? -1 : 1;
  ctx.scale(flip, 1);

  // Mint Leaf behind lime
  ctx.save();
  ctx.translate(-3, -3);
  ctx.rotate(-0.4);
  ctx.beginPath();
  ctx.ellipse(0, 0, 5, 2.5, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#22C55E';
  ctx.fill();
  ctx.strokeStyle = '#15803D';
  ctx.lineWidth = 0.5;
  ctx.stroke();
  ctx.restore();

  // Shadow on cucumber peel
  ctx.beginPath();
  ctx.ellipse(0, 3, 8, 2.5, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(20, 60, 10, 0.25)';
  ctx.fill();

  // Lime Wedge semicircle
  const r = 8.5;
  ctx.beginPath();
  ctx.arc(0, 0, r, Math.PI, 0);
  ctx.closePath();
  ctx.fillStyle = '#10B981';
  ctx.fill();
  ctx.strokeStyle = '#059669';
  ctx.lineWidth = 0.7;
  ctx.stroke();

  // Pale pith
  ctx.beginPath();
  ctx.arc(0, 0, r - 1.3, Math.PI, 0);
  ctx.closePath();
  ctx.fillStyle = '#ECFDF5';
  ctx.fill();

  // Pulp
  ctx.beginPath();
  ctx.arc(0, 0, r - 2.5, Math.PI, 0);
  ctx.closePath();
  ctx.fillStyle = '#34D399';
  ctx.fill();

  // Segments
  ctx.strokeStyle = '#ECFDF5';
  ctx.lineWidth = 0.7;
  for (let a = Math.PI * 1.15; a <= Math.PI * 1.85; a += Math.PI * 0.23) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * (r - 2.5), Math.sin(a) * (r - 2.5));
    ctx.stroke();
  }

  // Specular gleam
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(-2, -4, 0.7, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Standard: Crystal Ice Block Float (清凉晶莹冰块 - 主力跳板占六成)
 */
function drawCrystalAquaPlatform(ctx: CanvasRenderingContext2D, p: Platform) {
  ctx.save();
  const radius = Math.min(5, p.height / 2);

  // Soft translucent drop shadow in pool
  ctx.beginPath();
  ctx.roundRect(p.x, p.y + 3.5, p.width, p.height, radius);
  ctx.fillStyle = 'rgba(2, 132, 199, 0.35)';
  ctx.fill();

  // Ice cube main body
  const grad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.height);
  grad.addColorStop(0, '#FFFFFF'); // Frosted pure white top
  grad.addColorStop(0.2, '#E0F2FE'); // Ice glaze
  grad.addColorStop(0.65, '#7DD3FC'); // Crisp sky ice
  grad.addColorStop(1, '#0284C7'); // Deep icy base

  ctx.beginPath();
  ctx.roundRect(p.x, p.y, p.width, p.height, radius);
  ctx.fillStyle = grad;
  ctx.fill();

  // Ice cube internal crystalline facets / refraction lines
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(p.x, p.y, p.width, p.height, radius);
  ctx.clip();

  // Internal geometric ice facet cuts
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(p.x + p.width * 0.28, p.y);
  ctx.lineTo(p.x + p.width * 0.42, p.y + p.height);
  ctx.moveTo(p.x + p.width * 0.65, p.y);
  ctx.lineTo(p.x + p.width * 0.76, p.y + p.height);
  ctx.stroke();

  // Frosted condensation bubbles inside ice
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.beginPath();
  ctx.arc(p.x + p.width * 0.16, p.y + p.height * 0.55, 1.2, 0, Math.PI * 2);
  ctx.arc(p.x + p.width * 0.52, p.y + p.height * 0.4, 1.4, 0, Math.PI * 2);
  ctx.arc(p.x + p.width * 0.84, p.y + p.height * 0.6, 1.1, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore(); // unclip

  // Crisp frosty ice rim
  ctx.lineWidth = 1.6;
  ctx.strokeStyle = '#BAE6FD';
  ctx.stroke();

  // Top specular icy shine
  ctx.beginPath();
  ctx.moveTo(p.x + 6, p.y + 2);
  ctx.lineTo(p.x + p.width - 6, p.y + 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.lineWidth = 1.6;
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.restore();
}

/**
 * Summer Swim Ring / Inflatable Pool Tube Float (充气救生圈/游泳圈)
 */
function drawSwimRingPlatform(ctx: CanvasRenderingContext2D, p: Platform, timeMs: number) {
  ctx.save();
  const radius = p.height / 2;

  // Gentle water shadow underneath with subtle floating bob
  const bob = Math.sin(timeMs * 0.003 + p.id) * 0.5;
  ctx.beginPath();
  ctx.roundRect(p.x, p.y + 3.5 + bob, p.width, p.height, radius);
  ctx.fillStyle = 'rgba(2, 132, 199, 0.35)';
  ctx.fill();

  // Inflatable tube base container
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(p.x, p.y, p.width, p.height, radius);
  ctx.clip();

  // Alternating vibrant summer stripes (Coral Red & Crisp White, or Sunny Yellow & Turquoise based on id)
  const isYellowTurquoise = p.id % 2 === 0;
  const color1 = isYellowTurquoise ? '#FBBF24' : '#F43F5E';
  const color2 = isYellowTurquoise ? '#38BDF8' : '#FFFFFF';
  const stripeWidth = 14;

  const numStripes = Math.ceil(p.width / stripeWidth) + 2;
  for (let i = 0; i < numStripes; i++) {
    const sx = p.x + i * stripeWidth;
    ctx.fillStyle = i % 2 === 0 ? color1 : color2;
    ctx.fillRect(sx, p.y, stripeWidth, p.height);
  }

  // Cylindrical shading: highlight on top, shadow on bottom to give 3D inflated volume
  const tubeShade = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.height);
  tubeShade.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
  tubeShade.addColorStop(0.35, 'rgba(255, 255, 255, 0.15)');
  tubeShade.addColorStop(0.7, 'rgba(0, 0, 0, 0.0)');
  tubeShade.addColorStop(1, 'rgba(0, 0, 0, 0.25)');
  ctx.fillStyle = tubeShade;
  ctx.fillRect(p.x, p.y, p.width, p.height);

  ctx.restore(); // unclip

  // Outer glossy outline
  ctx.beginPath();
  ctx.roundRect(p.x, p.y, p.width, p.height, radius);
  ctx.lineWidth = 1.6;
  ctx.strokeStyle = isYellowTurquoise ? '#D97706' : '#E11D48';
  ctx.stroke();

  // Glossy PVC Specular highlight along the upper tube curve
  ctx.beginPath();
  ctx.moveTo(p.x + 8, p.y + 2.5);
  ctx.lineTo(p.x + p.width - 8, p.y + 2.5);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.lineWidth = 1.6;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Little air valve nozzle on the right side
  ctx.beginPath();
  ctx.arc(p.x + p.width - 6, p.y + p.height * 0.4, 2, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  ctx.lineWidth = 0.8;
  ctx.stroke();

  ctx.restore();
}

/**
 * Summer Fruit Popsicle / Ice Pop Float (双色夏日冰棍)
 */
function drawPopsiclePlatform(ctx: CanvasRenderingContext2D, p: Platform, timeMs: number) {
  ctx.save();
  const radius = 6;

  // Shadow in water
  ctx.beginPath();
  ctx.roundRect(p.x, p.y + 3, p.width, p.height, radius);
  ctx.fillStyle = 'rgba(2, 132, 199, 0.35)';
  ctx.fill();

  // Wooden popsicle stick sticking out from right side
  const stickW = 12;
  const stickH = 6;
  const stickX = p.x + p.width - 2;
  const stickY = p.y + (p.height - stickH) / 2;
  ctx.beginPath();
  ctx.roundRect(stickX, stickY, stickW, stickH, 3);
  ctx.fillStyle = '#FDE68A'; // Birch wood
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#D97706';
  ctx.stroke();

  // Main Popsicle Bar (Two-tone / layered summer fruit ice)
  const isOrangeLime = p.id % 2 === 0;
  const topColor = isOrangeLime ? '#FB923C' : '#FB7185';
  const midColor = isOrangeLime ? '#FBBF24' : '#F43F5E';
  const botColor = isOrangeLime ? '#84CC16' : '#FACC15';

  const popGrad = ctx.createLinearGradient(p.x, p.y, p.x + p.width, p.y);
  popGrad.addColorStop(0, topColor);
  popGrad.addColorStop(0.58, midColor);
  popGrad.addColorStop(0.6, '#FFFFFF'); // Refreshing crisp division line
  popGrad.addColorStop(0.66, botColor);
  popGrad.addColorStop(1, botColor);

  ctx.beginPath();
  ctx.roundRect(p.x, p.y, p.width, p.height, radius);
  ctx.fillStyle = popGrad;
  ctx.fill();

  // Border
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = isOrangeLime ? '#EA580C' : '#E11D48';
  ctx.stroke();

  // Frosty icy top glint
  ctx.beginPath();
  ctx.moveTo(p.x + 6, p.y + 2);
  ctx.lineTo(p.x + p.width - 6, p.y + 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = 1.4;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Cold vapor shimmer / frosty condensation dots
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.beginPath();
  ctx.arc(p.x + 10, p.y + p.height * 0.45, 1.2, 0, Math.PI * 2);
  ctx.arc(p.x + 22, p.y + p.height * 0.6, 1.1, 0, Math.PI * 2);
  ctx.arc(p.x + p.width * 0.48, p.y + p.height * 0.35, 1.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Summer Watermelon Slice Float (清甜多汁西瓜块)
 */
function drawWatermelonPlatform(ctx: CanvasRenderingContext2D, p: Platform, timeMs: number) {
  ctx.save();
  const radius = 5;

  // Water drop shadow
  ctx.beginPath();
  ctx.roundRect(p.x, p.y + 3, p.width, p.height, radius);
  ctx.fillStyle = 'rgba(2, 132, 199, 0.35)';
  ctx.fill();

  // Base clipping for layered melon structure
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(p.x, p.y, p.width, p.height, radius);
  ctx.clip();

  // 1. Bottom Rind (Dark Green)
  const rindH = 4;
  ctx.fillStyle = '#166534';
  ctx.fillRect(p.x, p.y + p.height - rindH, p.width, rindH);

  // Tiny rind zig-zag tiger stripe details
  ctx.fillStyle = '#14532D';
  for (let sx = p.x + 4; sx < p.x + p.width; sx += 8) {
    ctx.fillRect(sx, p.y + p.height - rindH, 2, rindH);
  }

  // 2. Middle White/Pale Lime Rind layer
  const whiteH = 2.5;
  ctx.fillStyle = '#DCFCE7';
  ctx.fillRect(p.x, p.y + p.height - rindH - whiteH, p.width, whiteH);

  // 3. Top Sweet Red Melon Flesh
  const fleshH = p.height - rindH - whiteH;
  const fleshGrad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + fleshH);
  fleshGrad.addColorStop(0, '#FDA4AF'); // Juicy light watermelon pink
  fleshGrad.addColorStop(0.3, '#F43F5E'); // Fresh watermelon red
  fleshGrad.addColorStop(1, '#E11D48'); // Deep juicy crimson
  ctx.fillStyle = fleshGrad;
  ctx.fillRect(p.x, p.y, p.width, fleshH);

  // Cute Little Black Melon Seeds (Teardrop seeds)
  const numSeeds = Math.max(2, Math.floor(p.width / 18));
  const seedSpacing = p.width / (numSeeds + 1);
  ctx.fillStyle = '#1E293B';
  for (let i = 1; i <= numSeeds; i++) {
    const seedX = p.x + i * seedSpacing + (i % 2 === 0 ? 1 : -1);
    const seedY = p.y + 4 + (i % 2 === 0 ? 2 : 0);
    ctx.beginPath();
    ctx.ellipse(seedX, seedY, 1.2, 1.8, 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore(); // unclip

  // Crisp border
  ctx.beginPath();
  ctx.roundRect(p.x, p.y, p.width, p.height, radius);
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#15803D';
  ctx.stroke();

  // Top wet glistening shine
  ctx.beginPath();
  ctx.moveTo(p.x + 8, p.y + 2);
  ctx.lineTo(p.x + p.width - 8, p.y + 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.lineWidth = 1.3;
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.restore();
}

/**
 * Summer Lemon Slice Float (鲜黄柠檬切片浮板)
 * Features vibrant golden peel, white inner pith, juicy citrus segments, pulp vesicles, and a cute leaf!
 */
function drawLemonPlatform(ctx: CanvasRenderingContext2D, p: Platform, timeMs: number) {
  ctx.save();
  const radius = p.height / 2;

  // 1. Water drop shadow
  ctx.beginPath();
  ctx.roundRect(p.x, p.y + 3, p.width, p.height, radius);
  ctx.fillStyle = 'rgba(2, 132, 199, 0.35)';
  ctx.fill();

  // 2. Base clipping for citrus slice structure
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(p.x, p.y, p.width, p.height, radius);
  ctx.clip();

  // Outer golden-yellow lemon peel/rind
  const peelGrad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.height);
  peelGrad.addColorStop(0, '#FDE047');
  peelGrad.addColorStop(0.5, '#EAB308');
  peelGrad.addColorStop(1, '#CA8A04');
  ctx.fillStyle = peelGrad;
  ctx.fillRect(p.x, p.y, p.width, p.height);

  // White/pale cream inner pith layer
  const pithMargin = 2;
  ctx.beginPath();
  ctx.roundRect(p.x + pithMargin, p.y + pithMargin, p.width - pithMargin * 2, p.height - pithMargin * 2, Math.max(1, radius - 1));
  ctx.fillStyle = '#FEFCE8';
  ctx.fill();

  // Juicy Lemon Pulp background
  const pulpMargin = 3.2;
  ctx.beginPath();
  ctx.roundRect(p.x + pulpMargin, p.y + pulpMargin, p.width - pulpMargin * 2, p.height - pulpMargin * 2, Math.max(1, radius - 2));
  const pulpGrad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.height);
  pulpGrad.addColorStop(0, '#FEF08A');
  pulpGrad.addColorStop(0.6, '#FACC15');
  pulpGrad.addColorStop(1, '#EAB308');
  ctx.fillStyle = pulpGrad;
  ctx.fill();

  // Radiating citrus pulp segment dividers (lemon wheel segments)
  const numSegments = Math.max(3, Math.floor(p.width / 13));
  const segmentStep = (p.width - pulpMargin * 2) / numSegments;
  ctx.strokeStyle = '#FEFCE8';
  ctx.lineWidth = 1.4;
  for (let i = 1; i < numSegments; i++) {
    const sx = p.x + pulpMargin + i * segmentStep;
    ctx.beginPath();
    ctx.moveTo(sx, p.y + pulpMargin);
    ctx.lineTo(sx, p.y + p.height - pulpMargin);
    ctx.stroke();
  }

  // Juicy pulp seed / sparkle vesicles
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  for (let i = 0; i < numSegments; i++) {
    const cx = p.x + pulpMargin + (i + 0.5) * segmentStep;
    ctx.beginPath();
    ctx.arc(cx, p.y + p.height * 0.45, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore(); // unclip

  // Lemon Rind outline
  ctx.beginPath();
  ctx.roundRect(p.x, p.y, p.width, p.height, radius);
  ctx.lineWidth = 1.6;
  ctx.strokeStyle = '#CA8A04';
  ctx.stroke();

  // Top watery gloss shine
  ctx.beginPath();
  ctx.moveTo(p.x + 8, p.y + 2);
  ctx.lineTo(p.x + p.width - 8, p.y + 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.lineWidth = 1.5;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Cute Little Fresh Green Leaf on left edge
  ctx.save();
  ctx.translate(p.x + 4, p.y - 1);
  ctx.rotate(-0.35);
  ctx.beginPath();
  ctx.ellipse(0, 0, 4.5, 2.5, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#22C55E';
  ctx.fill();
  ctx.strokeStyle = '#15803D';
  ctx.lineWidth = 0.8;
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

/**
 * Summer Lime Slice Float (清爽青柠切片浮板)
 * Features fresh emerald lime peel, pale mint inner pith, translucent lime green wedges, and water dew droplets!
 */
function drawLimePlatform(ctx: CanvasRenderingContext2D, p: Platform, timeMs: number) {
  ctx.save();
  const radius = p.height / 2;

  // 1. Water drop shadow
  ctx.beginPath();
  ctx.roundRect(p.x, p.y + 3, p.width, p.height, radius);
  ctx.fillStyle = 'rgba(2, 132, 199, 0.35)';
  ctx.fill();

  // 2. Base clipping for lime citrus slice
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(p.x, p.y, p.width, p.height, radius);
  ctx.clip();

  // Outer vibrant emerald-green lime rind/peel
  const peelGrad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.height);
  peelGrad.addColorStop(0, '#34D399');
  peelGrad.addColorStop(0.5, '#10B981');
  peelGrad.addColorStop(1, '#047857');
  ctx.fillStyle = peelGrad;
  ctx.fillRect(p.x, p.y, p.width, p.height);

  // Pale mint-white inner pith layer
  const pithMargin = 2;
  ctx.beginPath();
  ctx.roundRect(p.x + pithMargin, p.y + pithMargin, p.width - pithMargin * 2, p.height - pithMargin * 2, Math.max(1, radius - 1));
  ctx.fillStyle = '#ECFDF5';
  ctx.fill();

  // Juicy Lime Pulp background (zesty lime green)
  const pulpMargin = 3.2;
  ctx.beginPath();
  ctx.roundRect(p.x + pulpMargin, p.y + pulpMargin, p.width - pulpMargin * 2, p.height - pulpMargin * 2, Math.max(1, radius - 2));
  const pulpGrad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.height);
  pulpGrad.addColorStop(0, '#A7F3D0');
  pulpGrad.addColorStop(0.45, '#4ADE80');
  pulpGrad.addColorStop(1, '#16A34A');
  ctx.fillStyle = pulpGrad;
  ctx.fill();

  // Radiating citrus pulp segment dividers
  const numSegments = Math.max(3, Math.floor(p.width / 13));
  const segmentStep = (p.width - pulpMargin * 2) / numSegments;
  ctx.strokeStyle = '#D1FAE5';
  ctx.lineWidth = 1.4;
  for (let i = 1; i < numSegments; i++) {
    const sx = p.x + pulpMargin + i * segmentStep;
    ctx.beginPath();
    ctx.moveTo(sx, p.y + pulpMargin);
    ctx.lineTo(sx, p.y + p.height - pulpMargin);
    ctx.stroke();
  }

  // Zesty sparkling dew droplets
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  for (let i = 0; i < numSegments; i++) {
    const cx = p.x + pulpMargin + (i + 0.5) * segmentStep;
    ctx.beginPath();
    ctx.arc(cx, p.y + p.height * 0.45, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore(); // unclip

  // Crisp Lime Rind outline
  ctx.beginPath();
  ctx.roundRect(p.x, p.y, p.width, p.height, radius);
  ctx.lineWidth = 1.6;
  ctx.strokeStyle = '#047857';
  ctx.stroke();

  // Top specular water shine
  ctx.beginPath();
  ctx.moveTo(p.x + 8, p.y + 2);
  ctx.lineTo(p.x + p.width - 8, p.y + 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.lineWidth = 1.5;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Little summer dew bubble on top right
  ctx.beginPath();
  ctx.arc(p.x + p.width - 7, p.y + 1, 2.2, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.fill();
  ctx.strokeStyle = '#059669';
  ctx.lineWidth = 0.6;
  ctx.stroke();

  ctx.restore();
}

/**
 * Moving: Tropical Surfboard Float (Sunshine yellow & coral)
 */
function drawSurfboardPlatform(ctx: CanvasRenderingContext2D, p: Platform, timeMs: number) {
  ctx.save();
  const radius = p.height / 2;

  // Shadow
  ctx.beginPath();
  ctx.roundRect(p.x, p.y + 3, p.width, p.height, radius);
  ctx.fillStyle = 'rgba(14, 165, 233, 0.4)';
  ctx.fill();

  // Surfboard body: Sunshine Yellow
  const grad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.height);
  grad.addColorStop(0, '#FEF08A');
  grad.addColorStop(1, '#FACC15');

  ctx.beginPath();
  ctx.roundRect(p.x, p.y, p.width, p.height, radius);
  ctx.fillStyle = grad;
  ctx.fill();

  // Coral Pink center racing stripe
  ctx.fillStyle = '#FB7185';
  ctx.fillRect(p.x + p.width * 0.35, p.y, p.width * 0.3, p.height);

  // Border
  ctx.lineWidth = 1.8;
  ctx.strokeStyle = '#EAB308';
  ctx.stroke();

  // Water trail sparkles
  const trailX = (p.vx || 0) > 0 ? p.x : p.x + p.width;
  ctx.beginPath();
  ctx.arc(trailX, p.y + p.height / 2, 3, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fill();

  ctx.restore();
}

/**
 * Fragile: Cracking Frosted Ice Float
 */
function drawFragileIcePlatform(ctx: CanvasRenderingContext2D, p: Platform) {
  ctx.save();
  drawIceSlab(ctx, p.x, p.y, p.width, p.height);

  // Surface cracks
  ctx.beginPath();
  ctx.moveTo(p.x + p.width * 0.4, p.y + 1);
  ctx.lineTo(p.x + p.width * 0.52, p.y + p.height * 0.5);
  ctx.lineTo(p.x + p.width * 0.46, p.y + p.height - 1);
  ctx.strokeStyle = '#0284C7';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  ctx.restore();
}

function drawIceSlab(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.save();
  const radius = 4;

  const grad = ctx.createLinearGradient(x, y, x, y + h);
  grad.addColorStop(0, '#F0F9FF');
  grad.addColorStop(0.5, '#E0F2FE');
  grad.addColorStop(1, '#BAE6FD');

  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#7DD3FC';
  ctx.stroke();

  // Frost highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fillRect(x + 4, y + 2, w - 8, 2);

  ctx.restore();
}

/**
 * Disappearing: Giant Iridescent Water Bubble Float
 */
function drawBubblePlatform(ctx: CanvasRenderingContext2D, p: Platform, timeMs: number) {
  ctx.save();
  const radius = p.height / 2;

  const bubbleGrad = ctx.createLinearGradient(p.x, p.y, p.x + p.width, p.y + p.height);
  bubbleGrad.addColorStop(0, 'rgba(244, 114, 182, 0.45)');
  bubbleGrad.addColorStop(0.5, 'rgba(165, 243, 252, 0.5)');
  bubbleGrad.addColorStop(1, 'rgba(192, 132, 252, 0.45)');

  ctx.beginPath();
  ctx.roundRect(p.x, p.y, p.width, p.height, radius);
  ctx.fillStyle = bubbleGrad;
  ctx.fill();

  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.stroke();

  ctx.restore();
}

/**
 * Summer Interactive Items (Starfish Spring, Bubble Wand, Hydro Rocket, Swim Ring Shield)
 */
function drawSummerItem(
  ctx: CanvasRenderingContext2D,
  p: Platform,
  item: Platform['item'],
  timeMs: number
) {
  if (!item) return;
  const itemX = p.x + item.x;
  const itemY = p.y + item.y;

  ctx.save();
  ctx.translate(itemX, itemY);

  if (item.type === 'spring') {
    // Summer Bouncy Starfish (Spring)
    const bounce = Math.sin(timeMs * 0.008) * 1.5;
    ctx.translate(0, -9 + bounce);

    // Glowing Starfish
    ctx.fillStyle = '#FB923C';
    drawStar(ctx, 0, 0, 5, 10, 5);
    ctx.fill();
    ctx.strokeStyle = '#EA580C';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Starfish cute face
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(-2.5, -1, 1.2, 0, Math.PI * 2);
    ctx.arc(2.5, -1, 1.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 1.5, 2, 0, Math.PI);
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 1;
    ctx.stroke();
  } else if (item.type === 'propeller') {
    // Summer Rainbow Bubble Propeller (Image 1 style)
    ctx.translate(0, -11);

    // Bubble Wand base
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.5)';
    ctx.fill();
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Spinning Rainbow Blades
    const spin = (timeMs * 0.02) % (Math.PI * 2);
    const bladeSpan = Math.cos(spin) * 14;
    ctx.beginPath();
    ctx.moveTo(-bladeSpan, -6);
    ctx.lineTo(bladeSpan, -6);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#F472B6';
    ctx.stroke();
  } else if (item.type === 'rocket') {
    // Aqua Hydro Jetpack (Dual water turbines)
    ctx.translate(0, -14);

    // Twin aqua cylinders
    [-6, 6].forEach((ox) => {
      ctx.beginPath();
      ctx.roundRect(ox - 3.5, -8, 7, 18, 3);
      ctx.fillStyle = '#38BDF8';
      ctx.fill();
      ctx.strokeStyle = '#0284C7';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Golden nozzle ring
      ctx.fillStyle = '#FBBF24';
      ctx.fillRect(ox - 3.5, 6, 7, 3);
    });
  } else if (item.type === 'shield') {
    // Summer Swim Ring (Pink & Cyan striped lifebuoy from Image 1!)
    ctx.translate(0, -10);
    const pulse = Math.sin(timeMs * 0.007) * 1.5;

    // Swim ring donut
    ctx.beginPath();
    ctx.arc(0, 0, 10 + pulse, 0, Math.PI * 2);
    ctx.fillStyle = '#F43F5E';
    ctx.fill();
    ctx.strokeStyle = '#BE123C';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Center hole
    ctx.beginPath();
    ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = '#38BDF8';
    ctx.fill();

    // White inflatable stripes
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-2, -10 - pulse, 4, 4);
    ctx.fillRect(-2, 6 + pulse, 4, 4);
  }

  ctx.restore();
}

/**
 * Summer Sea Monsters (Jellyfish, Pufferfish, Crab)
 */
export function drawMonster(ctx: CanvasRenderingContext2D, m: Monster, timeMs: number) {
  if (!m.alive) return;

  ctx.save();
  ctx.translate(m.x + m.width / 2, m.y + m.height / 2);

  // Swimming bob
  const swimBob = Math.sin(timeMs * 0.006 + m.id) * 4;
  ctx.translate(0, swimBob);

  if (m.type === 'jellyfish') {
    // 🪼 Translucent Violet/Pink Jellyfish
    ctx.beginPath();
    ctx.arc(0, -4, 16, Math.PI, 0, false);
    ctx.fillStyle = 'rgba(232, 121, 249, 0.75)';
    ctx.fill();
    ctx.strokeStyle = '#C026D3';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Cute eyes
    ctx.fillStyle = '#1E1B4B';
    ctx.beginPath();
    ctx.arc(-5, -6, 2.2, 0, Math.PI * 2);
    ctx.arc(5, -6, 2.2, 0, Math.PI * 2);
    ctx.fill();

    // Wavy tentacles
    ctx.strokeStyle = '#E879F9';
    ctx.lineWidth = 2;
    [-8, -3, 3, 8].forEach((tx, idx) => {
      const wave = Math.sin(timeMs * 0.01 + idx) * 3;
      ctx.beginPath();
      ctx.moveTo(tx, 0);
      ctx.quadraticCurveTo(tx + wave, 8, tx - wave, 14);
      ctx.stroke();
    });
  } else if (m.type === 'pufferfish') {
    // 🐡 Spiky Round Yellow Blowfish
    const puff = Math.sin(timeMs * 0.008 + m.id) * 2;
    const r = 16 + puff;

    // Body
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = '#FBBF24';
    ctx.fill();
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Spikes around body
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const sx = Math.cos(angle) * (r + 4);
      const sy = Math.sin(angle) * (r + 4);
      ctx.beginPath();
      ctx.arc(sx, sy, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#B45309';
      ctx.fill();
    }

    // Grumpy eyes
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-5, -3, 3.5, 0, Math.PI * 2);
    ctx.arc(5, -3, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(-4, -3, 1.8, 0, Math.PI * 2);
    ctx.arc(4, -3, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Puffed mouth
    ctx.beginPath();
    ctx.arc(0, 6, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#DC2626';
    ctx.fill();
  } else {
    // 🦀 Mischievous Red Beach Crab
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 12, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#EF4444';
    ctx.fill();
    ctx.strokeStyle = '#B91C1C';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Eyestalks
    [-6, 6].forEach((ex) => {
      ctx.beginPath();
      ctx.arc(ex, -12, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = '#B91C1C';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(ex, -12, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = '#0F172A';
      ctx.fill();
    });

    // Snapping Claws
    const snap = Math.sin(timeMs * 0.01) * 3;
    // Left claw
    ctx.beginPath();
    ctx.arc(-18, -4 + snap, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#DC2626';
    ctx.fill();
    // Right claw
    ctx.beginPath();
    ctx.arc(18, -4 - snap, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#DC2626';
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Summer Projectile (Pearl / Water Balloon from Image 1)
 */
export function drawProjectile(ctx: CanvasRenderingContext2D, p: Projectile) {
  ctx.save();
  ctx.translate(p.x, p.y);

  // Sparkling water splash droplet
  const grad = ctx.createRadialGradient(0, 0, 1, 0, 0, p.radius * 2);
  grad.addColorStop(0, '#FFFFFF');
  grad.addColorStop(0.5, '#38BDF8');
  grad.addColorStop(1, 'rgba(14, 165, 233, 0)');

  ctx.beginPath();
  ctx.arc(0, 0, p.radius * 2, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#E0F2FE';
  ctx.fill();

  ctx.restore();
}

/**
 * Particles: Water droplets, Splash bubbles, Red trap sparks
 */
export function drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
  ctx.save();
  ctx.globalAlpha = Math.max(0, p.alpha);

  if (p.shape === 'star') {
    ctx.fillStyle = p.color;
    drawStar(ctx, p.x, p.y, 4, p.size, p.size * 0.5);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(0.6, p.size), 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Helper to draw star polygon
 */
function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number
) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
}
