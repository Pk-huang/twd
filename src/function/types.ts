// src/function/types.ts

/** 匯率表，建議 key 一律大寫 */
export type Rates = Record<string, number>;

/** 表單狀態 */
export type FormState = {
  fromCur: string;
  toCur: string;
  source: "from" | "to";
  amt: string;
};

/** 單張卡片要顯示的資料 */
export type Card = {
  code: string;          // 幣別代碼，例如 USD
  unitRate: string;      // 1 fromCur 可換多少目標幣別（格式化後字串）
  converted: string;     // 依目前輸入金額換算到目標幣別
};
