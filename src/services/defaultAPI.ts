// ====================
// 型別
// ====================
export type RatesMap = Record<string, number>;

interface BaseResponse<T> {
  base: string;
  rates: T;
}

export type LatestResponse = BaseResponse<Record<string, number>> & {
  date: string; // ISO YYYY-MM-DD
};

export type TimeseriesResponse = BaseResponse<Record<string, Record<string, number>>> & {
  start_date: string;
  end_date: string;
};

// ====================
// 常數（免金鑰）
// ====================
// 最新匯率：ExchangeRate-API 公開鏡像
export const ERAPI_BASE = "https://open.er-api.com/v6";
// 歷史/區間：Frankfurter（ECB），免金鑰
export const FRANKFURTER_BASE = "https://api.frankfurter.dev";