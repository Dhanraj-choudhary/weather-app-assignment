import axios from 'axios'


const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
console.log("API KEY:", API_KEY);

const BASE = 'https://api.openweathermap.org/data/2.5'
const api = axios.create({ baseURL: BASE, timeout: 10000 })

export async function getCurrentByCoords(lat, lon, units = 'metric') {
  const { data } = await api.get('/weather', { params: { lat, lon, units, appid: API_KEY } })
  return data
}

export async function getCurrentByCity(city, units = 'metric') {
  const { data } = await api.get('/weather', { params: { q: city, units, appid: API_KEY } })
  return data
}

export async function get5DayForecast(city, units = 'metric') {
  const { data } = await api.get('/forecast', { params: { q: city, units, appid: API_KEY } })
  return data
}
