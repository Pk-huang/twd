// src/function/convertAmount.ts

export type Rates = Record<string, number>;

export type ConvertOptions = {
  decimalPlaces?: number;   // 預設 2
  emptyAsEmpty?: boolean;   // 預設 true
};

/** 算「1 fromCur 可換多少 toCur」 */
export function getUnitRate(
  fromCurrency: string,
  toCurrency: string,
  rates: Rates
): number | null {
  const from = rates[fromCurrency];
  const to = rates[toCurrency];
  if (typeof from !== "number" || typeof to !== "number" || from === 0) {
    return null;
  }
  return to / from;
}

/** 金額換算 */
export function convertAmount(
  amountString: string,
  fromCurrency: string,
  toCurrency: string,
  rates: Rates,
  options: ConvertOptions = {}
): string {
  const { decimalPlaces = 2, emptyAsEmpty = true } = options;

  if (amountString === "" || amountString == null) {
    return emptyAsEmpty ? "" : (0).toFixed(decimalPlaces);
  }

  const numericAmount = Number(amountString);
  if (Number.isNaN(numericAmount)) return "";

  const fromRate = rates[fromCurrency];
  const toRate = rates[toCurrency];
  if (typeof fromRate !== "number" || typeof toRate !== "number" || fromRate === 0) {
    return "";
  }

  const amountInBase = numericAmount / fromRate;
  const convertedAmount = amountInBase * toRate;
  return convertedAmount.toFixed(decimalPlaces);
}

export default convertAmount;
