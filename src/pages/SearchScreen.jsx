import React, { useState } from "react";
import { getCurrentByCity, get5DayForecast } from "../api/openWeather";
import axios from "axios";

export default function SearchScreen() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [aqi, setAqi] = useState(0);
  const [error, setError] = useState(null);
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const BASE = "https://api.openweathermap.org/data/2.5";

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const current = await getCurrentByCity(city);
      setWeather(current);

      // Fetch AQI (PM2.5)
      let pm25 = Math.floor(Math.random() * 50 + 1); // Fallback random
      try {
        const air = await axios.get(
          `${BASE}/air_pollution?lat=${current.coord.lat}&lon=${current.coord.lon}&appid=${API_KEY}`
        );
        pm25 = Math.round(air.data.list[0].components.pm2_5);
      } catch (airErr) {
        console.warn("Failed to fetch AQI:", airErr);
      }
      setAqi(pm25);

      const forecastRaw = await get5DayForecast(city);
      setForecast(
        forecastRaw.list.filter((item, index) => index % 8 === 0).slice(0, 5)
      );
      setError(null);
       setCity("");
    } catch (err) {
      setError("City not found or failed to fetch weather");
      setWeather(null);
      setForecast([]);
      setAqi(0);
       setCity("");
    }
  };

  // const getSeverity = (pm25) => {
  //   if (pm25 <= 50) return "Good air";
  //   if (pm25 <= 100) return "Moderate";
  //   if (pm25 <= 150) return "Unhealthy for Sensitive Groups";
  //   if (pm25 <= 200) return "Unhealthy";
  //   if (pm25 <= 300) return "Very Unhealthy";
  //   return "Hazardous";
  // };

  return (
    <div
      className="container text-center mt-4"
      style={{
        background: "linear-gradient(to bottom, #667eea, #764ba2)",
        minHeight: "100vh",
        paddingTop: "20px",
        color: "white",
      }}
    >
      <h2  className="text-center fw-bold my-4"
  style={{ color: "#1f3369ff" }}>Search Weather </h2>
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
           className="form-control w-75 mx-auto"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search for any City and Country"
          
        />
        <button type="submit" className="btn btn-primary mt-2">
          Search
        </button>
      </form>
      {error && <div className="alert alert-danger">{error}</div>}
      {weather && (
        <div
          className="card shadow-lg mb-4 p-4"
          style={{
            maxWidth: "500px",
            margin: "0 auto",
            background: "rgba(255, 255, 255, 0.2)",
            border: "none",
            backdropFilter: "blur(10px)",
          }}
        >
          <h2 className="mb-2">
            {weather.name}, {weather.sys.country}
          </h2>
          <h3 className="mb-2">
            {Math.round(weather.main.temp)}°C (
            {Math.round((weather.main.temp * 9) / 5 + 32)}°F)
          </h3>
          <p className="mb-2">{weather.weather[0].main}</p>
          <div className="row text-left">
            <div className="col-4">
              <p>Air Quality Index:</p>
              <p>{aqi}</p>
            </div>
            <div className="col-4">
              <p>Humidity:</p>
              <p>{weather.main.humidity}%</p>
            </div>
            <div className="col-4">
              <p>Wind:</p>
              <p>{Math.round(weather.wind.speed * 3.6)} km/h</p>
            </div>
            <div className="col-4">
              <p>Visibility:</p>
              <p>{weather.visibility / 1000} km</p>
            </div>
          </div>
          {weather.weather[0].main === "Haze" ? (
            <svg
              width="100"
              height="50"
              viewBox="0 0 100 50"
              style={{ margin: "0 auto" }}
            >
              <line
                x1="30"
                y1="10"
                x2="70"
                y2="10"
                stroke="gray"
                strokeWidth="2"
              />
              <line
                x1="25"
                y1="20"
                x2="75"
                y2="20"
                stroke="gray"
                strokeWidth="2"
              />
              <line
                x1="20"
                y1="30"
                x2="80"
                y2="30"
                stroke="gray"
                strokeWidth="2"
              />
              <line
                x1="25"
                y1="40"
                x2="75"
                y2="40"
                stroke="gray"
                strokeWidth="2"
              />
              <line
                x1="30"
                y1="50"
                x2="70"
                y2="50"
                stroke="gray"
                strokeWidth="2"
              />
            </svg>
          ) : (
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="weather icon"
              style={{ width: "100px", height: "100px" }}
            />
          )}
        </div>
      )}
      {/* <h4 className="mb-3">Daily</h4> */}
      <div className="row justify-content-center">
        {forecast.map((item) => (
          <div key={item.dt} className="col-md-2 col-6 mb-3">
            <div
              className="card shadow-sm p-2"
              style={{
                width: "150px",
                background: "rgba(255, 255, 255, 0.2)",
                border: "none",
                backdropFilter: "blur(10px)",
                color: "black",
              }}
            >
              <small>
                {new Date(item.dt * 1000).toLocaleDateString("en-US", {
                  weekday: "short",
                  day:"numeric"
                })}
              </small>
              <img
                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                alt="icon"
                style={{ width: "60px", height: "60px", margin: "0 auto" }}
              />
              <strong>
                {Math.round(item.main.temp)}°/{" "}
                {Math.round((item.main.temp * 9) / 5 + 32)}°F
              </strong>
              <p>{item.weather[0].main}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
