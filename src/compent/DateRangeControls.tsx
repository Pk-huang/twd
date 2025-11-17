// src/compent/DateRangeControls.tsx
import { useCallback, useMemo } from "react";
import { calcStartByDays, clampDateString, formatDateToISO } from "../function/dateUtils";

type DateRangeControlsProps = {
  startDateString: string;   // YYYY-MM-DD
  endDateString: string;     // YYYY-MM-DD
  onChange: (nextStartDateString: string, nextEndDateString: string) => void;

  // 可選：限制可選範圍
  minDateString?: string;    // 預設 1999-01-04
  maxDateString?: string;    // 預設今天

  // 快速範圍
  selectedPresetDays: number | null;      // 7 | 14 | 30 | null
  onPresetSelect: (days: number) => void;
};

export default function DateRangeControls({
  startDateString,
  endDateString,
  onChange,
  minDateString,
  maxDateString,
  selectedPresetDays,
  onPresetSelect,
}: DateRangeControlsProps) {
  const todayISO = useMemo(() => formatDateToISO(new Date()), []);
  const minISO = minDateString ?? "1999-01-04";
  const maxISO = maxDateString ?? todayISO;

  /** 統一出口：先校正（clamp、start<=end），再丟給父層 */
  const emitCorrected = useCallback(
    (rawStart: string, rawEnd: string) => {
      const startClamped = clampDateString(rawStart, minISO, maxISO);
      const endClamped = clampDateString(rawEnd, minISO, maxISO);

      const startFixed = startClamped <= endClamped ? startClamped : endClamped;
      const endFixed = endClamped >= startClamped ? endClamped : startClamped;

      onChange(startFixed, endFixed);
    },
    [minISO, maxISO, onChange]
  );

  const handleStartChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      emitCorrected(event.target.value, endDateString);
    },
    [emitCorrected, endDateString]
  );

  const handleEndChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      emitCorrected(startDateString, event.target.value);
    },
    [emitCorrected, startDateString]
  );

  const applyPreset = useCallback(
    (days: number) => {
      const safeEnd = clampDateString(endDateString, minISO, maxISO);
      const startByPreset = calcStartByDays(safeEnd, days);
      emitCorrected(startByPreset, safeEnd);
      onPresetSelect(days);
    },
    [endDateString, minISO, maxISO, emitCorrected, onPresetSelect]
  );

  return (
    <div className="card my-3 border-0">
      <div className="card-body d-flex align-items-center flex-wrap gap-2">
        <label className="form-label mb-0 me-2">日期區間：</label>

        <input
          type="date"
          className="form-control"
          style={{ width: 180 }}
          value={startDateString}
          min={minISO}
          max={maxISO}
          onChange={handleStartChange}
          aria-label="開始日期"
        />

        <span className="mx-2">—</span>

        <input
          type="date"
          className="form-control"
          style={{ width: 180 }}
          value={endDateString}
          min={minISO}
          max={maxISO}
          onChange={handleEndChange}
          aria-label="結束日期"
        />

        <div className="ms-auto d-flex gap-2">
          {[7, 14, 30].map((days) => (
            <button
              key={days}
              type="button"
              className={`btn btn-outline-secondary btn-sm btn-range ${selectedPresetDays === days ? "active" : ""}`}
              onClick={() => applyPreset(days)}
              aria-pressed={selectedPresetDays === days}
            >
              近 {days} 天
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}