import React from "react";
import "./index.css";

export default function GlobalSummary(props) {
  const {
    apiData: {
      Global: {
        NewConfirmed,
        TotalConfirmed,
        NewDeaths,
        TotalDeaths,
        NewRecovered,
        TotalRecovered,
      } = {},
    } = {},
  } = props;

  const getMetric = (name, value) => {
    return (
      <div className="global_summary_metric">
        <div className="global_summary_key">{name}</div>
        <div className="global_summary_value">{value.toLocaleString("hi")}</div>
      </div>
    );
  };

  return (
    <div className="global_summary_container">
      <div className="global_summary_heading">Global Summary</div>
      <div className="global_summary_metrics">
        {getMetric("New Confirmed", NewConfirmed)}
        {getMetric("Total Confirmed", TotalConfirmed)}
        {getMetric("New Deaths", NewDeaths)}
        {getMetric("Total Deaths", TotalDeaths)}
        {getMetric("New Recovered", NewRecovered)}
        {getMetric("Total Recovered", TotalRecovered)}
      </div>
    </div>
  );
}
