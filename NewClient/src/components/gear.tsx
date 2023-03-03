import React, { useState } from "react";

interface ButtonProps {
  defaultIcon: string;
  activeIcon: string;
  onClick?: () => void;
}

const Gear: React.FC<ButtonProps> = ({ defaultIcon, activeIcon, onClick }) => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
    onClick && onClick();
  };

  return (
    <button
      onClick={handleClick}
      style={{ backgroundColor: "white", border: "none" }}
    >
      <img src={isActive ? activeIcon : defaultIcon} alt="icon" />
    </button>
  );
};

export default Gear;
