// src/compent/RatesLineChart.tsx
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
  } from "recharts";
  
  export type RatePoint = { date: string; value: number };
  
  export default function RatesLineChart({
    title,
    fromCurrency,
    toCurrency,
    series,
  }: {
    title?: string;
    fromCurrency: string;
    toCurrency: string;
    series: RatePoint[];
  }) {
    const xTickFormatter = (isoDate: string) => {
      const d = new Date(isoDate);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    };
  console.log('series' , series);
    const tooltipFormatter = (val: number) => val.toFixed(4);
    const tooltipLabelFormatter = (isoDate: string) => {
      const d = new Date(isoDate);
      return d.toLocaleDateString();
    };
  
    return (
      <div className="card my-3">
        <div className="card-body">
          <h5 className="card-title mb-3">
            {title ?? `Trend: ${fromCurrency} → ${toCurrency}`}
          </h5>
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <LineChart data={series} margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={xTickFormatter} />
                <YAxis domain={["auto", "auto"]} />
                <Tooltip
                  formatter={tooltipFormatter}
                  labelFormatter={tooltipLabelFormatter}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-muted small mt-2">
            單位：1 {fromCurrency} 兌 {toCurrency}
          </div>
        </div>
      </div>
    );
  }