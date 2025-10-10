// src/function/series.ts
export type RatePoint = { date: string; value: number };

/** 把 timeseries 物件（key=YYYY-MM-DD, val=number）轉為陣列並排序 */
export function buildSeriesFromTimeseries(
  timeseries: Record<string, number>
): RatePoint[] {
  return Object.entries(timeseries)
    .map(([date, value]) => ({ date, value: Number(value) }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}

