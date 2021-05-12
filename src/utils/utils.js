import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";
import "./utils.css";

const casesTypeColors = {
  cases: {
    hex: "#ff1a1a",
    rgb: "#ff0000",
    half_op: "rgba(204, 16, 52, 0.5)",
    multiplier: 500,
  },
  recovered: {
    hex: "#7dd71d",
    rgb: "rgb(125, 215, 29)",
    half_op: "rgba(125, 215, 29, 0.5)",
    multiplier: 500,
  },
  deaths: {
    hex: "#fb4443",
    rgb: "rgb(251, 68, 67)",
    half_op: "rgba(251, 68, 67, 0.5)",
    multiplier: 2000,
  },
};

export const printStat = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";

export const printStatTotal = (stat) =>
  stat ? `${numeral(stat).format("0.0a")}` : "0";

export const showMapData = (data, casesType = "cases") =>
  data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillOpacity={0.4}
      color={casesTypeColors[casesType].rgb}
      fillColor={casesTypeColors[casesType].hex}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
    >
      <Popup>
        <div className="popup__container">
          <div
            className="popup__flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          />
          <div className="popup__country">{country.country}</div>
          <div className="popup__cases">
            Cases: {numeral(country.cases).format("0,0")}
          </div>
          <div className="popup__recovered">
            Recovered: {numeral(country.recovered).format("0,0")}
          </div>
          <div className="popup__deaths">
            Deaths: {numeral(country.deaths).format("0,0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));
