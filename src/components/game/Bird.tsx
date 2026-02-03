import { motion } from "framer-motion";

interface BirdProps {
  y: number;
  rotation: number;
}

const Bird = ({ y, rotation }: BirdProps) => {
  return (
    <motion.div
      className="absolute left-[100px] w-12 h-12 z-20"
      style={{ top: y }}
      animate={{ rotate: rotation }}
      transition={{ duration: 0.1 }}
    >
      {/* Bird body */}
      <div className="relative w-full h-full">
        {/* Main body */}
        <div className="absolute inset-0 bird-gradient rounded-full shadow-lg" />
        
        {/* Eye */}
        <div className="absolute top-2 right-2 w-4 h-4 bg-white rounded-full shadow-inner">
          <div className="absolute top-1 right-1 w-2 h-2 bg-gray-800 rounded-full" />
        </div>
        
        {/* Beak */}
        <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-3 bg-orange-600 rounded-r-full" />
        
        {/* Wing */}
        <motion.div
          className="absolute top-1/2 left-1 w-5 h-4 bg-orange-400 rounded-full origin-right"
          animate={{ rotate: [-20, 20, -20] }}
          transition={{ duration: 0.15, repeat: Infinity }}
        />
        
        {/* Belly highlight */}
        <div className="absolute bottom-2 left-2 w-6 h-4 bg-yellow-200 rounded-full opacity-50" />
      </div>
    </motion.div>
  );
};

export default Bird;
