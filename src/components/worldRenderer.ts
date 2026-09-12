import { Platform, Monster, Projectile, Particle, StarBackground } from '../types';

/**
 * Summer Water Park & Beach Theme World Renderer
 * Inspired by Image 1: Bright sunshine, sparkling pool water, glossy crystal floats,
 * bubbles, tropical vibes, and dangerous red trap blocks.
 */

// Draw Summer Resort Water Park Background
export function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  cameraY: number,
  bubbles: StarBackground[],
  timeMs: number
) {
  // 1. Sky & Swimming Pool Water Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#38BDF8'); // Vibrant sunny sky blue
  bgGrad.addColorStop(0.35, '#60A5FA'); // Sky mid
  bgGrad.addColorStop(0.7, '#0EA5E9'); // Surface azure water
  bgGrad.addColorStop(1, '#0284C7'); // Deep turquoise pool water
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  ctx.save();

  // 2. Gentle Sunbeams (diagonal caustic light rays)
  ctx.save();
  ctx.globalAlpha = 0.08;
  const rayGrad = ctx.createLinearGradient(0, 0, width, height);
  rayGrad.addColorStop(0, '#FFFFFF');
  rayGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = rayGrad;

  for (let i = -100; i < width + 150; i += 75) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 45, 0);
    ctx.lineTo(i + 140, height);
    ctx.lineTo(i + 80, height);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // 3. Pool Water Ripples (caustics that scroll gently with camera)
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.lineWidth = 1.5;
  const rippleSpacing = 36;
  const rippleOffset = (cameraY * 0.4) % rippleSpacing;

  for (let y = rippleOffset; y < height; y += rippleSpacing) {
    ctx.beginPath();
    for (let x = 0; x <= width; x += 30) {
      const wave = Math.sin((x + timeMs * 0.04 + y) * 0.035) * 4;
      if (x === 0) ctx.moveTo(x, y + wave);
      else ctx.lineTo(x, y + wave);
    }
    ctx.stroke();
  }
  ctx.restore();

  // 4. Distant Tropical Resort Deco (Palm fronds & Waterslide silhouettes)
  drawDistantResortElements(ctx, width, height, cameraY);

  // 5. Floating Iridescent Water Bubbles (from Image 1 style)
  bubbles.forEach((b) => {
    const by = (b.y - cameraY * 0.35 - (timeMs * 0.03)) % height;
    const finalY = by < 0 ? by + height : by;
    const bx = b.x + Math.sin(timeMs * 0.002 + b.y) * 8;
    const alpha = Math.min(0.75, b.alpha + 0.15);

    drawSummerBubble(ctx, bx, finalY, b.size * 2.8, alpha);
  });

  ctx.restore();
}

/**
 * Draws parallax resort waterslide & palm silhouettes
 */
