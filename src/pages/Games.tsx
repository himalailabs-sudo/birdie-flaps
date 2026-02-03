import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Gamepad2 } from "lucide-react";
import himalLogo from "@/assets/himal-ai-labs-logo.png";

interface GameCardProps {
  title: string;
  description: string;
  path: string;
  emoji: string;
  gradient: string;
}

const GameCard = ({ title, description, path, emoji, gradient }: GameCardProps) => (
  <Link to={path}>
    <motion.div
      className={`relative overflow-hidden rounded-3xl p-6 h-64 ${gradient} cursor-pointer group`}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 20 }}
    >
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
      <div className="relative z-10 h-full flex flex-col justify-between">
        <span className="text-6xl">{emoji}</span>
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
          <p className="text-white/80 text-sm">{description}</p>
        </div>
      </div>
      <motion.div
        className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity"
        whileHover={{ scale: 1.1 }}
      >
        <Gamepad2 className="w-6 h-6 text-white" />
      </motion.div>
    </motion.div>
  </Link>
);

// Games configuration - easy to add more games here
const games: GameCardProps[] = [
  {
    title: "Birdie Flaps",
    description: "Tap to fly, dodge pipes, and compete on the leaderboard!",
    path: "/birdie-flaps",
    emoji: "🐦",
    gradient: "bg-gradient-to-br from-sky-400 to-emerald-500",
  },
  {
    title: "Snake",
    description: "Classic snake game - eat and grow!",
    path: "/snake",
    emoji: "🐍",
    gradient: "bg-gradient-to-br from-emerald-500 to-lime-400",
  },
];

const Games = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Header */}
      <header className="pt-16 pb-12 px-4">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img 
            src={himalLogo} 
            alt="Himal AI Labs" 
            className="h-24 md:h-32 w-auto mb-6"
          />
          <p className="text-xl text-slate-600 max-w-md mx-auto">
            Free browser games — no downloads, just fun!
          </p>
        </motion.div>
      </header>

      {/* Games Grid */}
      <main className="px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-2xl font-semibold text-slate-800 mb-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Choose a Game
          </motion.h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game, index) => (
              <motion.div
                key={game.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
              >
                <GameCard {...game} />
              </motion.div>
            ))}
            
            {/* Coming Soon placeholder */}
            <motion.div
              className="rounded-3xl border-2 border-dashed border-slate-300 h-64 flex flex-col items-center justify-center text-slate-500 bg-white/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-4xl mb-2">🎮</span>
              <p className="font-medium">More games coming soon!</p>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-500 text-sm border-t border-slate-200">
        <p>© {new Date().getFullYear()} Himal AI Labs. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Games;
