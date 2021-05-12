import React, { useState, useEffect } from "react";
import { Line, defaults } from "react-chartjs-2";

// defaults.plugins.tooltip.enabled = true
defaults.plugins.legend.display = false;

const buildChartData = (data, casesType = "cases") => {
  const chartData = [];
  let lastDataPoint;

  for (let date in data.cases) {
    if (lastDataPoint) {
      const newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
  return chartData;
};

// https://disease.sh/v3/covid-19/historical/all?lastdays=120
const LineGraph = ({ casesType = "cases" }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((res) => res.json())
        .then((data) => {
          let chartData = buildChartData(data, casesType);
          setData(chartData);
        });
    };
    fetchData();
  }, [casesType]);

  return (
    <div>
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: "#ffb3b3",
                borderColor: "#e60000",
                data: data,
              },
            ],
          }}
          options={{
            maintainAspectRatio: false,
            responsive: true,
            interaction: {
              mode: "index",
              intersect: false,
            },
            elements: {
              point: {
                radius: 0,
              },
            },
            scales: {
              x: [
                {
                  type: "time",
                  time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll",
                  },
                  grid: {
                    color: "#d1e0e0",
                  },
                },
              ],
            },
          }}
        />
      )}
    </div>
  );
};

export default LineGraph;
