// src/components/RatesCards.tsx
import { Card } from "../function/types";

type Props = {
  fromCur: string;                  // 基準幣別（左欄）
  toCur: string;                    // 當前選擇的目標幣別（右欄重點顯示）
  items: Card[];                    // 中欄列表資料
  onSelectCurrency?: (code: string) => void; // 點擊切換
};

export default function RatesCards({
  fromCur,
  toCur,
  items,
  onSelectCurrency,
}: Props) {
  const highlight = items.find((i) => i.code === toCur);

  return (
    <li className="my-lg-3 my-md-1">
      <div className="card">
        <div className="card-body row p-lg-5 p-md-2">
          {/* 左欄 */}
          <div className="col-12 col-md-3 d-flex justify-content-center align-items-center mb-3 mb-md-0">
            <h3 className="card-title mb-0">{fromCur}</h3>
          </div>

          {/* 中欄 */}
          <div className="col-12 col-md-5">
            <ul className="list-unstyled mb-0">
              {items.map(({ code, unitRate }) => {
                const active = code === toCur;
                return (
                  <li
                    key={code}
                    className={`my-2 ${active ? "fw-bold" : ""}`}
                    role={onSelectCurrency ? "button" : undefined}
                    onClick={() => onSelectCurrency?.(code)}
                  >
                    <span className="fw-bold">{code}</span>
                    <span className={`float-end ${active ? "" : "opacity-75"}`}>
                      {unitRate}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* 右欄 */}
          <div className="col text-center d-flex flex-column justify-content-center align-items-center">
            <h2 className="h4 h-md-3">依照當前匯率計算</h2>
            <h3 className="mt-2">
              {toCur} {highlight?.converted || "—"}
            </h3>
          </div>
        </div>
      </div>
    </li>
  );
}
