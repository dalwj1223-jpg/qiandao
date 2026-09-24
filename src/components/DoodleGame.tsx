import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  initGame,
  updateGame,
  shootProjectile,
  GameStateData,
  GAME_WIDTH,
  GAME_HEIGHT,
} from '../gameEngine';
import { drawBackground, drawPlatform, drawMonster, drawProjectile, drawParticle } from './worldRenderer';
import { drawRibbonCharacter } from './characterRenderer';
import { sound } from '../audio';
import {
  Volume2,
  VolumeX,
  Pause,
  Play,
  RotateCcw,
  Trophy,
  ArrowLeft,
  ArrowRight,
  Crosshair,
  AlertTriangle,
  Sparkles,
  LifeBuoy,
  BookOpen,
  X,
} from 'lucide-react';
import { QiandaoLogo } from './QiandaoLogo';

export const DoodleGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameStateRef = useRef<GameStateData>(initGame());

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => gameStateRef.current.highScore);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState<'fall' | 'monster' | 'trap'>('fall');
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(() => sound.isMuted());
  const [hasStarted, setHasStarted] = useState(false);
  const [showRules, setShowRules] = useState(false);

  // Input states
  const keysRef = useRef({ left: false, right: false });
  const pointerXRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const animationFrameRef = useRef<number | null>(null);

  // Restart game
  const handleRestart = useCallback(() => {
    gameStateRef.current = initGame();
    setScore(0);
    setHighScore(gameStateRef.current.highScore);
    setIsGameOver(false);
    setGameOverReason('fall');
    setIsPaused(false);
    setHasStarted(true);
    lastTimeRef.current = performance.now();
  }, []);

  // Toggle pause
  const handleTogglePause = useCallback(() => {
    if (isGameOver || !hasStarted) return;
    setIsPaused((prev) => {
      const next = !prev;
      gameStateRef.current.paused = next;
      return next;
    });
  }, [isGameOver, hasStarted]);

  // Toggle mute
  const handleToggleMute = useCallback(() => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  }, []);

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        keysRef.current.left = true;
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        keysRef.current.right = true;
      } else if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        if (!hasStarted) {
          handleRestart();
          return;
        }
        if (gameStateRef.current.gameOver) {
          handleRestart();
          return;
        }
        shootProjectile(gameStateRef.current);
      } else if (e.code === 'KeyP') {
        handleTogglePause();
      } else if (e.code === 'KeyM') {
        handleToggleMute();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        keysRef.current.left = false;
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        keysRef.current.right = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [hasStarted, handleRestart, handleTogglePause, handleToggleMute]);

  // Canvas interaction handlers (Pointer & Touch for mobile/desktop)
  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!hasStarted || isGameOver) {
      handleRestart();
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const scaleX = GAME_WIDTH / rect.width;
    const scaleY = GAME_HEIGHT / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    // Shoot projectile towards click
    shootProjectile(gameStateRef.current, clickX, clickY);
  };

  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!hasStarted || isGameOver || isPaused) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = GAME_WIDTH / rect.width;
    const pointerGameX = (e.clientX - rect.left) * scaleX;
    pointerXRef.current = pointerGameX;
  };

  const handleCanvasPointerLeave = () => {
    pointerXRef.current = null;
  };

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let mounted = true;

    const loop = (time: number) => {
      if (!mounted) return;

      const deltaMs = Math.min(time - lastTimeRef.current, 60);
      lastTimeRef.current = time;
      const deltaRatio = deltaMs / 16.6;

      const state = gameStateRef.current;

      if (hasStarted && !state.paused && !state.gameOver) {
        updateGame(state, keysRef.current, pointerXRef.current, deltaRatio);

        // Periodically sync React UI state
        setScore(state.score);
        if (state.score > state.highScore) {
          setHighScore(state.score);
        }
        if (state.gameOver) {
          setIsGameOver(true);
          setGameOverReason(state.gameOverReason || 'fall');
        }
      }

      // Draw Everything
      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      // 1. Summer Pool & Resort Background
      drawBackground(ctx, GAME_WIDTH, GAME_HEIGHT, state.cameraY, state.stars, time);

      // 2. Platforms & Mounted Items
      state.platforms.forEach((p) => {
        drawPlatform(ctx, p, time);
      });

      // 3. Monsters
      state.monsters.forEach((m) => {
        drawMonster(ctx, m, time);
      });

      // 4. Projectiles
      state.projectiles.forEach((proj) => {
        drawProjectile(ctx, proj);
      });

      // 5. Particles
      state.particles.forEach((pt) => {
        drawParticle(ctx, pt);
      });

      // 6. Character (video13 purple ribbon with squash & stretch jump)
      drawRibbonCharacter(ctx, state.player, time);

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      mounted = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [hasStarted]);

  return (
    <div className="relative flex flex-col items-center select-none w-full max-w-[375px]">
      {/* 375x812 Mobile Screen Container (Image 1 Summer Theme) */}
      <div
        id="mobile-game-viewport"
        className="relative w-full overflow-hidden rounded-[32px] shadow-2xl border-[6px] border-sky-300/80 bg-sky-900"
        style={{
          width: '375px',
          height: '812px',
          maxWidth: '100%',
          aspectRatio: '375 / 812',
        }}
      >
        {/* Top Status Bar (Image 1 Mobile UI: 9:41 & Signal/Battery) */}
        <div className="absolute top-2 left-4 right-4 z-20 flex items-center justify-between text-[12px] font-bold text-slate-900/80 pointer-events-none select-none">
          <span>9:41</span>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span>􀙇</span>
            <span>􀀂</span>
            <div className="w-5 h-2.5 rounded-[3px] border border-slate-900/80 p-[1px] flex items-center">
              <div className="w-3.5 h-full bg-slate-900/80 rounded-[1px]" />
            </div>
          </div>
        </div>

        {/* Top Controls: Pause, Rules, Sound (Image 1 Frosted Circular Buttons) */}
        <div className="absolute top-8 left-3.5 right-3.5 z-20 flex items-center justify-between pointer-events-none">
          {/* Left Controls: Pause & Rules */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              id="toggle-pause-btn"
              onClick={handleTogglePause}
              className="w-9 h-9 rounded-full bg-slate-900/40 hover:bg-slate-900/55 text-white flex items-center justify-center shadow-md border border-white/30 backdrop-blur-md transition cursor-pointer active:scale-90"
              title={isPaused ? '继续' : '暂停'}
            >
              {isPaused ? <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" /> : <Pause className="w-4 h-4 text-white fill-white" />}
            </button>
            <button
              id="top-rules-btn"
              onClick={() => {
                if (hasStarted && !isPaused && !isGameOver) {
                  setIsPaused(true);
                }
                setShowRules(true);
              }}
              className="w-9 h-9 rounded-full bg-slate-900/40 hover:bg-slate-900/55 text-white flex items-center justify-center shadow-md border border-white/30 backdrop-blur-md transition cursor-pointer active:scale-90"
              title="查看玩法规则"
            >
              <BookOpen className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Right Controls: Sound & More */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              id="toggle-sound-btn"
              onClick={handleToggleMute}
              className="w-9 h-9 rounded-full bg-slate-900/40 hover:bg-slate-900/55 text-white flex items-center justify-center shadow-md border border-white/30 backdrop-blur-md transition cursor-pointer active:scale-90"
              title={isMuted ? '开启声音' : '静音'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-white" />}
            </button>
            <div className="w-9 h-9 rounded-full bg-slate-900/40 text-white flex items-center justify-center shadow-md border border-white/30 backdrop-blur-md font-bold tracking-widest text-xs">
              •••
            </div>
          </div>
        </div>

        {/* Height Score in Exact Image 1 Position (Top-Right under sound button: 0米) */}
        <div className="absolute top-20 right-4 z-20 pointer-events-none flex flex-col items-end">
          <div className="flex items-baseline gap-0.5">
            <span className="text-3xl font-black tracking-tight text-slate-950 drop-shadow-[0_1px_3px_rgba(255,255,255,0.9)]">
              {score}
            </span>
            <span className="text-sm font-black text-slate-900 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">米</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-sky-950 bg-white/70 px-2 py-0.5 rounded-full shadow-xs border border-white/80 backdrop-blur-xs mt-0.5">
            <Trophy className="w-2.5 h-2.5 text-amber-500" />
            <span>最高: {highScore}米</span>
          </div>
        </div>

        {/* Active Red Trap Alert Indicator (When high altitude) */}
        {score > 320 && (
          <div className="absolute top-14 right-3.5 z-20 pointer-events-none flex items-center gap-1 bg-red-600/85 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-300/70 shadow-md animate-pulse">
            <AlertTriangle className="w-3 h-3 text-amber-300" />
            <span>陷阱方块出现!</span>
          </div>
        )}

        {/* HTML5 Game Canvas (375x812) */}
        <canvas
          id="ribbon-game-canvas"
          ref={canvasRef}
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
          onPointerDown={handleCanvasPointerDown}
          onPointerMove={handleCanvasPointerMove}
          onPointerLeave={handleCanvasPointerLeave}
          className="w-full h-full block touch-none cursor-crosshair"
        />

        {/* Start / Intro Screen Overlay (Image 1 Summer Pool Party Theme) */}
        {!hasStarted && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-between bg-gradient-to-b from-sky-400/90 via-sky-600/90 to-blue-800/95 backdrop-blur-md p-6 text-center">
            {/* Top decorative badge */}
            <div className="mt-6 flex flex-col items-center">
              <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-white/90 text-sky-800 font-bold text-xs shadow-lg border border-white/70 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>千岛水上乐园 · 375×812 适配</span>
              </div>

              {/* Qiandao Official Brand Logo (Figure 1) */}
              <div className="relative mb-3 flex items-center justify-center">
                <QiandaoLogo size={108} shadow={true} className="hover:scale-105 transition-transform duration-300" />
                <div className="absolute -bottom-2 -right-1 text-2xl filter drop-shadow-md animate-bounce">
                  🛟
                </div>
              </div>

              <h1 className="text-3xl font-black text-white tracking-wider drop-shadow-md mb-0.5">
                千岛
              </h1>
              <div className="inline-block px-3 py-0.5 rounded-full bg-amber-400/90 text-amber-950 font-black text-xs shadow-sm mb-1.5">
                夏日跳跳乐
              </div>
              <p className="text-xs text-sky-100/90 max-w-[260px] leading-relaxed mb-2">
                操纵可爱的淡紫色丝带角色，利用水流浮板一路向上飞跃！
              </p>

              {/* Quick Rules Entry Button */}
              <button
                id="open-rules-badge-btn"
                onClick={() => setShowRules(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/25 hover:bg-white/35 text-white font-bold text-xs border border-white/40 shadow-xs transition backdrop-blur-md cursor-pointer active:scale-95"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                <span>查看游戏规则</span>
              </button>
            </div>

            {/* Actions: Start Game & Rules Button */}
            <div className="w-full space-y-2.5 mb-6 px-1">
              <button
                id="start-game-btn"
                onClick={handleRestart}
                className="w-full py-4 bg-gradient-to-b from-rose-400 via-rose-500 to-rose-600 hover:from-rose-300 hover:to-rose-500 text-white font-black text-base tracking-wider rounded-2xl shadow-[0_6px_0_#9F1239,0_10px_20px_rgba(244,63,94,0.45)] active:translate-y-1 active:shadow-[0_2px_0_#9F1239] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>☀️ 开始夏日跳跳乐 ☀️</span>
              </button>

              <button
                id="open-rules-btn"
                onClick={() => setShowRules(true)}
                className="w-full py-2.5 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl border border-white/40 backdrop-blur-md transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-98 shadow-sm"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                <span>夏日特色跳板 & 道具规则</span>
              </button>
            </div>
          </div>
        )}

        {/* Summer Rules & Mechanics Modal Dialog */}
        {showRules && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-[335px] bg-white rounded-3xl p-4 shadow-2xl border-2 border-sky-100 flex flex-col max-h-[92%] overflow-y-auto text-left">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-sky-100 pb-2.5 mb-3">
                <div className="flex items-center gap-1.5 text-sky-900 font-black text-sm">
                  <LifeBuoy className="w-4 h-4 text-rose-500" />
                  <span>夏日特色跳板 & 道具</span>
                </div>
                <button
                  id="close-rules-btn"
                  onClick={() => setShowRules(false)}
                  className="w-7 h-7 rounded-full bg-sky-100 hover:bg-sky-200 text-sky-800 flex items-center justify-center transition cursor-pointer active:scale-90"
                  title="关闭"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Exact content from user's image */}
              <div className="space-y-3 text-[11px] text-sky-950">
                {/* 1. Summer Platform Styles (Image 1 Theme) */}
                <div>
                  <div className="font-bold text-xs text-sky-800 mb-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span>🫧</span>
                      <span>图一特色水上浮台</span>
                    </div>
                    <span className="text-[10px] font-semibold text-sky-600 bg-sky-100/80 px-2 py-0.5 rounded-full">
                      清凉水乐园拼装浮台
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="bg-sky-50/90 p-2 rounded-xl border border-sky-200/80 flex items-center gap-1.5 ring-1 ring-sky-300/60">
                      <span className="text-lg">🌊</span>
                      <div>
                        <div className="font-bold text-sky-950 text-[11px]">蓝色模块浮台</div>
                        <div className="text-[10px] text-sky-700 font-medium">图一经典拼装跳板</div>
                      </div>
                    </div>
                    <div className="bg-amber-50/90 p-2 rounded-xl border border-amber-100 flex items-center gap-1.5">
                      <span className="text-base">🍋</span>
                      <div>
                        <div className="font-bold text-amber-900 text-[11px]">鲜黄柠檬点缀</div>
                        <div className="text-[10px] text-amber-700">边缘柠檬半片装饰</div>
                      </div>
                    </div>
                    <div className="bg-emerald-50/90 p-2 rounded-xl border border-emerald-100 flex items-center gap-1.5">
                      <span className="text-base">🍈</span>
                      <div>
                        <div className="font-bold text-emerald-900 text-[11px]">青柠薄荷切片</div>
                        <div className="text-[10px] text-emerald-700">清爽青柠+鲜薄荷嫩叶</div>
                      </div>
                    </div>
                    <div className="bg-rose-50/90 p-2 rounded-xl border border-rose-100 flex items-center gap-1.5">
                      <span className="text-base">⚠️</span>
                      <div>
                        <div className="font-bold text-rose-900 text-[11px]">红色尖刺陷阱</div>
                        <div className="text-[10px] text-rose-700">尖刺警示！踩中即失败</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Items & Power-ups */}
                <div>
                  <div className="font-bold text-xs text-sky-800 mb-1.5 flex items-center gap-1">
                    <span>✨</span>
                    <span>清凉道具说明</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                    <div className="bg-amber-50/80 border border-amber-200/80 p-1.5 rounded-lg flex items-center gap-1">
                      <span>⭐️</span>
                      <span><strong>弹力海星:</strong> 超高弹跳</span>
                    </div>
                    <div className="bg-sky-50/80 border border-sky-200/80 p-1.5 rounded-lg flex items-center gap-1">
                      <span>🫧</span>
                      <span><strong>泡泡旋翼:</strong> 空中飞升</span>
                    </div>
                    <div className="bg-rose-50/80 border border-rose-200/80 p-1.5 rounded-lg flex items-center gap-1">
                      <span>🚀</span>
                      <span><strong>水流喷气:</strong> 极速喷射</span>
                    </div>
                    <div className="bg-purple-50/80 border border-purple-200/80 p-1.5 rounded-lg flex items-center gap-1">
                      <span>🛟</span>
                      <span><strong>救生圈:</strong> 免疫1次陷阱</span>
                    </div>
                  </div>
                </div>

                {/* 3. High Difficulty Trap Hazard Warning */}
                <div className="bg-rose-50 border border-rose-300 rounded-xl p-2.5 flex items-start gap-2 text-rose-800">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-tight">
                    <strong className="text-rose-700 text-xs">高难度陷阱提示:</strong>
                    <br />
                    高度上升后将出现<span className="font-bold text-rose-600">红色尖刺方块</span>！踩到立即淘汰，请注意避开！
                  </div>
                </div>

                {/* 4. Controls Tip */}
                <div className="bg-sky-50/90 rounded-xl p-2.5 text-[10px] text-sky-800 leading-relaxed border border-sky-100">
                  <strong className="text-sky-950 font-bold">基础操作: </strong>
                  触控左右拖拽或使用键盘 <span className="font-bold text-sky-950">A / D (← / →)</span> 移动，点击屏幕或按<span className="font-bold text-sky-950">空格</span>发射水弹消灭海怪。角色触碰跳板瞬间会自动轻快弹跳！
                </div>
              </div>

              {/* Confirm / Close Button */}
              <button
                id="confirm-rules-btn"
                onClick={() => setShowRules(false)}
                className="mt-3.5 w-full py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer active:scale-95 text-center"
              >
                我知道了，去挑战！
              </button>
            </div>
          </div>
        )}

        {/* Pause Overlay */}
        {isPaused && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-sky-950/85 backdrop-blur-md p-6 text-center">
            <div className="text-4xl mb-2">🏖️</div>
            <h2 className="text-2xl font-black text-white mb-4">游戏暂停中</h2>
            <button
              id="resume-btn"
              onClick={handleTogglePause}
              className="px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-black rounded-xl shadow-lg transition cursor-pointer active:scale-95"
            >
              继续冒险
            </button>
          </div>
        )}

        {/* Summer Game Over Screen with Specific Failure Reason */}
        {isGameOver && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-sky-950/90 backdrop-blur-md p-6 text-center animate-in fade-in duration-300">
            {/* Failure reason badge */}
            {gameOverReason === 'trap' ? (
              <div className="mb-3 px-3.5 py-1.5 rounded-full bg-rose-500/25 border-2 border-rose-400 text-rose-300 text-xs font-black flex items-center gap-1.5 shadow-lg shadow-rose-600/30 animate-bounce">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>踩中了红色尖刺陷阱方块！</span>
              </div>
            ) : gameOverReason === 'monster' ? (
              <div className="mb-3 px-3.5 py-1.5 rounded-full bg-amber-500/25 border-2 border-amber-400 text-amber-200 text-xs font-black flex items-center gap-1.5 shadow-lg shadow-amber-600/30">
                <span>🦀 撞到了海洋小水怪！</span>
              </div>
            ) : (
              <div className="mb-3 px-3.5 py-1.5 rounded-full bg-sky-500/25 border-2 border-sky-400 text-sky-200 text-xs font-black flex items-center gap-1.5">
                <span>🌊 掉入深水中！</span>
              </div>
            )}

            <div className="text-4xl mb-1">{gameOverReason === 'trap' ? '💥' : '🏊'}</div>
            <h2 className="text-3xl font-black text-white font-mono mb-1">
              {score} <span className="text-sm font-normal text-sky-300">米</span>
            </h2>

            {score >= highScore && score > 0 ? (
              <div className="text-xs font-bold text-amber-300 bg-amber-500/30 px-3.5 py-1 rounded-full border border-amber-400/50 mb-6 animate-pulse">
                🏆 刷新最高纪录！
              </div>
            ) : (
              <div className="text-xs text-sky-200/90 mb-6">
                历史最高: {highScore} 米
              </div>
            )}

            {/* Coral Pink 3D Retry Button (Image 1 Style) */}
            <button
              id="play-again-btn"
              onClick={handleRestart}
              className="w-full max-w-[260px] py-3.5 bg-gradient-to-b from-rose-400 via-rose-500 to-rose-600 hover:from-rose-300 hover:to-rose-500 text-white font-black rounded-2xl shadow-[0_5px_0_#9F1239,0_8px_16px_rgba(244,63,94,0.4)] active:translate-y-1 active:shadow-[0_2px_0_#9F1239] text-sm tracking-wide transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>再玩一次 (SPACE)</span>
            </button>
          </div>
        )}
      </div>

      {/* On-screen Touch Controls for 375px Mobile Screen */}
      <div className="w-full flex items-center justify-between gap-2.5 mt-3 px-1">
        <button
          id="btn-move-left"
          onPointerDown={() => (keysRef.current.left = true)}
          onPointerUp={() => (keysRef.current.left = false)}
          onPointerLeave={() => (keysRef.current.left = false)}
          className="flex-1 py-3 bg-white/90 active:bg-sky-100 text-sky-800 rounded-2xl border-2 border-sky-300/80 flex items-center justify-center shadow-lg transition touch-none cursor-pointer active:scale-95"
          title="向左移动"
        >
          <ArrowLeft className="w-6 h-6 text-sky-700" />
        </button>

        <button
          id="btn-shoot"
          onClick={() => shootProjectile(gameStateRef.current)}
          className="flex-[1.4] py-3 bg-gradient-to-r from-rose-500 to-pink-500 active:from-rose-600 active:to-pink-600 text-white rounded-2xl border-2 border-rose-300 flex items-center justify-center gap-1.5 shadow-lg shadow-rose-500/30 transition touch-none cursor-pointer active:scale-95 text-xs font-black"
          title="发射水气球消灭怪物"
        >
          <Crosshair className="w-4 h-4 text-amber-300" />
          <span>发射水球</span>
        </button>

        <button
          id="btn-move-right"
          onPointerDown={() => (keysRef.current.right = true)}
          onPointerUp={() => (keysRef.current.right = false)}
          onPointerLeave={() => (keysRef.current.right = false)}
          className="flex-1 py-3 bg-white/90 active:bg-sky-100 text-sky-800 rounded-2xl border-2 border-sky-300/80 flex items-center justify-center shadow-lg transition touch-none cursor-pointer active:scale-95"
          title="向右移动"
        >
          <ArrowRight className="w-6 h-6 text-sky-700" />
        </button>
      </div>
    </div>
  );
};
