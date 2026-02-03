import { useState } from "react";
import { motion } from "framer-motion";

interface SnakeUsernameInputProps {
  onSubmit: (username: string) => void;
  savedUsername?: string;
}

const SnakeUsernameInput = ({ onSubmit, savedUsername }: SnakeUsernameInputProps) => {
  const [username, setUsername] = useState(savedUsername || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSubmit(username.trim());
    }
  };

  return (
    <motion.div
      className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
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
        <motion.h1
          className="text-4xl font-bold text-primary mb-2"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🐍 Snake
        </motion.h1>
        <p className="text-muted-foreground mb-6">Enter your name to play!</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your name"
            maxLength={15}
            className="w-full px-4 py-3 rounded-xl bg-muted text-foreground text-center text-lg font-medium border-2 border-transparent focus:border-primary focus:outline-none transition-colors"
            autoFocus
          />
          <motion.button
            type="submit"
            disabled={!username.trim()}
            className="w-full bg-emerald-500 text-white px-8 py-4 rounded-2xl text-xl font-semibold shadow-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: username.trim() ? 1.02 : 1 }}
            whileTap={{ scale: username.trim() ? 0.98 : 1 }}
          >
            Let's Go!
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default SnakeUsernameInput;
