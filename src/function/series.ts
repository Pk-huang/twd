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

/** 依目前匯率做一條可視化的 mock 線（先跑得起來） */
export function makeMockSeries(
  baseUnitRate: number, // 例：rates[to]/rates[from]
  days: number = 14
): RatePoint[] {
  const today = new Date();
  const out: RatePoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const drift = 1 + 0.01 * Math.sin(i / 2);           // 小幅波動
    const noise = 1 + (Math.random() - 0.5) * 0.004;    // 微小雜訊
    out.push({
      date: d.toISOString().slice(0, 10),
      value: baseUnitRate * drift * noise,
    });
  }
  return out;
}