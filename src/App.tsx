import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameState, LevelData, PlayerState, GameStats } from './types';
import { LEVELS, getTotalFragmentsAvailable } from './game/levelsData';
import { GameRenderer } from './game/renderer';
import { PhysicsEngine } from './game/physics';
import { Camera } from './game/camera';
import { sound } from './audio/soundEngine';

// Puzzles
import { JigsawPuzzle } from './game/puzzles/JigsawPuzzle';
import { MazePuzzle } from './game/puzzles/MazePuzzle';
import { ChendaRhythmPuzzle } from './game/puzzles/ChendaRhythmPuzzle';
import { FinalPookalamPuzzle } from './game/puzzles/FinalPookalamPuzzle';

// UI Overlays
import { HUD } from './ui/HUD';
import { MainMenu } from './ui/MainMenu';
import { HowToPlayModal } from './ui/HowToPlayModal';
import { PauseMenu } from './ui/PauseMenu';
import { FailureMenu } from './ui/FailureMenu';
import { CelebrationScreen } from './ui/CelebrationScreen';
import { ResultsScreen } from './ui/ResultsScreen';
import { MobileControls } from './ui/MobileControls';
import { IntroStory } from './ui/IntroStory';
import { FinalPookalamUI } from './ui/FinalPookalamUI';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // High-level application state
  const [gameState, setGameState] = useState<GameState>('TITLE');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isFailed, setIsFailed] = useState<boolean>(false);
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.isMuted());
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const [, setPuzzleUiRevision] = useState<number>(0);

  // HUD stats for UI
  const [hudLives, setHudLives] = useState(3);
  const [hudFragments, setHudFragments] = useState(0);
  const [hudTotalFragments, setHudTotalFragments] = useState(4);
  const [hudPookalamPercent, setHudPookalamPercent] = useState(0);
  const [hudObjective, setHudObjective] = useState('');

  // Authoritative fragment tracking ref: Prevents duplicate counts across restarts/loops
  const collectedFragmentIdsRef = useRef<Set<string>>(new Set());
  // Single-fire guard for puzzle completions to prevent multiple frames from double-awarding stats
  const puzzleTransitionHandledRef = useRef<boolean>(false);

  // Overall game statistics
  const [gameStats, setGameStats] = useState<GameStats>(() => ({
    score: 0,
    fragmentsCollected: 0,
    totalFragments: getTotalFragmentsAvailable(),
    puzzlesCompleted: 0,
    totalPuzzles: 4,
    startTime: Date.now(),
    finishTime: Date.now(),
    collectedFragmentIds: [],
  }));

  // Level & Physics State Refs (to avoid re-triggering React loops)
  const currentLevelIdRef = useRef<number>(1);
  const levelDataRef = useRef<LevelData>(JSON.parse(JSON.stringify(LEVELS[1])));
  const playerRef = useRef<PlayerState>({
    x: 120,
    y: 500,
    vx: 0,
    vy: 0,
    width: 32,
    height: 64,
    grounded: true,
    facing: 'right',
    animState: 'idle',
    animTimer: 0,
    coyoteTimer: 0,
    jumpBufferTimer: 0,
    lives: 3,
    maxLives: 3,
  });

  const keysRef = useRef<{ left: boolean; right: boolean; jump: boolean; down: boolean }>({
    left: false,
    right: false,
    jump: false,
    down: false,
  });

  const physicsRef = useRef<PhysicsEngine>(new PhysicsEngine());
  const cameraRef = useRef<Camera>(new Camera(800, 600));
  const rendererRef = useRef<GameRenderer | null>(null);

  // Puzzle Instances
  const jigsawPuzzleRef = useRef<JigsawPuzzle | null>(null);
  const mazePuzzleRef = useRef<MazePuzzle | null>(null);
  const chendaPuzzleRef = useRef<ChendaRhythmPuzzle | null>(null);
  const finalPuzzleRef = useRef<FinalPookalamPuzzle | null>(null);

  // Drifting celebration particles
  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; rot: number; color: string }>>([]);

  // Detect touch
  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();
  }, []);

  // Update sound state
  const handleToggleMute = useCallback(() => {
    const nextMute = sound.toggleMute();
    setIsMuted(nextMute);
  }, []);

  // Helper to load a level
  const loadLevel = useCallback((levelId: number) => {
    currentLevelIdRef.current = levelId;
    const baseLevel = LEVELS[levelId];
    levelDataRef.current = JSON.parse(JSON.stringify(baseLevel));

    // Reset player position
    playerRef.current.x = baseLevel.playerStart.x;
    playerRef.current.y = baseLevel.playerStart.y;
    playerRef.current.vx = 0;
    playerRef.current.vy = 0;
    playerRef.current.grounded = true;
    playerRef.current.animState = 'idle';
    playerRef.current.lives = 3;

    setHudLives(3);
    setHudFragments(0);
    setHudTotalFragments(baseLevel.fragments.length);
    setHudObjective(baseLevel.objective);

    // Calculate restoration percentage: L1 -> 25%, L2 -> 50%, L3 -> 75%, L4 -> 100%
    const basePercent = (levelId - 1) * 25;
    setHudPookalamPercent(basePercent);

    sound.startAmbience(baseLevel.theme);
  }, []);

  // Launch specific game state
  const transitionToState = useCallback((nextState: GameState) => {
    puzzleTransitionHandledRef.current = false;
    setGameState(nextState);

    const w = window.innerWidth;
    const h = window.innerHeight;

    if (nextState === 'LEVEL_1') {
      loadLevel(1);
    } else if (nextState === 'PUZZLE_1') {
      jigsawPuzzleRef.current = new JigsawPuzzle(w, h);
      setHudObjective('Restore the First Floral Ring: Drag the pieces into place!');
    } else if (nextState === 'LEVEL_2') {
      loadLevel(2);
    } else if (nextState === 'PUZZLE_2') {
      mazePuzzleRef.current = new MazePuzzle(w, h);
      setHudObjective('Navigate the Temple Pathway: Safe path or collect bonus petals?');
    } else if (nextState === 'LEVEL_3') {
      loadLevel(3);
    } else if (nextState === 'PUZZLE_3') {
      chendaPuzzleRef.current = new ChendaRhythmPuzzle(w, h);
      setHudObjective('Chenda Melam Rhythm: Listen and repeat the drum pattern!');
    } else if (nextState === 'LEVEL_4') {
      loadLevel(4);
    } else if (nextState === 'PUZZLE_4') {
      finalPuzzleRef.current = new FinalPookalamPuzzle(w, h);
      finalPuzzleRef.current.setOnStateChange(() => setPuzzleUiRevision((r) => r + 1));
      setHudObjective('Arrange the Grand Pookalam: Select a flower and place in the matching ring!');
    } else if (nextState === 'CELEBRATION') {
      setHudPookalamPercent(100);
      // Spawn festival celebration petals
      particlesRef.current = Array.from({ length: 60 }).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 1.5,
        vy: 1.2 + Math.random() * 2,
        rot: Math.random() * Math.PI * 2,
        color: ['#f59e0b', '#ef4444', '#ec4899', '#fbbf24', '#f8fafc'][Math.floor(Math.random() * 5)],
      }));
    } else if (nextState === 'RESULTS') {
      setGameStats((prev) => ({
        ...prev,
        finishTime: Date.now(),
      }));
    }
  }, [loadLevel]);

  // Failure Handler: MANDATORY NON-NEGOTIABLE FREEZE & SHOW FAILURE MENU
  const handlePlayerFailure = useCallback(() => {
    sound.playFailure();
    setIsFailed(true);
  }, []);

  // Restart Current Level from Failure or Pause
  const handleRestartLevel = useCallback(() => {
    setIsFailed(false);
    setIsPaused(false);
    puzzleTransitionHandledRef.current = false;
    if (gameState === 'PUZZLE_4') {
      const w = window.innerWidth;
      const h = window.innerHeight;
      finalPuzzleRef.current = new FinalPookalamPuzzle(w, h);
      finalPuzzleRef.current.setOnStateChange(() => setPuzzleUiRevision((r) => r + 1));
      return;
    }
    const lvl = currentLevelIdRef.current;
    loadLevel(lvl);
    if (lvl === 1) transitionToState('LEVEL_1');
    else if (lvl === 2) transitionToState('LEVEL_2');
    else if (lvl === 3) transitionToState('LEVEL_3');
    else if (lvl === 4) transitionToState('LEVEL_4');
  }, [gameState, loadLevel, transitionToState]);

  // Keyboard controls listener
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Pause
      if (e.key === 'Escape') {
        if (!isFailed && (gameState.startsWith('LEVEL_') || gameState.startsWith('PUZZLE_'))) {
          setIsPaused((p) => !p);
        }
        return;
      }

      // Mute
      if (e.key === 'm' || e.key === 'M') {
        handleToggleMute();
        return;
      }

      // Jigsaw piece rotation via R or Space
      if ((e.key === 'r' || e.key === 'R' || e.key === ' ') && gameState === 'PUZZLE_1') {
        jigsawPuzzleRef.current?.rotateActivePiece();
        return;
      }

      // Final Pookalam Puzzle (PUZZLE_4): Prevent gameplay character movement & support 1-4 shortcuts
      if (gameState === 'PUZZLE_4') {
        if (['1', '2', '3', '4'].includes(e.key)) {
          const flowerIdx = parseInt(e.key, 10) - 1;
          finalPuzzleRef.current?.selectFlower(flowerIdx);
        }
        return;
      }

      // Gameplay keys: Strictly Arrow keys and Space
      if (e.key === 'ArrowLeft') {
        keysRef.current.left = true;
        if (gameState === 'PUZZLE_2' && mazePuzzleRef.current) {
          mazePuzzleRef.current.move(-1, 0);
        }
      } else if (e.key === 'ArrowRight') {
        keysRef.current.right = true;
        if (gameState === 'PUZZLE_2' && mazePuzzleRef.current) {
          mazePuzzleRef.current.move(1, 0);
        }
      } else if (e.key === 'ArrowUp' || e.key === ' ') {
        keysRef.current.jump = true;
        if (gameState === 'PUZZLE_2' && mazePuzzleRef.current) {
          mazePuzzleRef.current.move(0, -1);
        }
      } else if (e.key === 'ArrowDown') {
        keysRef.current.down = true;
        if (gameState === 'PUZZLE_2' && mazePuzzleRef.current) {
          mazePuzzleRef.current.move(0, 1);
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') keysRef.current.left = false;
      else if (e.key === 'ArrowRight') keysRef.current.right = false;
      else if (e.key === 'ArrowUp' || e.key === ' ') keysRef.current.jump = false;
      else if (e.key === 'ArrowDown') keysRef.current.down = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [gameState, isFailed, handleToggleMute]);

  // Pointer events on canvas for puzzles (Jigsaw drag/drop, Maze tap, Chenda tap, Final Pookalam)
  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}

    if (gameState === 'PUZZLE_1' && jigsawPuzzleRef.current) {
      jigsawPuzzleRef.current.handlePointerDown(x, y);
    } else if (gameState === 'PUZZLE_2' && mazePuzzleRef.current) {
      mazePuzzleRef.current.handlePointerDown(x, y);
    } else if (gameState === 'PUZZLE_3' && chendaPuzzleRef.current) {
      chendaPuzzleRef.current.handlePointerDown(x, y);
    } else if (gameState === 'PUZZLE_4' && finalPuzzleRef.current) {
      finalPuzzleRef.current.handlePointerDown(x, y);
    }
  };

  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (gameState === 'PUZZLE_1' && jigsawPuzzleRef.current) {
      jigsawPuzzleRef.current.handlePointerMove(x, y);
    }
  };

  const handleCanvasPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}

    if (gameState === 'PUZZLE_1' && jigsawPuzzleRef.current) {
      jigsawPuzzleRef.current.handlePointerUp();
    }
  };

  // Main 60 FPS Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    rendererRef.current = new GameRenderer(ctx);

    let animationFrameId: number;
    let lastTime = performance.now();

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
      cameraRef.current.resize(width, height);
      if (jigsawPuzzleRef.current) jigsawPuzzleRef.current.resize(width, height);
      if (mazePuzzleRef.current) mazePuzzleRef.current.reset(width, height);
      if (chendaPuzzleRef.current) chendaPuzzleRef.current.reset(width, height);
      if (finalPuzzleRef.current) finalPuzzleRef.current.resize(width, height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
      lastTime = currentTime;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const renderer = rendererRef.current;

      if (renderer) {
        renderer.clear(width, height);

        // --- PLATFORMER LEVELS (LEVEL_1 to LEVEL_4) ---
        if (gameState.startsWith('LEVEL_') && !isPaused && !isFailed) {
          const level = levelDataRef.current;
          const player = playerRef.current;

          // Goal Reached callback
          const onGoalReached = () => {
            const allCollected = level.fragments.every((f) => f.collected);
            if (allCollected) {
              sound.playTempleBell(880);
              // Progress to corresponding puzzle!
              if (level.id === 1) transitionToState('PUZZLE_1');
              else if (level.id === 2) transitionToState('PUZZLE_2');
              else if (level.id === 3) transitionToState('PUZZLE_3');
              else if (level.id === 4) transitionToState('PUZZLE_4');
            }
          };

          // Update physics
          physicsRef.current.updatePlayer(
            player,
            level,
            keysRef.current,
            dt,
            handlePlayerFailure,
            onGoalReached
          );

          // Check fragment pickups
          level.fragments.forEach((frag, idx) => {
            if (!frag.collected) {
              const overlap =
                player.x + player.width > frag.x &&
                player.x < frag.x + frag.width &&
                player.y + player.height > frag.y &&
                player.y < frag.y + frag.height;

              if (overlap) {
                frag.collected = true;
                sound.playPetalPickup(idx);

                // Authoritative fragment tracking:
                // Only increment global fragments and score if this unique fragment ID was not collected before!
                const isAlreadyCollected = collectedFragmentIdsRef.current.has(frag.id);
                if (!isAlreadyCollected) {
                  collectedFragmentIdsRef.current.add(frag.id);
                  setGameStats((prev) => ({
                    ...prev,
                    score: prev.score + 250,
                    fragmentsCollected: collectedFragmentIdsRef.current.size,
                    collectedFragmentIds: Array.from(collectedFragmentIdsRef.current),
                  }));
                }

                const count = level.fragments.filter((f) => f.collected).length;
                setHudFragments(count);
              }
            }
          });

          // Camera follow
          cameraRef.current.update(
            player.x + player.width * 0.5,
            player.y + player.height * 0.5,
            level.worldWidth,
            level.worldHeight
          );

          // Draw Sky & Parallax background
          renderer.drawSky(level.theme, width, height, cameraRef.current.x);

          // Draw in World Coordinates
          ctx.save();
          ctx.translate(-cameraRef.current.x, -cameraRef.current.y);

          // Scenery
          renderer.drawScenery(level.scenery, currentTime);

          // Platforms
          renderer.drawPlatforms(level.platforms, currentTime);

          // Collectibles
          renderer.drawFragments(level.fragments, currentTime);

          // Goal Area
          const allFragmentsFound = level.fragments.every((f) => f.collected);
          renderer.drawGoalArea(level.goalArea, currentTime, allFragmentsFound);

          // Player (King Maveli)
          renderer.drawPlayer(player, currentTime);

          ctx.restore();
        }

        // --- PUZZLE 1: JIGSAW ---
        else if (gameState === 'PUZZLE_1' && jigsawPuzzleRef.current) {
          const jigsaw = jigsawPuzzleRef.current;
          jigsaw.update(dt);
          renderer.drawSky('village', width, height, 0);
          jigsaw.render(ctx, currentTime);

          // Auto-advance on completion (single-fire transition guard)
          if (jigsaw.isCompleted && jigsaw.completionTimer > 2.0 && !puzzleTransitionHandledRef.current) {
            puzzleTransitionHandledRef.current = true;
            setGameStats((prev) => ({
              ...prev,
              score: prev.score + 1000,
              puzzlesCompleted: prev.puzzlesCompleted + 1,
            }));
            transitionToState('LEVEL_2');
          }
        }

        // --- PUZZLE 2: MAZE ---
        else if (gameState === 'PUZZLE_2' && mazePuzzleRef.current) {
          const maze = mazePuzzleRef.current;
          maze.update(dt);
          renderer.drawSky('paddy', width, height, 0);
          maze.render(ctx, currentTime);

          if (maze.isCompleted && !puzzleTransitionHandledRef.current) {
            puzzleTransitionHandledRef.current = true;
            // Bonus maze items award bonus score points only and never affect platformer fragments
            setGameStats((prev) => ({
              ...prev,
              score: prev.score + 1000 + maze.bonusFragmentsCollected * 500,
              puzzlesCompleted: prev.puzzlesCompleted + 1,
            }));
            transitionToState('LEVEL_3');
          }
        }

        // --- PUZZLE 3: CHENDA RHYTHM ---
        else if (gameState === 'PUZZLE_3' && chendaPuzzleRef.current) {
          const chenda = chendaPuzzleRef.current;
          chenda.update(dt);
          renderer.drawSky('backwaters', width, height, 0);
          chenda.render(ctx, currentTime);

          if (chenda.isCompleted && !puzzleTransitionHandledRef.current) {
            puzzleTransitionHandledRef.current = true;
            setGameStats((prev) => ({
              ...prev,
              score: prev.score + 1000,
              puzzlesCompleted: prev.puzzlesCompleted + 1,
            }));
            setTimeout(() => {
              transitionToState('LEVEL_4');
            }, 1200);
          }
        }

        // --- PUZZLE 4: FINAL POOKALAM ---
        else if (gameState === 'PUZZLE_4' && finalPuzzleRef.current) {
          const finalPookalam = finalPuzzleRef.current;
          if (!isPaused) {
            finalPookalam.update(dt);
          }
          renderer.drawSky('festival', width, height, 0);
          finalPookalam.render(ctx, currentTime);

          if (finalPookalam.isCompleted && finalPookalam.completionTimer > 2.8 && !puzzleTransitionHandledRef.current) {
            puzzleTransitionHandledRef.current = true;
            setGameStats((prev) => ({
              ...prev,
              score: prev.score + 2500,
              puzzlesCompleted: prev.puzzlesCompleted + 1,
            }));
            transitionToState('CELEBRATION');
          }
        }

        // --- CELEBRATION SCREEN CANVAS BACKGROUND (Drifting Petals & Golden Glow) ---
        else if (gameState === 'CELEBRATION') {
          renderer.drawSky('festival', width, height, 0);

          // Drifting flower petals
          for (const p of particlesRef.current) {
            p.x += p.vx;
            p.y += p.vy;
            p.rot += 0.02;
            if (p.y > height + 20) {
              p.y = -20;
              p.x = Math.random() * width;
            }

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, 8, 4, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }

        // --- TITLE SCREEN ATMOSPHERE ---
        else if (gameState === 'TITLE' || gameState === 'HOW_TO_PLAY' || gameState === 'INTRO') {
          renderer.drawTitleScene(width, height, currentTime);
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [gameState, isPaused, isFailed, handlePlayerFailure, transitionToState]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#1b1510] select-none touch-none">
      {/* Primary HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handleCanvasPointerDown}
        onPointerMove={handleCanvasPointerMove}
        onPointerUp={handleCanvasPointerUp}
        className="w-full h-full block cursor-pointer"
      />

      {/* HUD (Displayed during platforming levels & puzzles) */}
      {(gameState.startsWith('LEVEL_') || gameState.startsWith('PUZZLE_')) && (
        <HUD
          lives={hudLives}
          maxLives={3}
          objective={hudObjective}
          fragmentsCollected={hudFragments}
          totalFragments={hudTotalFragments}
          pookalamPercent={hudPookalamPercent}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onPause={() => setIsPaused(true)}
        />
      )}

      {/* Touch Mobile Controls */}
      {isTouchDevice && (gameState.startsWith('LEVEL_') || gameState === 'PUZZLE_2') && !isPaused && !isFailed && (
        <MobileControls
          isMaze={gameState === 'PUZZLE_2'}
          onLeftDown={() => {
            keysRef.current.left = true;
            if (gameState === 'PUZZLE_2' && mazePuzzleRef.current) mazePuzzleRef.current.move(-1, 0);
          }}
          onLeftUp={() => { keysRef.current.left = false; }}
          onRightDown={() => {
            keysRef.current.right = true;
            if (gameState === 'PUZZLE_2' && mazePuzzleRef.current) mazePuzzleRef.current.move(1, 0);
          }}
          onRightUp={() => { keysRef.current.right = false; }}
          onJumpDown={() => {
            keysRef.current.jump = true;
          }}
          onJumpUp={() => { keysRef.current.jump = false; }}
          onUpDown={() => {
            if (gameState === 'PUZZLE_2' && mazePuzzleRef.current) mazePuzzleRef.current.move(0, -1);
          }}
          onDownDown={() => {
            if (gameState === 'PUZZLE_2' && mazePuzzleRef.current) mazePuzzleRef.current.move(0, 1);
          }}
        />
      )}

      {/* Action Bar for Level 1 Jigsaw Puzzle */}
      {gameState === 'PUZZLE_1' && jigsawPuzzleRef.current && (
        <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center items-center px-4 pointer-events-auto">
          <div className="flex items-center gap-3 px-4 py-2 bg-[#201209]/90 border border-[#d4af37]/70 rounded-full shadow-lg backdrop-blur-xs">
            <button
              onClick={() => jigsawPuzzleRef.current?.rotateActivePiece()}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4a2814] hover:bg-[#6b3a1d] text-[#ffd700] border border-[#d4af37] text-xs font-kerala-title font-bold tracking-wider cursor-pointer active:scale-95 transition-all shadow-md"
            >
              <span>↻ ROTATE PIECE</span>
              <span className="hidden sm:inline text-[10px] text-[#e8d8b5] font-normal">[Tap / Space]</span>
            </button>
          </div>
        </div>
      )}

      {/* Final Pookalam Puzzle UI (Puzzle 4) */}
      {gameState === 'PUZZLE_4' && finalPuzzleRef.current && (
        <FinalPookalamUI
          puzzle={finalPuzzleRef.current}
          onSelectFlower={(id) => {
            finalPuzzleRef.current?.selectFlower(id);
          }}
        />
      )}

      {/* Title / Main Menu */}
      {gameState === 'TITLE' && (
        <MainMenu
          onStart={() => transitionToState('INTRO')}
          onHowToPlay={() => setShowHowToPlay(true)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* Intro Story Prologue */}
      {gameState === 'INTRO' && (
        <IntroStory
          onContinue={() => {
            collectedFragmentIdsRef.current.clear();
            setGameStats({
              score: 0,
              fragmentsCollected: 0,
              totalFragments: getTotalFragmentsAvailable(),
              puzzlesCompleted: 0,
              totalPuzzles: 4,
              startTime: Date.now(),
              finishTime: Date.now(),
              collectedFragmentIds: [],
            });
            transitionToState('LEVEL_1');
          }}
        />
      )}

      {/* How to Play Modal */}
      {showHowToPlay && (
        <HowToPlayModal onClose={() => setShowHowToPlay(false)} />
      )}

      {/* Pause Menu */}
      {isPaused && (
        <PauseMenu
          onResume={() => setIsPaused(false)}
          onRestartLevel={handleRestartLevel}
          onHowToPlay={() => setShowHowToPlay(true)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onMainMenu={() => {
            setIsPaused(false);
            collectedFragmentIdsRef.current.clear();
            transitionToState('TITLE');
          }}
        />
      )}

      {/* Failure Menu (MANDATORY ZERO-RESPAWN FREEZE) */}
      {isFailed && (
        <FailureMenu
          onRestartLevel={handleRestartLevel}
          onMainMenu={() => {
            setIsFailed(false);
            collectedFragmentIdsRef.current.clear();
            transitionToState('TITLE');
          }}
        />
      )}

      {/* Celebration Screen */}
      {gameState === 'CELEBRATION' && (
        <CelebrationScreen onComplete={() => transitionToState('RESULTS')} />
      )}

      {/* Results Screen */}
      {gameState === 'RESULTS' && (
        <ResultsScreen
          stats={gameStats}
          onPlayAgain={() => {
            collectedFragmentIdsRef.current.clear();
            setGameStats({
              score: 0,
              fragmentsCollected: 0,
              totalFragments: getTotalFragmentsAvailable(),
              puzzlesCompleted: 0,
              totalPuzzles: 4,
              startTime: Date.now(),
              finishTime: Date.now(),
              collectedFragmentIds: [],
            });
            transitionToState('LEVEL_1');
          }}
          onMainMenu={() => {
            collectedFragmentIdsRef.current.clear();
            transitionToState('TITLE');
          }}
        />
      )}
    </main>
  );
}
