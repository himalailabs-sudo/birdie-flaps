import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Bird from "./Bird";
import Pipe from "./Pipe";
import Cloud from "./Cloud";
import Ground from "./Ground";
import ScoreDisplay from "./ScoreDisplay";
import GameOverlay from "./GameOverlay";

// Game constants
const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const GRAVITY = 0.25;
const FLAP_STRENGTH = -5.5;
const PIPE_SPEED = 2.5;
const PIPE_WIDTH = 80;
const PIPE_GAP = 180;
const PIPE_INTERVAL = 200;
const BIRD_SIZE = 48;
const BIRD_X = 100;
const GROUND_HEIGHT = 96;

interface PipeData {
  x: number;
  gapY: number;
  passed: boolean;
}

interface CloudData {
  x: number;
  y: number;
  scale: number;
  speed: number;
}

const FlappyBirdGame = () => {
  const [gameState, setGameState] = useState<"idle" | "countdown" | "playing" | "gameover">("idle");
  const [countdown, setCountdown] = useState(3);
  const [birdY, setBirdY] = useState(GAME_HEIGHT / 2 - BIRD_SIZE / 2);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState<PipeData[]>([]);
  const [clouds, setClouds] = useState<CloudData[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("flappyHighScore");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [groundOffset, setGroundOffset] = useState(0);

  const gameLoopRef = useRef<number>();
  const pipeTimerRef = useRef(0);
  const countdownRef = useRef<NodeJS.Timeout>();

  // Calculate bird rotation based on velocity
  const getBirdRotation = () => {
    if (birdVelocity < -5) return -30;
    if (birdVelocity > 8) return 60;
    return birdVelocity * 4;
  };

  // Initialize clouds
  useEffect(() => {
    const initialClouds: CloudData[] = Array.from({ length: 5 }).map((_, i) => ({
      x: i * 120 + Math.random() * 50,
      y: Math.random() * 150 + 20,
      scale: 0.5 + Math.random() * 0.5,
      speed: 0.3 + Math.random() * 0.3,
    }));
    setClouds(initialClouds);
  }, []);

  const flap = useCallback(() => {
    if (gameState === "playing") {
      setBirdVelocity(FLAP_STRENGTH);
    }
  }, [gameState]);

  const startCountdown = useCallback(() => {
    setBirdY(GAME_HEIGHT / 2 - BIRD_SIZE / 2);
    setBirdVelocity(0);
    setPipes([]);
    setScore(0);
    pipeTimerRef.current = 0;
    setCountdown(3);
    setGameState("countdown");
  }, []);

  // Countdown effect
  useEffect(() => {
    if (gameState !== "countdown") return;

    if (countdown > 0) {
      countdownRef.current = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      setGameState("playing");
    }

    return () => {
      if (countdownRef.current) {
        clearTimeout(countdownRef.current);
      }
    };
  }, [gameState, countdown]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        if (gameState === "idle" || gameState === "gameover") {
          startCountdown();
        } else if (gameState === "playing") {
          flap();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, flap, startCountdown]);

  // Check collision
  const checkCollision = useCallback(
    (birdYPos: number, currentPipes: PipeData[]): boolean => {
      // Ground collision
      if (birdYPos + BIRD_SIZE > GAME_HEIGHT - GROUND_HEIGHT) {
        return true;
      }
      // Ceiling collision
      if (birdYPos < 0) {
        return true;
      }

      // Pipe collision
      for (const pipe of currentPipes) {
        const pipeLeft = pipe.x;
        const pipeRight = pipe.x + PIPE_WIDTH;

        // Check if bird overlaps horizontally with pipe
        if (BIRD_X + BIRD_SIZE - 10 > pipeLeft && BIRD_X + 10 < pipeRight) {
          // Check if bird is outside the gap
          if (birdYPos + 5 < pipe.gapY || birdYPos + BIRD_SIZE - 5 > pipe.gapY + PIPE_GAP) {
            return true;
          }
        }
      }

      return false;
    },
    []
  );

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const gameLoop = () => {
      setBirdY((prevY) => {
        const newVelocity = birdVelocity + GRAVITY;
        setBirdVelocity(newVelocity);
        return prevY + newVelocity;
      });

      // Update pipes
      setPipes((prevPipes) => {
        let newPipes = prevPipes.map((pipe) => ({
          ...pipe,
          x: pipe.x - PIPE_SPEED,
        }));

        // Remove off-screen pipes
        newPipes = newPipes.filter((pipe) => pipe.x > -PIPE_WIDTH);

        // Check for score
        newPipes.forEach((pipe) => {
          if (!pipe.passed && pipe.x + PIPE_WIDTH < BIRD_X) {
            pipe.passed = true;
            setScore((prev) => prev + 1);
          }
        });

        return newPipes;
      });

      // Add new pipes
      pipeTimerRef.current += 1;
      if (pipeTimerRef.current >= PIPE_INTERVAL / PIPE_SPEED) {
        pipeTimerRef.current = 0;
        const minGapY = 80;
        const maxGapY = GAME_HEIGHT - GROUND_HEIGHT - PIPE_GAP - 80;
        const gapY = Math.random() * (maxGapY - minGapY) + minGapY;

        setPipes((prev) => [
          ...prev,
          { x: GAME_WIDTH, gapY, passed: false },
        ]);
      }

      // Update clouds
      setClouds((prevClouds) =>
        prevClouds.map((cloud) => ({
          ...cloud,
          x: cloud.x - cloud.speed,
          ...(cloud.x < -100 && {
            x: GAME_WIDTH + 50,
            y: Math.random() * 150 + 20,
          }),
        }))
      );

      // Update ground
      setGroundOffset((prev) => prev + PIPE_SPEED);

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, birdVelocity]);

  // Collision detection in separate effect
  useEffect(() => {
    if (gameState !== "playing") return;

    if (checkCollision(birdY, pipes)) {
      setGameState("gameover");
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("flappyHighScore", score.toString());
      }
    }
  }, [birdY, pipes, gameState, checkCollision, score, highScore]);

  const handleClick = () => {
    if (gameState === "playing") {
      flap();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen sky-gradient p-4">
      <div
        className="relative overflow-hidden rounded-3xl game-shadow cursor-pointer select-none"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        onClick={handleClick}
        onTouchStart={(e) => {
          e.preventDefault();
          handleClick();
        }}
      >
        {/* Sky background */}
        <div className="absolute inset-0 sky-gradient" />

        {/* Clouds */}
        {clouds.map((cloud, i) => (
          <Cloud key={i} x={cloud.x} y={cloud.y} scale={cloud.scale} />
        ))}

        {/* Pipes */}
        {pipes.map((pipe, i) => (
          <Pipe
            key={i}
            x={pipe.x}
            gapY={pipe.gapY}
            gapHeight={PIPE_GAP}
            gameHeight={GAME_HEIGHT - GROUND_HEIGHT}
          />
        ))}

        {/* Bird */}
        <Bird y={birdY} rotation={getBirdRotation()} />

        {/* Ground */}
        <Ground offset={groundOffset} />

        {/* Score */}
        {(gameState === "playing" || gameState === "countdown") && <ScoreDisplay score={score} />}

        {/* Countdown overlay */}
        <AnimatePresence>
          {gameState === "countdown" && countdown > 0 && (
            <motion.div
              key={countdown}
              className="absolute inset-0 z-40 flex items-center justify-center"
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-8xl font-bold text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
                {countdown}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overlays */}
        <AnimatePresence>
          {gameState === "idle" && (
            <GameOverlay type="start" onStart={startCountdown} />
          )}
          {gameState === "gameover" && (
            <GameOverlay
              type="gameover"
              score={score}
              highScore={highScore}
              onStart={startCountdown}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FlappyBirdGame;
