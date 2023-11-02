import React from "react";
import "../styles/css/Map.css";
import ScrollToElementOnLoad from "../components/ScrollToElementOnLoad";
import SvgGenerator from "../components/SVGenerator";

const InstituteMap: React.FC = () => {
  return (
    <div className="map-block">
      <div className="map" id="target">
        <SvgGenerator />
      </div>
      *Карта актуальна на момент 2021 года
      <ScrollToElementOnLoad targetId="target" />
    </div>
  );
};

export default InstituteMap;
