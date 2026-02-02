import { motion } from "framer-motion";
import { Trophy, Medal, Award } from "lucide-react";

export interface ScoreEntry {
  id: string;
  username: string;
  score: number;
  created_at: string;
}

interface LeaderboardProps {
  scores: ScoreEntry[];
  currentUsername: string;
  onClose: () => void;
}

const Leaderboard = ({ scores, currentUsername, onClose }: LeaderboardProps) => {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 text-center text-muted-foreground">{rank}</span>;
  };

  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-card rounded-3xl p-6 shadow-2xl max-w-sm mx-4 w-full max-h-[80%] flex flex-col"
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Trophy className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Leaderboard</h2>
        </div>

        <div className="overflow-y-auto flex-1 -mx-2 px-2">
          {scores.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No scores yet. Be the first!
            </p>
          ) : (
            <div className="space-y-2">
              {scores.slice(0, 10).map((entry, index) => (
                <motion.div
                  key={entry.id}
                  className={`flex items-center gap-3 p-3 rounded-xl ${
                    entry.username === currentUsername
                      ? "bg-primary/20 border border-primary/30"
                      : "bg-muted/50"
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-center justify-center w-8">
                    {getRankIcon(index + 1)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      {entry.username}
                    </p>
                  </div>
                  <div className="text-xl font-bold text-primary">
                    {entry.score}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <motion.button
          onClick={onClose}
          className="mt-4 w-full bg-secondary text-secondary-foreground px-6 py-3 rounded-xl font-semibold"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Close
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Leaderboard;
