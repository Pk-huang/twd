// services/ratesTimeseries.ts
export type Timeseries = Record<string, number>;

type GetTimeseriesParams = {
  base: string;   // 來源幣別，例如 "USD"
  symbol: string; // 目標幣別，例如 "TWD"
  start: string;  // 開始日期 "YYYY-MM-DD"
  end: string;    // 結束日期 "YYYY-MM-DD"
};

export async function getTimeseries({ base, symbol, start, end }: GetTimeseriesParams) {
  const url = new URL("https://api.exchangerate.host/timeseries");
  url.searchParams.set("base", base.toUpperCase());
  url.searchParams.set("symbols", symbol.toUpperCase());
  url.searchParams.set("start_date", start);
  url.searchParams.set("end_date", end);

  const res = await fetch(url.toString());
  console.log("timeseries URL:", url.toString());
  if (!res.ok) throw new Error(`timeseries HTTP ${res.status}`);

  const json = await res.json() as {
    success: boolean;
    rates: Record<string, Record<string, number>>;
  };

  if (!json.success) throw new Error("timeseries failed");

  const out: Timeseries = {};
  const sym = symbol.toUpperCase();

  for (const [date, perDay] of Object.entries(json.rates ?? {})) {
    const v = perDay[sym];
    if (typeof v === "number") out[date] = v;
  }

  if (Object.keys(out).length === 0) {
    throw new Error(`timeseries empty: provider may not support ${sym}`);
  }

  return out;
}