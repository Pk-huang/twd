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
    <div className="row  p-3">

  
      <div className="col-6  d-flex flex-column ">
        <h5 className="px-2">Unit conversion (From)</h5>
        <select
          className="form-select border-0 bg-body-secondary"
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
          className="form-control mt-2 border-0 bg-body-secondary"
          placeholder="Enter amount"
          value={fromAmount}
          onChange={(e) => onChange({ source: "from", amt: e.target.value })}
        />
      </div>

      <div className="col-6 d-flex flex-column ">
        <h5 className="px-2">Unit conversion (To)</h5>
        <select
          className="form-select border-0 bg-body-secondary"
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
          className="form-control mt-2 border-0 bg-body-secondary"
          placeholder="Enter amount"
          value={toAmount}
          onChange={(e) => onChange({ source: "to", amt: e.target.value })}
        />
      </div>
      </div>
    </>
  );
}
