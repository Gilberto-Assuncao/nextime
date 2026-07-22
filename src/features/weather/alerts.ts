import type { ForecastDay } from "@/src/infrastructure/weather/types";

export type AlertLevel = "none" | "watch" | "delay-risk";
export type WeatherAlert = { level: AlertLevel; reason: string };

// Thresholds are a starting point, not a tuned model — heavy rain or strong
// wind are the two conditions most likely to block outdoor electrical/HVAC
// site work, per the scenario registered in FUTURE_IDEAS.md (a snowstorm
// blocking a scheduled Site). Snow itself isn't separately modelled yet:
// Open-Meteo's weathercode does distinguish it, but scoring specific codes
// is left for a follow-up once real usage shows which thresholds matter.
export function evaluateAlert(day: ForecastDay): WeatherAlert {
  if (day.precipitationProbability >= 70 || day.windSpeedMaxKmh >= 60) {
    return { level: "delay-risk", reason: day.windSpeedMaxKmh >= 60 ? "Strong wind may block outdoor work" : "High chance of heavy rain" };
  }
  if (day.precipitationProbability >= 40 || day.windSpeedMaxKmh >= 35) {
    return { level: "watch", reason: day.windSpeedMaxKmh >= 35 ? "Moderate wind expected" : "Rain likely for part of the day" };
  }
  return { level: "none", reason: "No weather risk expected" };
}
