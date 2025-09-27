// src/compent/RatesCards.tsx
import { useMemo } from "react";
import convertAmount from "../function/convertAmount";
import type { Rates } from "../function/types";

type Props = {
  rates: Rates;
  watchList: readonly string[];
  fromCur: string;
  toCur: string;
  baseAmountInFromCur: string;
  onSelectCurrency?: (code: string) => void;
};

export default function RatesCards({
  rates,
  watchList,
  fromCur,
  toCur,
  baseAmountInFromCur,
  onSelectCurrency,
}: Props) {
  const validBases = useMemo(
    () => watchList.filter((code) => !!rates[code]),
    [watchList, rates]
  );

  return (
    <>
      {validBases.map((baseCode) => {
        // 使用者輸入金額，先換成本卡片 baseCode 的數值
        const amountInThisBase =
          baseCode === fromCur
            ? baseAmountInFromCur
            : convertAmount(baseAmountInFromCur, fromCur, baseCode, rates);

        // 單位匯率：1 baseCode 可換多少 toCur
        const unitRateBaseToToCur =
          rates[baseCode] && rates[toCur]
            ? (rates[toCur]! / rates[baseCode]!).toFixed(4)
            : "";

        // 結果：amountInThisBase × unitRate
        const highlightConverted = convertAmount(
          amountInThisBase || "",
          baseCode,
          toCur,
          rates
        );

        // 中欄：列出 1 baseCode 可換多少其他幣別
        const listItems = watchList
          .filter((code) => code !== baseCode && !!rates[code])
          .map((code) => {
            const unitRate = (rates[code]! / rates[baseCode]!).toFixed(4);
            const isActive = code === toCur;
            return (
              <li
                key={`${baseCode}->${code}`}
                className={`my-2 ${isActive ? "fw-bold" : ""}`}
                role={onSelectCurrency ? "button" : undefined}
                onClick={() => onSelectCurrency?.(code)}
              >
                <span className="fw-bold">{code}</span>
                <span className={`float-end ${isActive ? "" : "opacity-75"}`}>
                  {unitRate}
                </span>
              </li>
            );
          });

        return (
          <li key={baseCode} className="my-lg-3 my-md-1 col-6">
            <div className="card">
              <div className="card-body row p-lg-5 p-md-2">
                {/* 左欄：本卡片基準幣別 */}
                <div className="col-12 col-md-3 pb-3">
                  <h3 className="card-title mb-0">{baseCode}</h3>
                </div>

                {/* 中欄：1 base -> 其他幣別的單位匯率 */}
                <div className="col-12 col-md-12 pb-3">
                  <ul className="list-unstyled mb-0">{listItems}</ul>
                </div>

                {/* 右欄：依照當前匯率計算 (baseCode × Unit conversion) */}
                <div className="col ">
                  <h2 className="h4">依照當前匯率計算 Unit conversion</h2>
                  <div className="mt-2">
                  <div className="fs-5 mt-2">
                     
                   
                      <span className="fw-bold">{amountInThisBase || "0"}</span>{" "}
                      <span className="fw-bold">{baseCode}</span>
                
                    </div>
                
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </>
  );
}