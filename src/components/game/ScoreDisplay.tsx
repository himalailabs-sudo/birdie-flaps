import { motion } from "framer-motion";

interface ScoreDisplayProps {
  score: number;
}

const ScoreDisplay = ({ score }: ScoreDisplayProps) => {
  return (
    <motion.div
      className="absolute top-8 left-1/2 -translate-x-1/2 z-30"
      key={score}
      initial={{ scale: 1.3 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.15 }}
    >
      <div className="text-6xl font-bold text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] tracking-wider">
        {score}
      </div>
    </motion.div>
  );
};

export default ScoreDisplay;
