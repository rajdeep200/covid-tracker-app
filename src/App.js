import React, { useState, useEffect } from "react";
import {
  FormControl,
  MenuItem,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import Particles from "react-particles-js";
import InfoBox from "./Components/Infobox/infoBox";
import Map from "./Components/Map/map";
import Table from "./Components/Table/table";
import LineGraph from "./Components/Linegraph/linegraph";
import Loader from "./Components/Loader/loader";
import { printStat, printStatTotal } from "./utils/utils";
import "./App.css";
import "leaflet/dist/leaflet.css";

const particlesOptions = {
  //customize this to your liking
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [loading, setLoading] = useState(false);

  // https://disease.sh/v3/covid-19/countries

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((res) => res.json())
      .then((data) => setCountryInfo(data));
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((res) => res.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso3,
          }));
          setTableData(data);
          setMapCountries(data);
          console.log(mapCountries);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });

    // https://disease.sh/v3/covid-19/all
    // https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="app">
          <Particles className="particles" params={particlesOptions} />
          <div className="app__left">
            <div className="app__header">
              <h1>COVID-19 TRACKER</h1>
              <FormControl>
                <Select
                  className="app__dropdown"
                  variant="outlined"
                  value={country}
                  onChange={onCountryChange}
                >
                  <MenuItem value="worldwide">Worldwide</MenuItem>
                  {countries.map((country) => (
                    <MenuItem key={country.name} value={country.value}>
                      {country.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="app__stats">
              <InfoBox
                active={casesType === "cases"}
                isRed
                title="Cases"
                cases={printStat(countryInfo.todayCases)}
                total={printStatTotal(countryInfo.cases)}
                onClick={(e) => setCasesType("cases")}
              />
              <InfoBox
                active={casesType === "recovered"}
                title="Recovered"
                cases={printStat(countryInfo.todayRecovered)}
                total={printStatTotal(countryInfo.recovered)}
                onClick={(e) => setCasesType("recovered")}
              />
              <InfoBox
                active={casesType === "deaths"}
                isBlack
                title="Deaths"
                cases={printStat(countryInfo.todayDeaths)}
                total={printStatTotal(countryInfo.deaths)}
                onClick={(e) => setCasesType("deaths")}
              />
            </div>
            <Map
              casesType={casesType}
              countries={mapCountries}
              center={mapCenter}
              zoom={mapZoom}
            />
          </div>
          <Card className="app__right">
            <CardContent>
              <h3>Live Cases By Country</h3>
              <Table countries={tableData} />
              <h3>Worldwide new {casesType} </h3>
              <LineGraph casesType={casesType} />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

export default App;
