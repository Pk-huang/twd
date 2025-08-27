import { FRANKFURTER_BASE } from "./defaultAPI";
import type { TimeseriesResponse } from "./defaultAPI";


// ====================
// API：區間/歷史（免金鑰，用 Frankfurter timeseries）
//   說明：為了你的曲線圖，這裡用 Frankfurter（ECB）提供的 timeseries。
//   你仍然可以用任意 base，Frankfurter 支援 base 參數。
// ====================
export async function getTimeseries(params: {
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD
  base: string;
  symbol: string; // 建議一次取一種幣別來畫線
}): Promise<TimeseriesResponse> {
  const { start, end, base, symbol } = params;
  try {
    const qs = new URLSearchParams({
      start_date: start,
      end_date: end,
      base,
      symbols: symbol,
    });
    const res = await fetch(`${FRANKFURTER_BASE}/v1/${start}..${end}?base=${base}&symbol=${symbol}`);
    console.log("fetch", `${FRANKFURTER_BASE}/timeseries?${qs.toString()}`);
    if (!res.ok) throw new Error(`getTimeseries failed: HTTP ${res.status}`);
    const d = await res.json();
    // d: { amount, base, start_date, end_date, rates: { '2025-08-01': { USD: 0.031 }, ... } }
    return {
      base: d.base,
      start_date: d.start_date,
      end_date: d.end_date,
      rates: d.rates as Record<string, Record<string, number>>,
    };
  } catch (err) {
    console.error("[getTimeseries] Error:", err);
    throw err;
  }
}