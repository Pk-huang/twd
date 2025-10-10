// src/services/rates.repository.ts
import {
    type RatesProvider,
    ProviderError,
    type TimeseriesResult,
  } from "./rates.types";
  
  import { FrankfurterTimeseriesProvider } from "./providers/frankfurter.timeseries";
  
  const TS_PROVIDERS: RatesProvider[] = [FrankfurterTimeseriesProvider];
  
  
  
  // ---- 時間序列 ----
  export async function fetchTimeseries(
    baseCurrency: string,
    symbolCurrency: string,
    startDateString: string,
    endDateString: string
  ): Promise<TimeseriesResult> {
    for (const provider of TS_PROVIDERS) {
      if (!provider.timeseries) continue;
      try {
        return await provider.timeseries(
          baseCurrency,
          symbolCurrency,
          startDateString,
          endDateString
        );
      } catch {
        continue;
      }
    }
    throw new ProviderError("repository", "UNKNOWN", "All timeseries providers failed");
  }