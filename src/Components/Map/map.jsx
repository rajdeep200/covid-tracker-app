import React from "react";
import { MapContainer as LeafletMap, TileLayer } from "react-leaflet";

const Map = () => {
  return (
    <div>
      <LeafletMap>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="https://www.openstreetmap.org/copyright"
        />
      </LeafletMap>
    </div>
  );
};

export default Map;
