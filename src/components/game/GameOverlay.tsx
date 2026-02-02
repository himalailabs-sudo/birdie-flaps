import { motion } from "framer-motion";

interface GameOverlayProps {
  type: "start" | "gameover";
  score?: number;
  highScore?: number;
  onStart: () => void;
}

const GameOverlay = ({ type, score = 0, highScore = 0, onStart }: GameOverlayProps) => {
  return (
    <motion.div
      className="absolute inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-card rounded-3xl p-8 shadow-2xl text-center max-w-sm mx-4"
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 20 }}
      >
        {type === "start" ? (
          <>
            <motion.h1
              className="text-5xl font-bold text-primary mb-4"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Flabby Bird
            </motion.h1>
            <p className="text-muted-foreground mb-6 text-lg">
              Tap or press Space to flap!
            </p>
            <motion.button
              onClick={onStart}
              className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl text-xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Play
            </motion.button>
          </>
        ) : (
          <>
            <h2 className="text-4xl font-bold text-destructive mb-6">
              Game Over!
            </h2>
            <div className="space-y-3 mb-6">
              <div className="bg-muted rounded-xl p-4">
                <p className="text-muted-foreground text-sm">Score</p>
                <p className="text-3xl font-bold text-foreground">{score}</p>
              </div>
              <div className="bg-accent/20 rounded-xl p-4">
                <p className="text-muted-foreground text-sm">Best</p>
                <p className="text-2xl font-bold text-accent-foreground">{highScore}</p>
              </div>
            </div>
            <motion.button
              onClick={onStart}
              className="bg-secondary text-secondary-foreground px-8 py-4 rounded-2xl text-xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Again
            </motion.button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default GameOverlay;
