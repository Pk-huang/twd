// src/compent/RatesCards.tsx
import { useMemo } from "react";
import convertAmount from "../function/convertAmount";
import type { Rates } from "../function/types";

type Props = {
  /** 匯率表（key 建議大寫） */
  rates: Rates;
  /** 要渲染哪些基準幣別的卡片 */
  watchList: readonly string[];
  /** 目前上方選的 fromCur（用來把輸入金額換到各卡片 base） */
  fromCur: string;
  /** 目前上方選的 toCur（右欄重點顯示的目標幣別、亦可被點擊切換） */
  toCur: string;
  /** 以 fromCur 為單位的數字字串（上方輸入最後主導的一側換回 fromCur 的金額） */
  baseAmountInFromCur: string;
  /** 點擊中欄幣別時要切換的 callback（通常用來 set toCur） */
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
  // 預先把 watchList 中 API 沒提供的幣別過濾掉
  const validBases = useMemo(
    () => watchList.filter((code) => !!rates[code]),
    [watchList, rates]
  );

  return (
    <>
      {validBases.map((baseCode) => {
        // 先把使用者金額（fromCur）轉成「本卡片 baseCode」的金額
        const amountInThisBase =
          baseCode === fromCur
            ? baseAmountInFromCur
            : convertAmount(baseAmountInFromCur, fromCur, baseCode, rates);

        // 右欄重點顯示：以「本卡片 base」為起點，轉到目前 toCur
        const highlightConverted = convertAmount(
          amountInThisBase || "",
          baseCode,
          toCur,
          rates
        );

        // 中欄清單：1 base 可換多少其他幣別
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
          <li key={baseCode} className="my-lg-3 my-md-1 col-12">
            <div className="card">
              <div className="card-body row p-lg-5 p-md-2">
                {/* 左：本卡片基準幣別 */}
                <div className="col-12 col-md-3 d-flex justify-content-center align-items-center mb-3 mb-md-0">
                  <h3 className="card-title mb-0">{baseCode}</h3>
                </div>

                {/* 中：1 base -> 其他幣別的單位匯率 */}
                <div className="col-12 col-md-5">
                  <ul className="list-unstyled mb-0">{listItems}</ul>
                </div>

                {/* 右：依照當前匯率計算（把使用者輸入換到 base，再轉到 toCur） */}
                <div className="col text-center d-flex flex-column justify-content-center align-items-center">
                  <h2 className="h4">依照當前匯率計算</h2>
                  <h3 className="mt-2">
                    {toCur} {highlightConverted || "—"}
                  </h3>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </>
  );
}