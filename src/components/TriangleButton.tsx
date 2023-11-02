import React from "react";

interface TriangleProps {
  style?: any;
  width: number;
  height: number;
  color: string;
  rotate: string;
}

const Triangle: React.FC<TriangleProps> = ({
  style,
  width,
  height,
  color,
  rotate,
}) => {
  return (
    <svg
      style={style}
      width={height}
      height={width}
      viewBox={`0 0 ${height} ${width}`}
      transform={`rotate(${rotate})`}
    >
      <polygon points={`0,0 ${height},${width / 2} 0,${width}`} fill={color} />
    </svg>
  );
};

export default Triangle;
