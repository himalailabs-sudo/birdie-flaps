import { motion } from "framer-motion";

interface GroundProps {
  offset: number;
}

const Ground = ({ offset }: GroundProps) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
      <motion.div
        className="absolute bottom-0 h-full flex"
        style={{ x: -offset % 48 }}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="w-12 h-full ground-gradient flex-shrink-0"
          >
            {/* Grass blades */}
            <div className="h-3 flex justify-around">
              <div className="w-1 h-3 bg-green-600 rounded-t" />
              <div className="w-1 h-2 bg-green-500 rounded-t" />
              <div className="w-1 h-3 bg-green-600 rounded-t" />
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Ground;
