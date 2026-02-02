interface CloudProps {
  x: number;
  y: number;
  scale?: number;
}

const Cloud = ({ x, y, scale = 1 }: CloudProps) => {
  return (
    <div
      className="absolute opacity-90"
      style={{
        left: x,
        top: y,
        transform: `scale(${scale})`,
      }}
    >
      <div className="relative">
        <div className="absolute w-16 h-10 bg-white rounded-full" />
        <div className="absolute w-12 h-8 bg-white rounded-full -top-3 left-4" />
        <div className="absolute w-14 h-9 bg-white rounded-full -top-1 left-10" />
        <div className="absolute w-10 h-7 bg-white rounded-full top-1 left-20" />
      </div>
    </div>
  );
};

export default Cloud;
