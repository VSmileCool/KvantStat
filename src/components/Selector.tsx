import React from "react";
import "../styles/css/Selector.css";
import Triangle from "./TriangleButton";

interface SelectorProps {
  id: number;
  onIdChange: (newId: number) => void;
}

const Selector: React.FC<SelectorProps> = ({ id, onIdChange }) => {
  const buttons = [
    { id: 1, label: "О нас" },
    { id: 2, label: "Контакты" },
    { id: 3, label: "О проекте" },
  ];

  const handleIdChange = (newId: number) => {
    if (newId >= 1 && newId <= 3 && newId !== id) {
      onIdChange(newId);
    }
  };

  const renderButtons = () => {
    return buttons.map((button) => (
      <div
        key={button.id}
        onClick={() => handleIdChange(button.id)}
        className="button"
        style={{ visibility: button.id === id ? "visible" : "hidden" }}
      >
        {button.label}
      </div>
    ));
  };

  const renderTriangleButton = (direction: "left" | "right") => {
    const isDisabled =
      (direction === "left" && id === 1) || (direction === "right" && id === 3);

    return (
      <button
        style={{
          marginLeft: direction === "right" ? "15px" : "0",
          marginRight: direction === "left" ? "15px" : "0",
        }}
        disabled={isDisabled}
        onClick={() => handleIdChange(id + (direction === "left" ? -1 : 1))}
      >
        <Triangle
          width={45}
          height={45}
          color={isDisabled ? "#e6e6e6" : "black"}
          rotate={direction === "left" ? "180" : "0"}
        />
      </button>
    );
  };

  return (
    <div className="chooser">
      {renderTriangleButton("left")}
      <div className="selector">{renderButtons()}</div>
      {renderTriangleButton("right")}
    </div>
  );
};

export default Selector;
