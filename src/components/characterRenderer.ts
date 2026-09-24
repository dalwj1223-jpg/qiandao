import { Player } from '../types';

/**
 * Renders the custom mascot character from the user's uploaded image:
 * - Soft dimensional lilac round body with lowercase 'a' running/walking legs
 * - Jaunty dark purple floppy adventurer hat/fedora tilted on the top-left
 * - Expressive face with signature winking left eye, glossy round right eye, and sweet smile
 * - Distinctive soft white circular belly spot in center
 * - Cute black cartoon stick arms: left down-left, right raised waving cheerfully
 * - Smooth squash-and-stretch physics, bounciness, and power-up overlays
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

  // 1. Back Left Leg (chubby step-back foot)
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(-6, 8);
  ctx.quadraticCurveTo(-14, 12, -15, 18);
  ctx.quadraticCurveTo(-15, 23.5, -9, 23.5);
  ctx.quadraticCurveTo(-4, 23.5, -3, 17);
  ctx.quadraticCurveTo(-2, 11, -6, 8);
  ctx.closePath();
  // Slightly deeper shadow purple for back leg
  const backLegGrad = ctx.createLinearGradient(-15, 10, -4, 24);
  backLegGrad.addColorStop(0, '#866FE0');
  backLegGrad.addColorStop(1, '#7259D3');
  ctx.fillStyle = backLegGrad;
  ctx.fill();
  ctx.restore();

  // 2. Left Cartoon Stick Arm (angled down-left)
  ctx.save();
  ctx.strokeStyle = '#1E1A29';
  ctx.lineWidth = 3.2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  if (isSquashing) {
    // Arm flexes slightly outward on impact
    ctx.moveTo(-14, 0);
    ctx.quadraticCurveTo(-19, 4, -23, 3);
  } else {
    const armFlutter = Math.sin(timeMs * 0.012) * 1.5;
    ctx.moveTo(-14.5, 0);
    ctx.quadraticCurveTo(-18, 3 + armFlutter, -22.5, 7 + armFlutter);
  }
  ctx.stroke();
  ctx.restore();

  // 3. Main Round Lilac Torso & Head
  ctx.save();
  ctx.beginPath();
  // Round plump body
  ctx.arc(0, -3, 17.5, 0, Math.PI * 2);
  // Rich 3D gradient matching user image
  const bodyGrad = ctx.createRadialGradient(-5, -8, 2, 0, -3, 18);
  bodyGrad.addColorStop(0, '#BDB1FF');   // Soft highlight
  bodyGrad.addColorStop(0.4, '#9D88F8'); // Vibrant lilac midtone
  bodyGrad.addColorStop(0.85, '#856DE4');// Deeper purple
  bodyGrad.addColorStop(1, '#745CD8');   // Ambient crease
  ctx.fillStyle = bodyGrad;
  ctx.fill();
  ctx.restore();

  // 4. Front "a" Lower Body Loop & Right Foot (chubby forward-stepping curl)
  ctx.save();
  ctx.beginPath();
  // Sweeps from lower torso across the front into the forward foot
  ctx.moveTo(-5, 9);
  ctx.bezierCurveTo(0, 14, 7, 13, 11, 16);
  ctx.bezierCurveTo(15, 18.5, 16, 23.5, 10, 23.5);
  ctx.bezierCurveTo(4, 23.5, 1, 20, 0, 16);
  ctx.bezierCurveTo(-1, 13, -3, 11, -5, 9);
  ctx.closePath();
  const frontLegGrad = ctx.createLinearGradient(0, 10, 15, 24);
  frontLegGrad.addColorStop(0, '#A490FA'); // Highlight top edge of 'a' loop
  frontLegGrad.addColorStop(0.6, '#937EF4');
  frontLegGrad.addColorStop(1, '#7C64DB');
  ctx.fillStyle = frontLegGrad;
  ctx.fill();

  // Subtle crease separation shadow between 'a' loop and back leg
  ctx.beginPath();
  ctx.moveTo(-5, 10);
  ctx.quadraticCurveTo(0, 13, 3, 15);
  ctx.strokeStyle = 'rgba(80, 55, 155, 0.35)';
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.restore();

  // 5. White Circular Belly Button / Disc (signature feature from user's image)
  ctx.save();
  ctx.beginPath();
  const bellyY = isSquashing ? 5.5 : 4.5;
  const bellyRx = isSquashing ? 6.2 : 5.4;
  const bellyRy = isSquashing ? 4.6 : 5.4;
  ctx.ellipse(0.5, bellyY, bellyRx, bellyRy, 0, 0, Math.PI * 2);
  const bellyGrad = ctx.createLinearGradient(0.5, bellyY - bellyRy, 0.5, bellyY + bellyRy);
  bellyGrad.addColorStop(0, '#FFFFFF');
  bellyGrad.addColorStop(0.7, '#F3F1FF');
  bellyGrad.addColorStop(1, '#E4E0FA');
  ctx.fillStyle = bellyGrad;
  ctx.fill();
  ctx.strokeStyle = 'rgba(160, 145, 235, 0.4)';
  ctx.lineWidth = 0.8;
  ctx.stroke();
  ctx.restore();

  // 6. Right Cartoon Stick Arm (raised up-right, waving cheerfully)
  ctx.save();
  ctx.strokeStyle = '#1E1A29';
  ctx.lineWidth = 3.2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  // Waving oscillation
  const wave = isSquashing ? 0 : Math.sin(timeMs * 0.01) * 2.2;
  ctx.moveTo(14.5, -1);
  ctx.quadraticCurveTo(19, -6 + wave * 0.5, 22.5, -12 + wave);
  ctx.stroke();
  ctx.restore();

  // 7. Face: Winking Left Eye, Glossy Right Eye, Cute Smile & Cheeks
  ctx.save();
  if (isSquashing) {
    // Squeezed super-happy expression on bounce `> ᴗ <`
    ctx.strokeStyle = '#1E1A29';
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Left squeezed eye `>`
    ctx.beginPath();
    ctx.moveTo(-8, -10);
    ctx.lineTo(-4, -8.5);
    ctx.lineTo(-8, -7);
    ctx.stroke();

    // Right squeezed eye `<`
    ctx.beginPath();
    ctx.moveTo(8, -10);
    ctx.lineTo(4, -8.5);
    ctx.lineTo(8, -7);
    ctx.stroke();

    // Tiny smiling open mouth
    ctx.beginPath();
    ctx.arc(0, -3.5, 2.2, 0, Math.PI);
    ctx.fillStyle = '#1E1A29';
    ctx.fill();

    // Rosy bounce blush
    ctx.beginPath();
    ctx.arc(-11, -3.5, 2.8, 0, Math.PI * 2);
    ctx.arc(11, -3.5, 2.8, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 120, 160, 0.55)';
    ctx.fill();
  } else {
    // Normal signature expression from user's image:
    // A. Left Eye: Playful Wink (😉)
    ctx.save();
    ctx.strokeStyle = '#1E1A29';
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    // Arched winking curve with slight cute flick
    ctx.moveTo(-7.5, -8.8);
    ctx.quadraticCurveTo(-4.8, -7.2, -2.0, -9.2);
    ctx.stroke();
    // Little upper crease flick for wink personality
    ctx.beginPath();
    ctx.moveTo(-6.8, -10.2);
    ctx.lineTo(-5.2, -9.6);
    ctx.stroke();
    ctx.restore();

    // B. Right Eye: Big Glossy Round Cartoon Eye
    const eyeX = 5.2;
    const eyeY = -8.6;
    const eyeR = 3.6;

    // Subtle pale rim so eye pops clearly
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, eyeR + 0.6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.fill();

    // Deep black pupil
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, eyeR, 0, Math.PI * 2);
    ctx.fillStyle = '#1E1A29';
    ctx.fill();

    // Big crisp white reflection highlight at upper-right
    ctx.beginPath();
    ctx.arc(eyeX + 1.2, eyeY - 1.2, 1.4, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // Tiny secondary specular twinkle at lower-left
    ctx.beginPath();
    ctx.arc(eyeX - 1.2, eyeY + 1.2, 0.6, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // C. Cute Tiny Smile
    ctx.save();
    ctx.strokeStyle = '#1E1A29';
    ctx.lineWidth = 1.8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0.5, -4.0, 2.0, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();
    ctx.restore();

    // D. Soft Rosy Cheeks
    ctx.beginPath();
    ctx.arc(-10.5, -4.5, 2.5, 0, Math.PI * 2);
    ctx.arc(11, -4.5, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 130, 165, 0.32)';
    ctx.fill();
  }
  ctx.restore();

  // 8. Jaunty Dark Purple Floppy Adventurer Hat / Fedora (tilted on top-left of head)
  ctx.save();
  // Hat is tilted jauntily over the top-left of the head
  ctx.translate(-4, -16);
  ctx.rotate(-0.20); // ~ -11.5 degrees tilt

  // A. Hat Cast Shadow on Head
  ctx.beginPath();
  ctx.ellipse(1, 4.5, 15, 3.5, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(35, 20, 65, 0.38)';
  ctx.fill();

  // B. Floppy Brim (wide, wavy curved brim from user's image)
  ctx.beginPath();
  // Wavy floppy brim profile
  ctx.moveTo(-18, 0);
  ctx.bezierCurveTo(-17, -4, 15, -4, 17, 0);
  ctx.bezierCurveTo(16, 5, -16, 5, -18, 0);
  ctx.closePath();
  const brimGrad = ctx.createLinearGradient(-18, -4, 17, 5);
  brimGrad.addColorStop(0, '#6D5CA8');
  brimGrad.addColorStop(0.5, '#58478E');
  brimGrad.addColorStop(1, '#47367B');
  ctx.fillStyle = brimGrad;
  ctx.fill();
  ctx.strokeStyle = '#433374';
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Subtle highlight rim along upper brim edge
  ctx.beginPath();
  ctx.moveTo(-16, -1);
  ctx.quadraticCurveTo(0, -3.2, 14, -1);
  ctx.strokeStyle = 'rgba(175, 160, 235, 0.45)';
  ctx.lineWidth = 0.9;
  ctx.stroke();

  // C. Hat Crown (rounded dome sitting on top of brim)
  ctx.beginPath();
  ctx.moveTo(-10, 0);
  ctx.bezierCurveTo(-11, -7, -8, -12.5, -1, -13);
  ctx.bezierCurveTo(6, -13.5, 10, -7, 9, 0);
  ctx.closePath();
  const crownGrad = ctx.createLinearGradient(-10, -13, 9, 0);
  crownGrad.addColorStop(0, '#7563B3'); // highlight at apex
  crownGrad.addColorStop(0.5, '#5E4D95');
  crownGrad.addColorStop(1, '#4A397F'); // shadow base
  ctx.fillStyle = crownGrad;
  ctx.fill();
  ctx.strokeStyle = '#3E2E72';
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // D. Dark Ribbon Hatband around base of crown
  ctx.beginPath();
  ctx.moveTo(-10, -0.5);
  ctx.quadraticCurveTo(0, -1.8, 9, -0.5);
  ctx.strokeStyle = '#322363';
  ctx.lineWidth = 2.2;
  ctx.stroke();

  // Crown soft indentation crease (fedora pinch)
  ctx.beginPath();
  ctx.moveTo(-2, -12);
  ctx.quadraticCurveTo(0, -9.5, 2, -12);
  ctx.strokeStyle = 'rgba(50, 35, 95, 0.4)';
  ctx.lineWidth = 1.0;
  ctx.stroke();

  ctx.restore();

  // 9. Power-up Overlays: Propeller Hat
  if (player.powerUp && player.powerUp.type === 'propeller') {
    drawPropellerHat(ctx, timeMs);
  }

  // 10. Shield Bubble
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
  ctx.translate(-5, -29);

  // Beanie cap
  ctx.beginPath();
  ctx.arc(0, 0, 9, Math.PI, 0, false);
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
