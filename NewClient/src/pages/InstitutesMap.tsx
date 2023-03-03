import React, { useState } from "react";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import MyMap from "../components/Map";

const InstitutesMap: React.FC = () => {
  const [center, setCenter] = useState([55.76, 37.64]);
  const [zoom, setZoom] = useState(10);

  const handleMapClick = (event: any) => {
    setCenter(event.get("coords"));
  };

  return (
    <div>
      <div style={{ width: "1080px", marginTop: "100px", marginLeft: "700px" }}>
        <MyMap />
      </div>
    </div>
  );
};

export default InstitutesMap;
