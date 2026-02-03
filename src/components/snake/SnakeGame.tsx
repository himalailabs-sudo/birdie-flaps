import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import SnakeUsernameInput from "./SnakeUsernameInput";
import SnakeLeaderboard from "./SnakeLeaderboard";
import { useSnakeLeaderboard } from "@/hooks/useSnakeLeaderboard";

// Game constants
const GRID_SIZE = 20;
const CELL_SIZE = 20;
const GAME_WIDTH = GRID_SIZE * CELL_SIZE;
const GAME_HEIGHT = GRID_SIZE * CELL_SIZE;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 5;
const MIN_SPEED = 50;

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Position = { x: number; y: number };

const SnakeGame = () => {
  const [gameState, setGameState] = useState<"username" | "idle" | "countdown" | "playing" | "gameover">("username");
  const [username, setUsername] = useState(() => {
    return localStorage.getItem("snakeUsername") || "";
  });
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 10 });
  const [_direction, setDirection] = useState<Direction>("RIGHT");
  const [score, setScore] = useState(0);

  const { scores, addScore, getUserHighScore } = useSnakeLeaderboard();

  const directionRef = useRef<Direction>("RIGHT");
  const gameLoopRef = useRef<NodeJS.Timeout>();
  const speedRef = useRef(INITIAL_SPEED);

  // Generate random food position
  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some((seg) => seg.x === newFood.x && seg.y === newFood.y));
    return newFood;
  }, []);

  const handleUsernameSubmit = useCallback((name: string) => {
    setUsername(name);
    localStorage.setItem("snakeUsername", name);
    // Go straight to countdown instead of idle
    setSnake([{ x: 10, y: 10 }]);
    setDirection("RIGHT");
    directionRef.current = "RIGHT";
    setScore(0);
    speedRef.current = INITIAL_SPEED;
    setFood(generateFood([{ x: 10, y: 10 }]));
    setCountdown(3);
    setGameState("countdown");
  }, [generateFood]);

  // Start countdown
  const startCountdown = useCallback(() => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection("RIGHT");
    directionRef.current = "RIGHT";
    setScore(0);
    speedRef.current = INITIAL_SPEED;
    setFood(generateFood([{ x: 10, y: 10 }]));
    setCountdown(3);
    setGameState("countdown");
  }, [generateFood]);

  // Countdown effect
  useEffect(() => {
    if (gameState !== "countdown") return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setGameState("playing");
    }
  }, [gameState, countdown]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === "idle" || gameState === "gameover") {
        if (e.code === "Space" || e.key === " ") {
          e.preventDefault();
          startCountdown();
        }
        return;
      }

      if (gameState !== "playing") return;

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          e.preventDefault();
          if (directionRef.current !== "DOWN") {
            directionRef.current = "UP";
            setDirection("UP");
          }
          break;
        case "ArrowDown":
        case "s":
        case "S":
          e.preventDefault();
          if (directionRef.current !== "UP") {
            directionRef.current = "DOWN";
            setDirection("DOWN");
          }
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          e.preventDefault();
          if (directionRef.current !== "RIGHT") {
            directionRef.current = "LEFT";
            setDirection("LEFT");
          }
          break;
        case "ArrowRight":
        case "d":
        case "D":
          e.preventDefault();
          if (directionRef.current !== "LEFT") {
            directionRef.current = "RIGHT";
            setDirection("RIGHT");
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, startCountdown]);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };

        switch (directionRef.current) {
          case "UP":
            head.y -= 1;
            break;
          case "DOWN":
            head.y += 1;
            break;
          case "LEFT":
            head.x -= 1;
            break;
          case "RIGHT":
            head.x += 1;
            break;
        }

        // Check wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameState("gameover");
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some((seg) => seg.x === head.x && seg.y === head.y)) {
          setGameState("gameover");
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
          setScore((prev) => prev + 10);
          setFood(generateFood(newSnake));
          // Increase speed
          speedRef.current = Math.max(MIN_SPEED, speedRef.current - SPEED_INCREMENT);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    gameLoopRef.current = setInterval(moveSnake, speedRef.current);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState, food, generateFood]);

  // Handle game over - submit score
  useEffect(() => {
    if (gameState === "gameover" && score > 0) {
      addScore(username, score);
    }
  }, [gameState, score, username, addScore]);

  // Touch controls
  const handleSwipe = useCallback(
    (startX: number, startY: number, endX: number, endY: number) => {
      if (gameState !== "playing") return;

      const dx = endX - startX;
      const dy = endY - startY;

      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0 && directionRef.current !== "LEFT") {
          directionRef.current = "RIGHT";
          setDirection("RIGHT");
        } else if (dx < 0 && directionRef.current !== "RIGHT") {
          directionRef.current = "LEFT";
          setDirection("LEFT");
        }
      } else {
        if (dy > 0 && directionRef.current !== "UP") {
          directionRef.current = "DOWN";
          setDirection("DOWN");
        } else if (dy < 0 && directionRef.current !== "DOWN") {
          directionRef.current = "UP";
          setDirection("UP");
        }
      }
    },
    [gameState]
  );

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Direction button handlers
  const handleDirectionClick = (newDirection: Direction) => {
    if (gameState !== "playing") return;
    
    const opposites: Record<Direction, Direction> = {
      UP: "DOWN",
      DOWN: "UP",
      LEFT: "RIGHT",
      RIGHT: "LEFT",
    };
    
    if (directionRef.current !== opposites[newDirection]) {
      directionRef.current = newDirection;
      setDirection(newDirection);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-emerald-900 to-emerald-950 p-4">
      {/* Back button */}
      <Link
        to="/"
        className="absolute top-4 left-4 z-50 bg-card/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-card transition-colors"
      >
        <ArrowLeft className="w-6 h-6 text-foreground" />
      </Link>

      {/* Leaderboard button */}
      {(gameState === "idle" || gameState === "gameover") && (
        <button
          onClick={() => setShowLeaderboard(true)}
          className="absolute top-4 right-4 z-50 bg-card/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-card transition-colors"
        >
          <Trophy className="w-6 h-6 text-emerald-500" />
        </button>
      )}

      {/* Score display */}
      <div className="mb-4 text-center">
        <div className="text-4xl font-bold text-white mb-1">{score}</div>
        <div className="text-emerald-300 text-sm">Best: {getUserHighScore(username)}</div>
      </div>

      {/* Game board */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-emerald-700"
        style={{
          width: GAME_WIDTH,
          height: GAME_HEIGHT,
          backgroundColor: "#1a1a2e",
        }}
        onTouchStart={(e) => {
          touchStartRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
          };
        }}
        onTouchEnd={(e) => {
          if (touchStartRef.current) {
            handleSwipe(
              touchStartRef.current.x,
              touchStartRef.current.y,
              e.changedTouches[0].clientX,
              e.changedTouches[0].clientY
            );
          }
        }}
      >
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, #10b981 1px, transparent 1px),
              linear-gradient(to bottom, #10b981 1px, transparent 1px)
            `,
            backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => (
          <motion.div
            key={index}
            className="absolute rounded-sm"
            style={{
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              left: segment.x * CELL_SIZE + 1,
              top: segment.y * CELL_SIZE + 1,
              backgroundColor: index === 0 ? "#34d399" : "#10b981",
              boxShadow: index === 0 ? "0 0 10px #34d399" : "none",
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.1 }}
          />
        ))}

        {/* Food */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: CELL_SIZE - 4,
            height: CELL_SIZE - 4,
            left: food.x * CELL_SIZE + 2,
            top: food.y * CELL_SIZE + 2,
            backgroundColor: "#ef4444",
            boxShadow: "0 0 15px #ef4444",
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />

        {/* Countdown overlay */}
        <AnimatePresence>
          {gameState === "countdown" && countdown > 0 && (
            <motion.div
              key={countdown}
              className="absolute inset-0 z-40 flex items-center justify-center bg-black/50"
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-8xl font-bold text-white drop-shadow-lg">
                {countdown}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Username input overlay */}
        <AnimatePresence>
          {gameState === "username" && (
            <SnakeUsernameInput 
              onSubmit={handleUsernameSubmit} 
              savedUsername={username}
            />
          )}
        </AnimatePresence>

        {/* Start overlay */}
        <AnimatePresence>
          {gameState === "idle" && (
            <motion.div
              className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-card rounded-3xl p-8 shadow-2xl text-center mx-4"
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
              >
                <p className="text-muted-foreground mb-2">Playing as</p>
                <p className="text-xl font-bold text-foreground mb-4">{username}</p>
                <motion.button
                  onClick={startCountdown}
                  className="bg-emerald-500 text-white px-8 py-4 rounded-2xl text-xl font-semibold shadow-lg hover:bg-emerald-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Play
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game over overlay */}
        <AnimatePresence>
          {gameState === "gameover" && (
            <motion.div
              className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-card rounded-3xl p-8 shadow-2xl text-center mx-4"
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
              >
                <h2 className="text-3xl font-bold text-destructive mb-4">
                  Game Over!
                </h2>
                <div className="space-y-3 mb-6">
                  <div className="bg-muted rounded-xl p-4">
                    <p className="text-muted-foreground text-sm">Score</p>
                    <p className="text-3xl font-bold text-foreground">{score}</p>
                  </div>
                  <div className="bg-accent/20 rounded-xl p-4">
                    <p className="text-muted-foreground text-sm">Best</p>
                    <p className="text-2xl font-bold text-accent-foreground">
                      {getUserHighScore(username)}
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={startCountdown}
                  className="bg-emerald-500 text-white px-8 py-4 rounded-2xl text-xl font-semibold shadow-lg hover:bg-emerald-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Try Again
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile controls */}
      <div className="mt-6 flex flex-col items-center gap-2">
        {/* Up button */}
        <button
          onClick={() => handleDirectionClick("UP")}
          className="w-14 h-14 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-400 rounded-xl flex items-center justify-center shadow-lg transition-colors"
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        
        {/* Left, Down, Right buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => handleDirectionClick("LEFT")}
            className="w-14 h-14 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-400 rounded-xl flex items-center justify-center shadow-lg transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={() => handleDirectionClick("DOWN")}
            className="w-14 h-14 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-400 rounded-xl flex items-center justify-center shadow-lg transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <button
            onClick={() => handleDirectionClick("RIGHT")}
            className="w-14 h-14 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-400 rounded-xl flex items-center justify-center shadow-lg transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <p className="text-emerald-400 text-xs mt-2 hidden md:block">Or use arrow keys / WASD</p>
      </div>

      {/* Leaderboard modal */}
      <AnimatePresence>
        {showLeaderboard && (
          <SnakeLeaderboard
            scores={scores}
            currentUsername={username}
            onClose={() => setShowLeaderboard(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SnakeGame;
