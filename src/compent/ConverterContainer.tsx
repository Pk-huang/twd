// src/compent/ConverterContainer.tsx
import { useEffect, useMemo, useState } from "react";
import TopControls from "./TopControls";
import RatesCards from "./RatesCards";
import { getLatest } from "../services/ratesLatest";
// import { getTimeseries } from "../services/ratesTimeseries";
import convertAmount from "../function/convertAmount";
import type { Rates, FormState } from "../function/types";
import RatesLineChart from "./RatesLineChart";
import { buildSeriesFromTimeseries } from "../function/series";

import { fetchTimeseries } from "../services/rates.repository";
import DateRangeControls from "./DateRangeControls";




const WATCH_LIST = ["USD", "EUR", "JPY", "CNY"] as const;

const fallbackRates: Rates = {};

function formatDateToISO(date: Date): string {
    return date.toISOString().slice(0, 10);
}
function getDefaultRange(days: number = 14) {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - (days - 1));
    return { startDateString: formatDateToISO(start), endDateString: formatDateToISO(today) };
}



export default function ConverterContainer() {
    // 匯率
    const [rates, setRates] = useState<Rates>(fallbackRates);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // 表單狀態
    const [formData, setFormData] = useState<FormState>({
        fromCur: "USD",
        toCur: "EUR",
        source: "from",
        amt: "",
    });
    const update = (patch: Partial<FormState>) =>
        setFormData((prev) => ({ ...prev, ...patch }));

    // 抓最新匯率（保留你 services 架構）
    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                setLoading(true);
                setErrorMsg(null);
                const res = await getLatest("USD", [...WATCH_LIST]);
                if (!alive) return;

                const base = (res?.base ?? "USD").toUpperCase();
                const raw = { [base]: 1, ...(res?.rates ?? {}) } as Record<string, number>;
                const normalized = Object.fromEntries(
                    Object.entries(raw).map(([k, v]) => [k.toUpperCase(), Number(v)])
                ) as Rates;

                setRates(normalized);
            } catch (err) {
                if (alive) setErrorMsg(err instanceof Error ? err.message : String(err));
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => {
            alive = false;
        };
    }, []);

    // 下拉選項
    const currencyOptions = useMemo(() => Object.keys(rates).sort(), [rates]);

    // 上方兩側顯示金額（雙向：誰最後輸入誰是來源）
    const fromAmount = useMemo(() => {
        return formData.source === "from"
            ? formData.amt
            : convertAmount(formData.amt, formData.toCur, formData.fromCur, rates);
    }, [formData.amt, formData.source, formData.fromCur, formData.toCur, rates]);

    const toAmount = useMemo(() => {
        return formData.source === "to"
            ? formData.amt
            : convertAmount(formData.amt, formData.fromCur, formData.toCur, rates);
    }, [formData.amt, formData.source, formData.fromCur, formData.toCur, rates]);

 
    // 新增：日期區間 state（預設近 14 天）
    const [dateRange, setDateRange] = useState(() => getDefaultRange(14));
    const { startDateString, endDateString } = dateRange;

    const handleRangeChange = (nextStartDateString: string, nextEndDateString: string) => {
        setDateRange({ startDateString: nextStartDateString, endDateString: nextEndDateString });
    };

    // 抓取 timeseries（依 fromCur/toCur/日期區間 變化）
    const [timeseriesData, setTimeseriesData] = useState<Record<string, number>>({});
    const [isTimeseriesLoading, setIsTimeseriesLoading] = useState(false);
    const [timeseriesError, setTimeseriesError] = useState<string | null>(null);

    useEffect(() => {
        let isAlive = true;
        (async () => {
            try {
                setIsTimeseriesLoading(true);
                setTimeseriesError(null);
                const data = await fetchTimeseries(
                    formData.fromCur,
                    formData.toCur,
                    startDateString,
                    endDateString
                );
                if (!isAlive) return;
                setTimeseriesData(data);
            } catch (error) {
                if (!isAlive) return;
                setTimeseriesError(error instanceof Error ? error.message : String(error));
                setTimeseriesData({});
            } finally {
                if (isAlive) setIsTimeseriesLoading(false);
            }
        })();
        return () => { isAlive = false; };
    }, [formData.fromCur, formData.toCur, startDateString, endDateString]);

    // 轉換為圖表可用陣列
    const lineSeries = useMemo(
        () => buildSeriesFromTimeseries(timeseriesData),
        [timeseriesData]
    );

    // …你的 TopControls / RatesCards 等 

    return (
        <>
            {/* loading / error 提示（可自行美化） */}
            {loading && <div className="alert alert-light my-3">Loading exchange rates…</div>}
            {errorMsg && <div className="alert alert-danger my-3">Failed to load rates: {errorMsg}</div>}

            {/* 上方輸入區 */}
            <div className="row align-items-start">
                <div className="col-6">
                    <TopControls
                        currencyOptions={currencyOptions}
                        fromAmount={fromAmount ?? ""}
                        toAmount={toAmount ?? ""}
                        formData={formData}
                        onChange={update}
                    />
                </div>
                <div className="col-6">
                    <RatesLineChart
                        fromCurrency={formData.fromCur}
                        toCurrency={formData.toCur}
                        series={lineSeries}
                    />
                </div>

            </div>
            <DateRangeControls
                startDateString={startDateString}
                endDateString={endDateString}
                onChange={handleRangeChange}
                // 可選：限制最小/最大可選日期
                // minDateString="1999-01-04"
                maxDateString={formatDateToISO(new Date())}
            />


            {/* 下方卡片（單張：左基準 + 中列表 + 右重點） */}
            <section className="mt-3">
                {isTimeseriesLoading && (
                    <div className="alert alert-light">Loading chart…</div>
                )}
                {timeseriesError && (
                    <div className="alert alert-warning">
                        曲線資料抓取失敗：{timeseriesError}
                    </div>
                )}
                {!isTimeseriesLoading && !timeseriesError && (
                    <RatesLineChart
                        fromCurrency={formData.fromCur}
                        toCurrency={formData.toCur}
                        series={lineSeries}
                    />
                )}
            </section>
        </>
    );
}