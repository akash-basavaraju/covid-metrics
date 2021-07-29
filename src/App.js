import React, { useEffect, useState } from "react";
import "./App.css";
import { API_STATUS, COVID_API_URL } from "./constants";
import CountryWiseSummary from "./widgets/CountryWiseSummary";
import GlobalSummary from "./widgets/GlobalSummary";

function App() {
  const [apiData, setApiData] = useState(null);
  const [apiStatus, setApiStatus] = useState(API_STATUS.UNKNOWN);

  useEffect(() => {
    if (!apiData && apiStatus === API_STATUS.UNKNOWN) {
      fetch(COVID_API_URL)
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          console.log(res);
          setApiData(res);
          setApiStatus(API_STATUS.LOADED);
        })
        .catch((err) => {
          setApiStatus(API_STATUS.ERROR);
        });
    }
  }, [apiData, apiStatus]);

  if ([API_STATUS.UNKNOWN, API_STATUS.LOADING].includes(apiStatus)) {
    return <div className="full_msg_container">Loading...</div>;
  }

  if (apiStatus === API_STATUS.ERROR) {
    return (
      <div className="full_msg_container">Something went wrong. Try again!</div>
    );
  }

  const refreshApiData = () => {
    setApiData(null);
    setApiStatus(API_STATUS.UNKNOWN);
  };
  console.log("API Data", apiData);
  return (
    <div className="app_container">
      <GlobalSummary apiData={apiData} />
      <CountryWiseSummary apiData={apiData} />
      <button className="refresh_button" onClick={refreshApiData}>
        Refresh Data
      </button>
    </div>
  );
}

export default App;
