// src/compent/ConverterContainer.tsx
import { useEffect, useMemo, useState } from "react";
import TopControls from "./TopControls";
import RatesCards from "./RatesCards";
import { getLatest } from "../services/ratesLatest";
// import { getTimeseries } from "../services/ratesTimeseries";
import convertAmount from "../function/convertAmount";
import type { Rates, FormState } from "../function/types";
import RatesLineChart from "./RatesLineChart";
import { makeMockSeries } from "../function/series";

import {  fetchTimeseries } from "../services/rates.repository";


fetchTimeseries("USD", "JPY", "2024-01-01", "2024-01-14").then(console.log)

const WATCH_LIST = ["USD", "TWD", "EUR", "JPY", "CNY"] as const;

// 後備匯率（API 尚未回來前可先用）
const fallbackRates: Rates = { USD: 1, TWD: 32.3, EUR: 0.92, JPY: 156.4, CNY: 7.25 };

export default function ConverterContainer() {
    // 匯率
    const [rates, setRates] = useState<Rates>(fallbackRates);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // 表單狀態
    const [formData, setFormData] = useState<FormState>({
        fromCur: "TWD",
        toCur: "USD",
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

    // 以 fromCur 為基準的金額（供卡片批次換算）
    const baseAmountInFromCur = useMemo(() => {
        return formData.source === "from"
            ? formData.amt
            : convertAmount(formData.amt, formData.toCur, formData.fromCur, rates);
    }, [formData.amt, formData.source, formData.fromCur, formData.toCur, rates]);



    const currentUnitRate =
        rates[formData.fromCur] && rates[formData.toCur]
            ? rates[formData.toCur] / rates[formData.fromCur]
            : 0;

    // 先用 mock 產 14 天序列；等你有 API 再換 buildSeriesFromTimeseries(...)
    const lineSeries = useMemo(
        () => makeMockSeries(currentUnitRate, 14),
        [currentUnitRate]
    );

 

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

            {/* 下方卡片（單張：左基準 + 中列表 + 右重點） */}
            <section className="mt-4">
                <ul className="list-unstyled row flex-wrap justify-content-between">
                    <RatesCards
                        rates={rates}
                        watchList={WATCH_LIST}
                        fromCur={formData.fromCur}
                        toCur={formData.toCur}
                        baseAmountInFromCur={baseAmountInFromCur ?? ""}
                        onSelectCurrency={(code) => update({ toCur: code })}
                    />
                </ul>
            </section>
        </>
    );
}