interface PipeProps {
  x: number;
  gapY: number;
  gapHeight: number;
  gameHeight: number;
}

const Pipe = ({ x, gapY, gapHeight, gameHeight }: PipeProps) => {
  const pipeWidth = 70;
  const capHeight = 30;
  const capWidth = 80;

  return (
    <div className="absolute" style={{ left: x }}>
      {/* Top pipe */}
      <div
        className="absolute pipe-gradient"
        style={{
          width: pipeWidth,
          height: gapY,
          top: 0,
          left: (capWidth - pipeWidth) / 2,
        }}
      />
      {/* Top pipe cap */}
      <div
        className="absolute pipe-gradient rounded-b-lg border-b-4 border-green-800"
        style={{
          width: capWidth,
          height: capHeight,
          top: gapY - capHeight,
          left: 0,
        }}
      />

      {/* Bottom pipe */}
      <div
        className="absolute pipe-gradient"
        style={{
          width: pipeWidth,
          height: gameHeight - gapY - gapHeight,
          top: gapY + gapHeight,
          left: (capWidth - pipeWidth) / 2,
        }}
      />
      {/* Bottom pipe cap */}
      <div
        className="absolute pipe-gradient rounded-t-lg border-t-4 border-green-400"
        style={{
          width: capWidth,
          height: capHeight,
          top: gapY + gapHeight,
          left: 0,
        }}
      />
    </div>
  );
};

export default Pipe;
