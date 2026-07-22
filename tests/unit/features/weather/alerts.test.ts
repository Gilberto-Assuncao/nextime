import { describe, expect, it } from "vitest";
import { evaluateAlert } from "@/src/features/weather/alerts";
import type { ForecastDay } from "@/src/infrastructure/weather/types";

function day(overrides: Partial<ForecastDay> = {}): ForecastDay {
  return {
    date: "2026-07-22",
    temperatureMinC: 15,
    temperatureMaxC: 22,
    precipitationProbability: 10,
    precipitationMm: 0,
    windSpeedMaxKmh: 10,
    conditionCode: 0,
    ...overrides,
  };
}

describe("evaluateAlert", () => {
  it("returns none for calm, dry weather", () => {
    expect(evaluateAlert(day()).level).toBe("none");
  });

  it("returns watch at 40% precipitation probability", () => {
    expect(evaluateAlert(day({ precipitationProbability: 40 })).level).toBe("watch");
  });

  it("returns delay-risk at 70% precipitation probability", () => {
    expect(evaluateAlert(day({ precipitationProbability: 70 })).level).toBe("delay-risk");
  });

  it("returns watch at 35 km/h wind", () => {
    expect(evaluateAlert(day({ windSpeedMaxKmh: 35 })).level).toBe("watch");
  });

  it("returns delay-risk at 60 km/h wind", () => {
    expect(evaluateAlert(day({ windSpeedMaxKmh: 60 })).level).toBe("delay-risk");
  });

  it("prioritizes the wind reason over rain when both cross the delay-risk threshold", () => {
    const result = evaluateAlert(day({ precipitationProbability: 80, windSpeedMaxKmh: 65 }));
    expect(result.level).toBe("delay-risk");
    expect(result.reason).toMatch(/wind/i);
  });
});
