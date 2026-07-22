import "server-only";
import type { ForecastDay, WeatherProvider } from "./types";

// Free, keyless forecast API (models: ECMWF, DWD ICON, etc.) — no account,
// no API key, no card on file. Chosen over OpenWeatherMap specifically to
// avoid tying the project to a paid account for a first Weather Intelligence
// slice. Swapping providers later only requires a new WeatherProvider impl.
interface OpenMeteoResponse {
  daily: {
    time: string[];
    temperature_2m_min: number[];
    temperature_2m_max: number[];
    precipitation_probability_max: number[];
    precipitation_sum: number[];
    windspeed_10m_max: number[];
    weathercode: number[];
  };
}

async function fetchForecast(latitude: number, longitude: number, days: number): Promise<ForecastDay[]> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", latitude.toFixed(4));
  url.searchParams.set("longitude", longitude.toFixed(4));
  url.searchParams.set("daily", "temperature_2m_min,temperature_2m_max,precipitation_probability_max,precipitation_sum,windspeed_10m_max,weathercode");
  url.searchParams.set("forecast_days", String(days));
  url.searchParams.set("timezone", "auto");

  const response = await fetch(url, { next: { revalidate: 1800 } });
  if (!response.ok) throw new Error(`Open-Meteo request failed (${response.status}).`);
  const data = (await response.json()) as OpenMeteoResponse;

  return data.daily.time.map((date, index) => ({
    date,
    temperatureMinC: data.daily.temperature_2m_min[index],
    temperatureMaxC: data.daily.temperature_2m_max[index],
    precipitationProbability: data.daily.precipitation_probability_max[index],
    precipitationMm: data.daily.precipitation_sum[index],
    windSpeedMaxKmh: data.daily.windspeed_10m_max[index],
    conditionCode: data.daily.weathercode[index],
  }));
}

export const openMeteoProvider: WeatherProvider = { name: "open-meteo", fetchForecast };
