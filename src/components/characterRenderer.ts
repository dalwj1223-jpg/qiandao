import { Player } from '../types';

/**
 * Renders the lavender ribbon character from video13 with exact squash-and-stretch
 * jump animations, `>.<` squishing face, and power-up accessories.
 */
export function drawRibbonCharacter(
  ctx: CanvasRenderingContext2D,
  player: Player,
  timeMs: number
) {
  ctx.save();

  // Calculate dynamic squash & stretch
  let scaleX = 1;
  let scaleY = 1;
  const isSquashing = player.isSquashing || player.squashTimer > 0;

  if (isSquashing) {
    // Crisp, elastic contact recoil (springy and bouncy, never sticky or glued to the ground)
    const factor = Math.min(1, Math.max(0, player.squashTimer / 45));
    scaleX = 1.0 + 0.14 * factor;
    scaleY = 1.0 - 0.14 * factor;
  } else if (player.stretchTimer > 0) {
    // Launching stretch: spring upward
    const stretchFactor = Math.min(1, player.stretchTimer / 110);
    scaleX = 0.91;
    scaleY = 1.0 + 0.18 * stretchFactor;
  } else if (player.vy < -1) {
    // Rising upwards: sleek aerodynamic stretch
    const velStretch = Math.min(1.20, 1 + Math.abs(player.vy) * 0.014);
    scaleY = velStretch;
    scaleX = 1 / Math.sqrt(velStretch);
  } else if (player.vy > 1.5) {
    // Falling downwards: gentle preparation
    const velFall = Math.min(1.10, 1 + player.vy * 0.008);
    scaleX = velFall;
    scaleY = 1 / Math.sqrt(velFall);
  }

  // Anchor at bottom feet contact point so it snaps cleanly to the block without hovering or sinking
  const feetOffset = (player.height / 2) * (1 - scaleY);
  ctx.translate(player.x + player.width / 2, player.y + player.height / 2 + feetOffset);

  // Slight tilt based on horizontal velocity and rotation
  const tilt = (player.vx / 10) * 0.2 + (player.rotation || 0);
  ctx.rotate(tilt);

  // Facing direction
  if (player.facing === 'left') {
    ctx.scale(-1, 1);
  }

  ctx.scale(scaleX, scaleY);

  // If rocket equipped, draw rocket on back first (underneath player)
  if (player.powerUp && player.powerUp.type === 'rocket') {
    drawRocketBackpack(ctx, timeMs);
  }

  // Base dimensions of the character body
  const baseW = 44;
  const baseH = 50;

  // 1. Draw Lower Ribbon Crossed Knot / Feet (from video13)
  // Two layered overlapping ribbon bands at the bottom
  ctx.save();
  // Bottom left loop / fold
  ctx.beginPath();
  ctx.ellipse(-10, 14, 13, 8, -Math.PI / 12, 0, Math.PI * 2);
  ctx.fillStyle = '#8367D8'; // Deep shadow purple
  ctx.fill();

  // Bottom right loop / fold
  ctx.beginPath();
  ctx.ellipse(10, 14, 13, 8, Math.PI / 12, 0, Math.PI * 2);
  ctx.fillStyle = '#8D72E1';
  ctx.fill();

  // Front crossing ribbon knot
  ctx.beginPath();
  ctx.moveTo(-16, 12);
  ctx.bezierCurveTo(-14, 24, 14, 24, 16, 12);
  ctx.bezierCurveTo(14, 18, -14, 18, -16, 12);
  ctx.fillStyle = '#A38CF2';
  ctx.fill();
  ctx.restore();

  // 2. Draw Main Upper Ribbon Loop (The "8" body)
  ctx.save();
  // Outer silhouette
  ctx.beginPath();
  // Top rounded dome
  ctx.moveTo(-baseW / 2 + 5, -8);
  ctx.bezierCurveTo(-baseW / 2 + 3, -baseH / 2, baseW / 2 - 3, -baseH / 2, baseW / 2 - 5, -8);
  // Waist pinch
  ctx.bezierCurveTo(baseW / 2, 4, baseW / 2 + 2, 14, baseW / 2 - 8, 20);
  // Bottom curve
  ctx.bezierCurveTo(0, 24, 0, 24, -baseW / 2 + 8, 20);
  // Left waist pinch
  ctx.bezierCurveTo(-baseW / 2 - 2, 14, -baseW / 2, 4, -baseW / 2 + 5, -8);
  ctx.closePath();

  // Gradient fill for soft dimensional lilac volume
  const bodyGrad = ctx.createLinearGradient(0, -baseH / 2, 0, baseH / 2);
  bodyGrad.addColorStop(0, '#B7A2F8'); // lighter highlight top
  bodyGrad.addColorStop(0.5, '#9C84E8'); // signature lavender
  bodyGrad.addColorStop(1, '#8165D6'); // shadowed base
  ctx.fillStyle = bodyGrad;
  ctx.fill();

  // 3. Center Cutout (The hollow "8" eyelet / hole from video13)
  ctx.beginPath();
  const holeRadiusX = isSquashing ? 6.5 : 5.5;
  const holeRadiusY = isSquashing ? 5 : 7;
  ctx.ellipse(0, isSquashing ? 7 : 8, holeRadiusX, holeRadiusY, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(2, 132, 199, 0.4)'; // Clear translucent summer pool water hue
  ctx.fill();
  // Inner ring shadow for depth
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#7558CA';
  ctx.stroke();

  // Subtle ribbon fold highlight stripe across the head
  ctx.beginPath();
  ctx.ellipse(-6, -15, 8, 4, -Math.PI / 8, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
  ctx.fill();

  ctx.restore();

  // 4. Arms / Flippers (Black little wings from video13)
  ctx.save();
  ctx.fillStyle = '#181A24';
  const armW = 9;
  const armH = 5;

  if (isSquashing) {
    // When squashing: arms point slightly up and out (video13 frame 00:01)
    // Left arm
    ctx.save();
    ctx.translate(-22, 2);
    ctx.rotate(-0.5);
    ctx.beginPath();
    ctx.ellipse(0, 0, armW, armH, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Right arm
    ctx.save();
    ctx.translate(22, 2);
    ctx.rotate(0.5);
    ctx.beginPath();
    ctx.ellipse(0, 0, armW, armH, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else {
    // Floating / jumping: subtle flap
    const flap = Math.sin(timeMs * 0.015) * 0.25;
    // Left arm
    ctx.save();
    ctx.translate(-21, 0);
    ctx.rotate(0.2 + flap);
    ctx.beginPath();
    ctx.ellipse(0, 0, armW, armH, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Right arm
    ctx.save();
    ctx.translate(21, 0);
    ctx.rotate(-0.2 - flap);
    ctx.beginPath();
    ctx.ellipse(0, 0, armW, armH, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();

  // 5. Face (Eyes, Beak, and Mouth)
  ctx.save();
  if (isSquashing) {
    // Energetic, happy bounce eyes `^ . ^`
    ctx.strokeStyle = '#181A24';
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Left curved eye
    ctx.beginPath();
    ctx.moveTo(-10, -5);
    ctx.quadraticCurveTo(-7.5, -9, -5, -5);
    ctx.stroke();

    // Right curved eye
    ctx.beginPath();
    ctx.moveTo(5, -5);
    ctx.quadraticCurveTo(7.5, -9, 10, -5);
    ctx.stroke();

    // Tiny beak / mouth
    ctx.beginPath();
    ctx.arc(0, -3.5, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = '#181A24';
    ctx.fill();

    // Cheerful blush dots
    ctx.beginPath();
    ctx.arc(-13, -2, 2.8, 0, Math.PI * 2);
    ctx.arc(13, -2, 2.8, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 120, 160, 0.55)';
    ctx.fill();
  } else {
    // Normal / Jumping cute face:
    // Two glossy black oval eyes with white highlight
    const eyeY = -7;
    const eyeSpacing = 7.5;
    const eyeR = 3.5;

    // Left eye
    ctx.beginPath();
    ctx.arc(-eyeSpacing, eyeY, eyeR, 0, Math.PI * 2);
    ctx.fillStyle = '#181A24';
    ctx.fill();

    // White pupil highlight
    ctx.beginPath();
    ctx.arc(-eyeSpacing + 1.2, eyeY - 1.2, 1.4, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // Right eye
    ctx.beginPath();
    ctx.arc(eyeSpacing, eyeY, eyeR, 0, Math.PI * 2);
    ctx.fillStyle = '#181A24';
    ctx.fill();

    // White pupil highlight
    ctx.beginPath();
    ctx.arc(eyeSpacing + 1.2, eyeY - 1.2, 1.4, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // Tiny black beak/nose between eyes (video13)
    ctx.beginPath();
    ctx.arc(0, eyeY + 1.5, 1.6, 0, Math.PI * 2);
    ctx.fillStyle = '#181A24';
    ctx.fill();

    // Soft cheek blushes
    ctx.beginPath();
    ctx.arc(-12, eyeY + 4.5, 2.5, 0, Math.PI * 2);
    ctx.arc(12, eyeY + 4.5, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(240, 140, 180, 0.35)';
    ctx.fill();
  }
  ctx.restore();

  // 6. Power-up Overlays: Propeller Hat
  if (player.powerUp && player.powerUp.type === 'propeller') {
    drawPropellerHat(ctx, timeMs);
  }

  // 7. Shield Bubble
  if (player.hasShield) {
    drawShieldBubble(ctx, timeMs);
  }

  ctx.restore();
}

/**
 * Draws spinning propeller beanie on top of character's head
 */
function drawPropellerHat(ctx: CanvasRenderingContext2D, timeMs: number) {
  ctx.save();
  ctx.translate(0, -25);

  // Beanie cap
  ctx.beginPath();
  ctx.arc(0, 0, 10, Math.PI, 0, false);
  ctx.fillStyle = '#00B4D8';
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#0077B6';
  ctx.stroke();

  // Propeller stem
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -6);
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#48CAE4';
  ctx.stroke();

  // Spinning blades
  ctx.translate(0, -6);
  const spinSpeed = (timeMs * 0.04) % (Math.PI * 2);
  const bladeSpan = Math.cos(spinSpeed) * 18;

  ctx.beginPath();
  ctx.moveTo(-bladeSpan, -1.5);
  ctx.lineTo(bladeSpan, 1.5);
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#FFD166';
  ctx.stroke();

  // Center hub
  ctx.beginPath();
  ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
  ctx.fillStyle = '#EF476F';
  ctx.fill();

  ctx.restore();
}

/**
 * Draws Aqua Hydro Jetpack with sparkling high-pressure water spouts & bubbles
 */
function drawRocketBackpack(ctx: CanvasRenderingContext2D, timeMs: number) {
  ctx.save();
  const rocketOffsets = [-18, 18];

  rocketOffsets.forEach((rx) => {
    ctx.save();
    ctx.translate(rx, 4);

    // Aqua hydro turbine
    ctx.beginPath();
    ctx.roundRect(-4, -14, 8, 22, 3);
    const turbineGrad = ctx.createLinearGradient(-4, -14, 4, 8);
    turbineGrad.addColorStop(0, '#E0F2FE');
    turbineGrad.addColorStop(0.5, '#38BDF8');
    turbineGrad.addColorStop(1, '#0284C7');
    ctx.fillStyle = turbineGrad;
    ctx.fill();
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = '#0369A1';
    ctx.stroke();

    // Golden sunshine tip
    ctx.beginPath();
    ctx.moveTo(-4, -14);
    ctx.lineTo(0, -20);
    ctx.lineTo(4, -14);
    ctx.closePath();
    ctx.fillStyle = '#FBBF24';
    ctx.fill();

    // Nozzle
    ctx.beginPath();
    ctx.moveTo(-3, 8);
    ctx.lineTo(3, 8);
    ctx.lineTo(4, 12);
    ctx.lineTo(-4, 12);
    ctx.closePath();
    ctx.fillStyle = '#0F172A';
    ctx.fill();

    // Foaming pressurized water spray (replaces flame for summer theme!)
    const flicker = Math.sin(timeMs * 0.08 + rx) * 3;
    const sprayH = 20 + Math.random() * 8 + flicker;

    // Outer azure water stream
    ctx.beginPath();
    ctx.moveTo(-4, 12);
    ctx.quadraticCurveTo(-6, 12 + sprayH * 0.6, 0, 12 + sprayH);
    ctx.quadraticCurveTo(6, 12 + sprayH * 0.6, 4, 12);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.75)';
    ctx.fill();

    // Inner bright white foam core
    ctx.beginPath();
    ctx.moveTo(-2, 12);
    ctx.quadraticCurveTo(-2, 12 + sprayH * 0.4, 0, 12 + sprayH * 0.8);
    ctx.quadraticCurveTo(2, 12 + sprayH * 0.4, 2, 12);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // Water droplet bubbles at stream base
    ctx.beginPath();
    ctx.arc((Math.random() - 0.5) * 6, 12 + sprayH + Math.random() * 4, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fill();

    ctx.restore();
  });

  ctx.restore();
}

/**
 * Draws summer inflatable swim ring & rainbow bubble shield
 */
function drawShieldBubble(ctx: CanvasRenderingContext2D, timeMs: number) {
  ctx.save();
  const pulse = Math.sin(timeMs * 0.006) * 2;
  const radius = 33 + pulse;

  // Inflatable pink & cyan swim ring around waist
  ctx.save();
  ctx.translate(0, 10);
  ctx.beginPath();
  ctx.ellipse(0, 0, 28, 11, 0, 0, Math.PI * 2);
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#FB7185'; // Coral pink
  ctx.stroke();

  // White stripes on swim ring
  ctx.beginPath();
  ctx.ellipse(0, 0, 28, 11, 0, 0, Math.PI * 2);
  ctx.lineWidth = 8;
  ctx.setLineDash([8, 14]);
  ctx.strokeStyle = '#FFFFFF';
  ctx.stroke();
  ctx.restore();

  // Shimmering bubble aura (Image 1 style)
  const shieldGrad = ctx.createRadialGradient(0, 0, radius * 0.6, 0, 0, radius);
  shieldGrad.addColorStop(0, 'rgba(56, 189, 248, 0.05)');
  shieldGrad.addColorStop(0.85, 'rgba(244, 114, 182, 0.25)');
  shieldGrad.addColorStop(1, 'rgba(56, 189, 248, 0.6)');

  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fillStyle = shieldGrad;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.stroke();

  ctx.restore();
}
