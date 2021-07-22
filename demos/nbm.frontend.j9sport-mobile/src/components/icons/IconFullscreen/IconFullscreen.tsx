import React from 'react';

function IconFullscreen(
  { fullscreen }: { fullscreen: boolean }
) {
  const points = fullscreen ? [
    [0, 5, 5, 5, 5, 0],
    [13, 0, 13, 5, 18, 5],
    [0, 13, 5, 13, 5, 18],
    [13, 18, 13, 13, 18, 13],
  ] : [
    [1, 6, 1, 1, 6, 1],
    [12, 1, 17, 1, 17, 6],
    [1, 12, 1, 17, 6, 17],
    [12, 17, 17, 17, 17, 12],
  ];
  return (
    <svg
      viewBox="0 0 18 18"
      version="1.1"
      className="icon-fullscreen"
    >
      {
        points.map((line, i) => (
          <polyline
            key={i}
            points={line.join(',')}
          />
        ))
      }
    </svg>
  );
}

export default IconFullscreen;
