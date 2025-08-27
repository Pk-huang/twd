import { ERAPI_BASE } from "./defaultAPI";
import type { LatestResponse } from "./defaultAPI";

// ====================
// 工具
// ====================
function toISODate(ts: number | string): string {
  // ER-API 回傳 unix 或 UTC 字串；統一轉 YYYY-MM-DD
  if (typeof ts === "number") {
    return new Date(ts * 1000).toISOString().slice(0, 10);
  }
  // "Sun, 25 Aug 2025 00:00:01 +0000" -> 轉 Date
  const d = new Date(ts);
  return isNaN(d.getTime()) ? String(ts).slice(0, 10) : d.toISOString().slice(0, 10);
}

// ====================
// API：最新匯率（免金鑰，支援任意 base）
// ====================
export async function getLatest(base: string, symbols?: string[]): Promise<LatestResponse> {
  try {
    const res = await fetch(`${ERAPI_BASE}/latest/${encodeURIComponent(base)}`);
   
    if (!res.ok) throw new Error(`getLatest failed: HTTP ${res.status}`);
    const raw = await res.json();
    
    // 期望欄位（ER-API v6）：result, base_code, rates, time_last_update_unix/time_last_update_utc
    if (raw.result !== "success" || !raw.rates) {
      throw new Error(raw["error-type"] || "API error");
    }
    let rates: Record<string, number> = raw.rates as Record<string, number>;
    if (symbols && symbols.length) {
      rates = symbols.reduce((acc, s) => {
        if (rates[s] != null) acc[s] = rates[s];
        return acc;
      }, {} as Record<string, number>);
    }
    const date = toISODate(raw.time_last_update_unix ?? raw.time_last_update_utc);
    return { base: raw.base_code || base, date, rates };
  } catch (err) {
    console.error("[getLatest] Error:", err);
    throw err;
  }
}


