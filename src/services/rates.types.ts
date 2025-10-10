// src/services/rates.types.ts

/** 共同基準倍率的匯率表，例如：{ USD:1, TWD:32.2, JPY:155.6 } */
export type RatesMap = Record<string, number>;

/** 時間序列：key=YYYY-MM-DD, value=單位匯率 */
export type TimeseriesResult = Record<string, number>;

/** 供應商錯誤碼（統一定義，方便 UI 顯示） */
export type ProviderErrorCode =
  | "NETWORK"
  | "UNSUPPORTED_SYMBOL"
  | "RATE_LIMIT"
  | "AUTH"
  | "UNKNOWN";

/** 供應商錯誤（帶上提供者名稱與錯誤碼） */
export class ProviderError extends Error {
  code: ProviderErrorCode;
  provider: string;
  constructor(provider: string, code: ProviderErrorCode, message: string) {
    super(message);
    this.provider = provider;
    this.code = code;
  }
}

/** 匯率供應商介面（Ports） */
export interface RatesProvider {
  name: string;
  supports: { latest: boolean; timeseries: boolean };
  timeseries?(
    baseCurrency: string,
    symbolCurrency: string,
    startDateString: string,
    endDateString: string
  ): Promise<TimeseriesResult>;
}