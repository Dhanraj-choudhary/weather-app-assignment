import React, { useEffect, useState } from "react";
import useGeolocation from "../hooks/useGeolocation";
import {
  getCurrentByCoords,
  getCurrentByCity,
  get5DayForecast,
} from "../api/openWeather";
import axios from "axios";

export default function MainScreen() {
  const { coords, error: geoError, loading: geoLoading } = useGeolocation();
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [aqi, setAqi] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const defaultCity = "Jaipur";
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const BASE = "https://api.openweathermap.org/data/2.5";

  useEffect(() => {
    async function loadWeather() {
      setLoading(true);
      try {
        let current;
        if (coords) {
          current = await getCurrentByCoords(coords.lat, coords.lon);
        } else {
          current = await getCurrentByCity(defaultCity);
        }
        setCurrentWeather(current);

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

        const forecastRaw = await get5DayForecast(current.name);
        setForecast(
          forecastRaw.list.filter((item, index) => index % 8 === 0).slice(0, 5)
        );
      } catch (err) {
        setError(err.message || "Failed to fetch weather");
      } finally {
        setLoading(false);
      }
    }
    loadWeather();
  }, [coords]);

  if (loading || geoLoading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }
  if (error || geoError) {
    return (
      <div className="alert alert-danger mt-5 text-center">
        {error || geoError}
      </div>
    );
  }

  const countryLabel =
    currentWeather.name === "Jaipur" ? "IN" : currentWeather.sys.country;
  const mainCondition = currentWeather.weather[0].main;
  const iconCode = currentWeather.weather[0].icon;
  const windKmh = Math.round(currentWeather.wind.speed * 3.6);
  const visibilityKm = currentWeather.visibility / 1000;
  

  const humidity = `${currentWeather.main.humidity}%`;
  const windSpeed = `${windKmh} km/h`;
  const updateTime = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }); // 03:22 PM IST

  return (
    <div
      className="container text-center"
      style={{
        background: "linear-gradient(to bottom, #667eea, #764ba2)",
        minHeight: "100vh",
        paddingTop: "20px",
        color: "white",
      }}
    >
     <h2
  className="text-center fw-bold my-4"
  style={{ color: "#1f3369ff" }}
>
  Today's Weather in {currentWeather.name}
</h2>

      {currentWeather && (
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
            {currentWeather.name}, {countryLabel}
          </h2>
          <h3 className="mb-2">
            {Math.round(currentWeather.main.temp)}°C (
            {Math.round((currentWeather.main.temp * 9) / 5 + 32)}°F)
          </h3>
          <p className="mb-2">{mainCondition}</p>
          <div className="row text-left">
            <div className="col-4">
              <p>Air Quality Index:</p>
              <p>{aqi}</p>
            </div>
            <div className="col-4">
              <p>Humidity:</p>
              <p>{humidity}</p>
            </div>
            <div className="col-4">
              <p>Wind:</p>
              <p>{windSpeed}</p>
            </div>
            <div className="col-4">
              <p>Visibility:</p>
              <p>{visibilityKm} km</p>
            </div>
          </div>
          {mainCondition === "Haze" ? (
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
              {/* <line x1="25" y1 "20" x2="75" y2="20" stroke="gray" strokeWidth="2" /> */}
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
              src={`https://openweathermap.org/img/wn/${iconCode}@2x.png`}
              alt="weather icon"
              style={{ width: "100px", height: "100px" }}
            />
          )}
        </div>
      )}
      <h4 className="text-center fw-bold my-4"
  style={{ color: "#1f3369ff" }}
> Weather overview of upcomming day's</h4>
      <div className="row justify-content-center">
        {forecast.map((item) => (
          <div key={item.dt} className="col-md-2 col-6 mb-3">
            <div
              className="card shadow-sm p-2 text-dark"
              style={{
                width: "150px",
                background: "rgba(255, 255, 255, 0.2)",
                border: "none",
                backdropFilter: "blur(10px)",
                color: "back",
              }}
            >
              <div className="d-flex justify-content-center gap-5">
              <small>
                {new Date(item.dt * 1000).toLocaleDateString("en-US", {
                  weekday: "short"
                })}
              </small>
              <small>
                {new Date(item.dt * 1000).toLocaleDateString("en-US", {
                  day: "numeric"
                })}
              </small>
              </div>
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
