import React, { useEffect, useState } from "react";
import mappa from "./output.js";
import "../styles/css/SVGenerator.css";
import OffCanvasExample from "./OffCanvasMenu";
import { getInstitutes } from "../api/InstituteAPI";

const regionTitles = {
  "#85CC3D": "Центральный федеральный округ",
  "#FFBE4C": "Южный федеральный округ",
  "#E6735C": "Северо-Кавказский федеральный округ",
  "#00A66E": "Приволжский федеральный округ",
  "#297ACC": "Северо-Западный федеральный округ",
  "#3E5BB3": "Уральский федеральный округ",
  "#4D3D99": "Сибирский федеральный округ",
  "#3D2273": "Дальневосточный федеральный округ",
};

const SVGGenerator: React.FC = () => {
  const [show, setShow] = useState(false);
  const [text, setText] = useState<Array<string>>([]);
  const [title, setTitle] = useState<string>("");

  const handleClose = () => {
    setTitle("");
    setShow(false);
  };

  const handleShow = (color: string) => {
    setTitle(regionTitles[color as keyof typeof regionTitles] || "");
    setShow(true);
  };

  const [activeColor, setActiveColor] = useState<string | null>(null);

  const handleMouseEnter = (color: string) => {
    setActiveColor(color);
  };

  const handleMouseLeave = () => {
    setActiveColor(null);
  };
  useEffect(() => {
    const fetchInstitutes = async () => {
      const institutes = await getInstitutes(title);
      setText(institutes);
    };
    fetchInstitutes();
  }, [title]);

  return (
    <div className="svg-container">
      <svg
        id="svg2"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1540 890"
        style={{ zIndex: 1, position: "relative" }}
      >
        {mappa.map((item, index) => (
          <path
            key={index}
            d={item.d}
            fill={item.fill}
            stroke="#F5DFD1"
            strokeWidth="1.24691"
            className={activeColor === item.fill ? "svg-path-active" : ""}
            onMouseEnter={() => handleMouseEnter(item.fill)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleShow(item.fill)}
          />
        ))}
      </svg>

      <OffCanvasExample
        placement="start"
        handleClose={handleClose}
        show={show}
        text={text}
        title={title}
      />
    </div>
  );
};

export default SVGGenerator;
