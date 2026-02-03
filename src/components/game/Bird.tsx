import { motion } from "framer-motion";
import birdImage from "@/assets/flappy-bird.jpg";

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
      <img 
        src={birdImage} 
        alt="Flappy Bird" 
        className="w-full h-full object-contain"
      />
    </motion.div>
  );
};

export default Bird;
