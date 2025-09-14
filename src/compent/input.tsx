import { useEffect, useMemo, useState } from "react";
import { getLatest } from "../services/ratesLatest";

type Rates = Record<string, number>;

const fallbackRates: Rates = { USD: 1, TWD: 32.3, EUR: 0.92, JPY: 156.4 };

function convertAmount(
  amountString: string,
  fromCurrency: string,
  toCurrency: string,
  rates: Rates
) {
  const numericAmount = Number(amountString);
  if (!amountString || Number.isNaN(numericAmount)) return "";
  const fromRate = rates[fromCurrency];
  const toRate = rates[toCurrency];
  if (!fromRate || !toRate) return "";
  const amountInBase = numericAmount / fromRate;
  const convertedAmount = amountInBase * toRate;
  return convertedAmount.toFixed(2);
}

export default function ConverterTwoWay() {
  const [rates, setRates] = useState<Rates>(fallbackRates);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const latest = await getLatest("USD", ["USD", "TWD", "EUR", "JPY", "CNY"]);
        if (!mounted) return;

        const base = (latest.base ?? "USD").toUpperCase();
        const next: Rates = { [base]: 1, ...(latest.rates ?? {}) };

        // 正規化：key 全大寫、值轉數字
        const normalized = Object.fromEntries(
          Object.entries(next).map(([k, v]) => [k.toUpperCase(), Number(v)])
        ) as Rates;

        setRates(normalized);
      } catch (err) {
        console.error("getLatest failed:", err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const currencyOptions = useMemo(() => Object.keys(rates).sort(), [rates]);

  const [formData, setFormData] = useState({
    fromCur: "TWD",
    toCur: "USD",
    source: "from" as "from" | "to",
    amt: "",
  });
  const update = (patch: Partial<typeof formData>) =>
    setFormData((prev) => ({ ...prev, ...patch }));

  // 依賴加入 rates
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

  return (
    <section className="pt-5 pb-3 section-input">
      <div className="row justify-content-center align-items-start">
        <div className="col-5 p-lg-5 d-flex flex-column">
          <h3>Unit conversion (From)</h3>
          <select
            className="form-select my-3"
            value={formData.fromCur}
            onChange={(event) => update({ fromCur: event.target.value })}
          >
            {currencyOptions.map((code) => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
          <input
            className="form-control"
            placeholder="Enter amount"
            value={fromAmount}
            onChange={(event) => update({ source: "from", amt: event.target.value })}
          />
        </div>

        <div className="col-5  p-lg-5 d-flex flex-column">
          <h3>Unit conversion (To)</h3>
          <select
            className="form-select my-3"
            value={formData.toCur}
            onChange={(event) => update({ toCur: event.target.value })}
          >
            {currencyOptions.map((code) => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
          <input
            className="form-control"
            placeholder="Enter amount"
            value={toAmount}
            onChange={(event) => update({ source: "to", amt: event.target.value })}
          />
        </div>
      </div>
    </section>
  );
}