function drawDistantResortElements(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  cameraY: number
) {
  ctx.save();
  ctx.globalAlpha = 0.15;

  // Waterslide spiral on the right
  const slideY = 280 - (cameraY * 0.1) % 900;
  if (slideY > -100 && slideY < height + 100) {
    ctx.strokeStyle = '#F43F5E'; // Coral pink slide
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(width - 20, slideY, 65, -0.4 * Math.PI, 0.6 * Math.PI);
    ctx.stroke();

    ctx.strokeStyle = '#FDE047'; // Sunshine yellow slide trim
    ctx.lineWidth = 4;
    ctx.stroke();
  }

  // Palm tree top on the left
  const palmY = 480 - (cameraY * 0.12) % 950;
  if (palmY > -100 && palmY < height + 100) {
    ctx.save();
    ctx.translate(15, palmY);
    ctx.fillStyle = '#059669';
    for (let angle = -1.2; angle <= 0.8; angle += 0.5) {
      ctx.save();
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(25, 0, 30, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  ctx.restore();
}

/**
 * Draws an iridescent soap bubble (Image 1 aesthetic)
 */
function drawSummerBubble(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  alpha: number
) {
  ctx.save();
  ctx.globalAlpha = alpha;

  // Bubble sphere gradient
  const bubbleGrad = ctx.createRadialGradient(
    x - radius * 0.3,
    y - radius * 0.3,
    radius * 0.2,
    x,
    y,
    radius
  );
  bubbleGrad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
  bubbleGrad.addColorStop(0.6, 'rgba(165, 243, 252, 0.25)');
  bubbleGrad.addColorStop(0.9, 'rgba(244, 114, 182, 0.3)');
  bubbleGrad.addColorStop(1, 'rgba(56, 189, 248, 0.6)');

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = bubbleGrad;
  ctx.fill();

  // White highlight arc
  ctx.beginPath();
  ctx.arc(x - radius * 0.35, y - radius * 0.35, radius * 0.3, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fill();

  ctx.restore();
}

/**
 * Draw Summer Platforms:
 * - standard: Crystal aqua ice float
 * - moving: Sunshine yellow & coral surfboard float
 * - fragile: Cracking frosted ice cube float
 * - disappearing: Shimmering bubble float
 * - trap: FATAL RED DANGER BLOCK (Spiky coral / hazard)
 */
export function drawPlatform(ctx: CanvasRenderingContext2D, p: Platform, timeMs: number) {
  ctx.save();

  // Disappearing platform fading
  if (p.type === 'disappearing' && p.disappearAlpha !== undefined) {
    ctx.globalAlpha = Math.max(0.12, p.disappearAlpha);
  }

  // Broken fragile ice platform falling
  if (p.type === 'fragile' && p.broken) {
    ctx.translate(p.x, p.y);
    const drop = (p.breakProgress || 0) * 28;
    const split = (p.breakProgress || 0) * 14;

    // Left ice piece
    ctx.save();
    ctx.translate(-split, drop);
    ctx.rotate(-((p.breakProgress || 0) * 0.4));
    drawIceSlab(ctx, 0, 0, p.width / 2, p.height);
    ctx.restore();

    // Right ice piece
    ctx.save();
    ctx.translate(p.width / 2 + split, drop);
    ctx.rotate((p.breakProgress || 0) * 0.4);
    drawIceSlab(ctx, 0, 0, p.width / 2, p.height);
    ctx.restore();

    ctx.restore();
    return;
  }

  // Draw platform based on type
  if (p.type === 'trap') {
    // FATAL RED TRAP PLATFORM (Spiky hazard block)
    drawTrapPlatform(ctx, p, timeMs);
  } else if (p.type === 'moving') {
    // Sunshine yellow & coral surfboard float
    drawSurfboardPlatform(ctx, p, timeMs);
  } else if (p.type === 'fragile') {
    // Cracking frosted ice block
    drawFragileIcePlatform(ctx, p);
  } else if (p.type === 'disappearing') {
    // Translucent giant bubble float
    drawBubblePlatform(ctx, p, timeMs);
  } else {
    // Standard platforms with multiple summer styles (swimring, lemon, lime, ice, etc.)
    const style = p.style || 'swimring';
    if (style === 'swimring') {
      drawSwimRingPlatform(ctx, p, timeMs);
    } else if (style === 'lemon') {
      drawLemonPlatform(ctx, p, timeMs);
    } else if (style === 'lime') {
      drawLimePlatform(ctx, p, timeMs);
    } else if (style === 'popsicle') {
      drawPopsiclePlatform(ctx, p, timeMs);
    } else if (style === 'watermelon') {
      drawWatermelonPlatform(ctx, p, timeMs);
    } else {
      drawCrystalAquaPlatform(ctx, p);
    }
  }

  // Draw item on platform if present
  if (p.item && !p.item.collected) {
    drawSummerItem(ctx, p, p.item, timeMs);
  }

  ctx.restore();
}

/**
 * ⚠️ FATAL RED TRAP PLATFORM:
 * Fiery crimson danger float with hazard warning stripes and sharp spikes!
 */
function drawTrapPlatform(ctx: CanvasRenderingContext2D, p: Platform, timeMs: number) {
  ctx.save();
  const radius = 6;

  // Pulsing danger warning aura
  const pulse = Math.sin(timeMs * 0.01 + p.id) * 3;
  ctx.shadowColor = '#EF4444';
  ctx.shadowBlur = 10 + pulse;

  // Spikes on top (Red coral / sea urchin spikes)
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

  // Danger warning symbol ⚠️ in center
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 9px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✕', p.x + p.width / 2, p.y + p.height / 2);

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
