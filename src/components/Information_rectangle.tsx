import React from "react";

export const InformationRectangle: React.FC<{ x: number; y: number }> = ({
  x,
  y,
}) => (
  <div
    style={{
      position: "absolute",
      top: y - 50,
      left: x - 25,
      width: "50px",
      height: "50px",
      backgroundColor: "red",
    }}
  >
    Hello World!
  </div>
);
