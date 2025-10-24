// src/compent/DateRangeControls.tsx
import { useCallback } from "react";

type Props = {
  startDateString: string;   // YYYY-MM-DD
  endDateString: string;     // YYYY-MM-DD
  onChange: (nextStartDateString: string, nextEndDateString: string) => void;
  minDateString?: string;    // 可選：限制最小日期（例如資料源可查詢的最早日）
  maxDateString?: string;    // 可選：限制最大日期（通常是今天）
};

function formatDateToISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function daysAgoISO(days: number): string {
  const today = new Date();
  const from = new Date(today);
  from.setDate(today.getDate() - (days - 1));
  return formatDateToISO(from);
}

export default function DateRangeControls({
  startDateString,
  endDateString,
  onChange,
  minDateString,
  maxDateString,
}: Props) {
  const handleStartChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextStart = event.target.value;
      // 若使用者把開始日期調到比結束還晚，則自動把結束推到同一天
      const adjustedEnd = nextStart > endDateString ? nextStart : endDateString;
      onChange(nextStart, adjustedEnd);
    },
    [endDateString, onChange]
  );

  const handleEndChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextEnd = event.target.value;
      // 若使用者把結束日期調到比開始還早，則自動把開始拉到同一天
      const adjustedStart = nextEnd < startDateString ? nextEnd : startDateString;
      onChange(adjustedStart, nextEnd);
    },
    [startDateString, onChange]
  );

  const applyPresetDays = useCallback(
    (days: number) => {
      const today = new Date();
      const start = daysAgoISO(days);
      const end = formatDateToISO(today);
      onChange(start, end);
    },
    [onChange]
  );

  return (
    <div className="card rounded-0 border border-0 bg-body-secondary">
      <div className="card-body">
        <div className="d-flex align-items-center flex-wrap gap-2">
          <label className="form-label mb-0 me-2">日期區間：</label>

          <input
            type="date"
            className="form-control"
            style={{ width: 180 }}
            value={startDateString}
            min={minDateString}
            max={maxDateString}
            onChange={handleStartChange}
          />

          <span className="mx-2">—</span>

          <input
            type="date"
            className="form-control"
            style={{ width: 180 }}
            value={endDateString}
            min={minDateString}
            max={maxDateString}
            onChange={handleEndChange}
          />

          <div className="ms-auto d-flex gap-2">
            <button type="button" className="btn btn-outline-secondary btn-sm"
              onClick={() => applyPresetDays(7)}>
              近 7 天
            </button>
            <button type="button" className="btn btn-outline-secondary btn-sm"
              onClick={() => applyPresetDays(14)}>
              近 14 天
            </button>
            <button type="button" className="btn btn-outline-secondary btn-sm"
              onClick={() => applyPresetDays(30)}>
              近 30 天
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}