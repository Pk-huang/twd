// src/services/providers/frankfurter.timeseries.ts
import { type RatesProvider, type TimeseriesResult, ProviderError } from "../rates.types";
import { FRANKFURTER_BASE } from "../defaultAPI";



export const FrankfurterTimeseriesProvider: RatesProvider = {
  name: "frankfurter",
  supports: { latest: false, timeseries: true },

  async timeseries(
    baseCurrency: string,
    symbolCurrency: string,
    startDateString: string,
    endDateString: string
  ): Promise<TimeseriesResult> {
    const url = new URL(`${FRANKFURTER_BASE}/v1/${startDateString}..${endDateString}`);
    url.searchParams.set("base", baseCurrency.toUpperCase());
    url.searchParams.set("symbols", symbolCurrency.toUpperCase());
 
   const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new ProviderError("frankfurter", "NETWORK", `HTTP ${response.status}`);
    }

    const payload = (await response.json()) as {
      rates?: Record<string, Record<string, number>>;
    };

   if (!payload?.rates) {
      throw new ProviderError("frankfurter", "UNKNOWN", "Empty timeseries data");
    }

    const symbolUpper = symbolCurrency.toUpperCase();
    const result: TimeseriesResult = {};

    for (const [dateString, rateObj] of Object.entries(payload.rates)) {
      const value = rateObj[symbolUpper];
      if (typeof value === "number") {
        result[dateString] = value;
      }
    }

    if (Object.keys(result).length === 0) {
      throw new ProviderError(
        "frankfurter",
        "UNSUPPORTED_SYMBOL",
        `No rates found for ${baseCurrency}->${symbolCurrency}`
      );
    }

    return result;
  },
};