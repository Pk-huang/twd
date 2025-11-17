// src/function/dateUtils.ts
export function formatDateToISO(date: Date): string {
    return date.toISOString().slice(0, 10);
  }
  
  /** 以 endDateString 為終點，回推含當天的 days 天 */
  export function calcStartByDays(endDateString: string, days: number): string {
    const endDate = new Date(endDateString);
    const start = new Date(endDate);
    start.setDate(endDate.getDate() - (days - 1));
    return formatDateToISO(start);
  }
  
  /** 夾住日期字串在 [min, max] 範圍內 */
  export function clampDateString(value: string, minISO: string, maxISO: string): string {
    if (value < minISO) return minISO;
    if (value > maxISO) return maxISO;
    return value;
  }