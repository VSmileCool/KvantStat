import React, { useState } from "react";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";

const InstitutesMap: React.FC = () => {
  const [center, setCenter] = useState([55.76, 37.64]);
  const [zoom, setZoom] = useState(10);

  const handleMapClick = (event: any) => {
    setCenter(event.get("coords"));
  };

  return (
    <YMaps>
      <div style={{ height: "800px" }}>
        <Map
          style={{ height: "800px" }}
          state={{ center, zoom }}
          onClick={handleMapClick}
        >
          <Placemark geometry={center} />
        </Map>
      </div>
    </YMaps>
  );
};

export default InstitutesMap;
