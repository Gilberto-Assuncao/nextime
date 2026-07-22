export type ForecastDay = {
  date: string; // YYYY-MM-DD, site-local calendar day
  temperatureMinC: number;
  temperatureMaxC: number;
  precipitationProbability: number; // 0-100
  precipitationMm: number;
  windSpeedMaxKmh: number;
  conditionCode: number; // provider-specific weather code, kept for traceability
};

export type WeatherProvider = {
  name: string;
  fetchForecast: (latitude: number, longitude: number, days: number) => Promise<ForecastDay[]>;
};
