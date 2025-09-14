// src/components/TopControls.tsx
// src/components/TopControls.tsx
import type { FormState } from "../function/types";

type Props = {
  currencyOptions: string[];
  fromAmount: string;
  toAmount: string;
  formData: FormState;
  onChange: (patch: Partial<FormState>) => void;
};

export default function TopControls({
  currencyOptions,
  fromAmount,
  toAmount,
  formData,
  onChange,
}: Props) {
  return (
    <>
      <div className="col-5 p-lg-5 d-flex flex-column">
        <h3>Unit conversion (From)</h3>
        <select
          className="form-select my-3"
          value={formData.fromCur}
          onChange={(e) => onChange({ fromCur: e.target.value })}
        >
          {currencyOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          className="form-control"
          placeholder="Enter amount"
          value={fromAmount}
          onChange={(e) => onChange({ source: "from", amt: e.target.value })}
        />
      </div>

      <div className="col-5 d-flex flex-column">
        <h3>Unit conversion (To)</h3>
        <select
          className="form-select my-3"
          value={formData.toCur}
          onChange={(e) => onChange({ toCur: e.target.value })}
        >
          {currencyOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          className="form-control"
          placeholder="Enter amount"
          value={toAmount}
          onChange={(e) => onChange({ source: "to", amt: e.target.value })}
        />
      </div>
    </>
  );
}
