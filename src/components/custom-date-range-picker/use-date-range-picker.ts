import type { Dayjs } from "dayjs";

import { useState, useCallback } from "react";
import { fIsAfter, fDateRangeShortLabel } from "src/utils/format-time";

// ----------------------------------------------------------------------

type DateValue = Dayjs | null;

export function useDateRangePicker(start: DateValue, end: DateValue) {
  const [open, setOpen] = useState(false);

  const [endDate, setEndDate] = useState(end);

  const [startDate, setStartDate] = useState(start);

  const error = fIsAfter(startDate, endDate);

  const onOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  const onChangeStartDate = useCallback((newValue: DateValue) => {
    setStartDate(newValue);
  }, []);

  const onChangeEndDate = useCallback(
    (newValue: DateValue) => {
      if (error) {
        setEndDate(null);
      }
      setEndDate(newValue);
    },
    [error],
  );

  const onReset = useCallback(() => {
    setStartDate(null);
    setEndDate(null);
  }, []);

  return {
    startDate,
    endDate,
    onChangeStartDate,
    onChangeEndDate,
    //
    open,
    onOpen,
    onClose,
    onReset,
    //
    selected: !!startDate && !!endDate,
    error,
    //
    label: fDateRangeShortLabel(startDate, endDate, true),
    shortLabel: fDateRangeShortLabel(startDate, endDate),
    //
    setStartDate,
    setEndDate,
  };
}
