import React, { useState } from "react";
import Center from "./Map/Center";
import DalnFO from "./Map/DalnFO";
import Privol from "./Map/Privol";
import SevKav from "./Map/SevKav";
import Sevzap from "./Map/Sevzap";
import Sibiria from "./Map/Sibiria";
import Ufo from "./Map/UFO";
import Ural from "./Map/Ural";

const Map = () => {
  let id = 0;
  const regions = [
    Center(),
    DalnFO(),
    Privol(),
    SevKav(),
    Sevzap(),
    Sibiria(),
    Ufo(),
    Ural(),
  ];

  return (
    <svg
      id="svg2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1073.05 603.37"
      style={{ zIndex: 1, position: "relative" }}
    >
      {regions.map((value) => {
        const [brightness, setBrightness] = useState<number>(1);
        const onMouseOver = () => {
          setBrightness(1.5);
        };
        const onMouseOut = () => {
          setBrightness(1);
        };

        return (
          <a
            href={window.location.pathname + "/" + id++}
            style={{ filter: `brightness(${brightness})` }}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
          >
            {value}
          </a>
        );
      })}
    </svg>
  );
};

export default Map;
