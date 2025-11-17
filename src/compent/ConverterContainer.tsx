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


// 🔽 新增
import DateRangeControls from "./DateRangeControls";
import { calcStartByDays, formatDateToISO } from "../function/dateUtils";
import { fetchTimeseries } from "../services/rates.repository";





const WATCH_LIST = ["USD", "EUR", "JPY", "CNY"] as const;

const fallbackRates: Rates = {};

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

    // 交換幣別（可一起對調輸入來源）
    const swapCurrencies = () =>
        setFormData(prev => ({
            ...prev,
            fromCur: prev.toCur,
            toCur: prev.fromCur,
            source: prev.source === "from" ? "to" : "from",
        }));

    // 日期區間（預設近 14 天）
    const [dateRange, setDateRange] = useState(() => {
        const end = formatDateToISO(new Date());
        const start = calcStartByDays(end, 14);
        return { startDateString: start, endDateString: end };
    });
    const [selectedPresetDays, setSelectedPresetDays] = useState<number | null>(14);

    // timeseries 狀態
    const [timeseriesData, setTimeseriesData] = useState<Record<string, number>>({});
    const [isTimeseriesLoading, setIsTimeseriesLoading] = useState(false);
    const [timeseriesError, setTimeseriesError] = useState<string | null>(null);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                setIsTimeseriesLoading(true);
                setTimeseriesError(null);
                const data = await fetchTimeseries(
                    formData.fromCur,
                    formData.toCur,
                    dateRange.startDateString,
                    dateRange.endDateString
                );
                if (alive) setTimeseriesData(data);
            } catch (error) {
                if (alive) {
                    setTimeseriesError(error instanceof Error ? error.message : String(error));
                    setTimeseriesData({});
                }
            } finally {
                if (alive) setIsTimeseriesLoading(false);
            }
        })();
        return () => { alive = false; };
    }, [formData.fromCur, formData.toCur, dateRange.startDateString, dateRange.endDateString]);

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
                <div className="col-12">
                    <TopControls
                        currencyOptions={currencyOptions}
                        fromAmount={fromAmount ?? ""}
                        toAmount={toAmount ?? ""}
                        formData={formData}
                        onChange={update}
                        onSwap={swapCurrencies}
                    />
                </div>
                <div className="col-12 py-3 ">
                    <DateRangeControls
                        startDateString={dateRange.startDateString}
                        endDateString={dateRange.endDateString}
                        onChange={(start, end) => {
                            setDateRange({ startDateString: start, endDateString: end });
                            setSelectedPresetDays(null); // 手動改日期 → 取消 active
                        }}
                        selectedPresetDays={selectedPresetDays}
                        onPresetSelect={setSelectedPresetDays}
                        maxDateString={formatDateToISO(new Date())}
                    />

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
                </div>

            </div>



            {/* 下方卡片（單張：左基準 + 中列表 + 右重點） */}
            <section className="mt-3">
                <ul className="list-unstyled row flex-wrap justify-content-between">
                    <RatesCards
                        rates={rates}
                        watchList={WATCH_LIST}
                        fromCur={formData.fromCur}
                        toCur={formData.toCur}
                        baseAmountInFromCur={fromAmount ?? ""}
                        onSelectCurrency={(code) => update({ toCur: code })}
                    />
                </ul>
            </section>
        </>
    );
}