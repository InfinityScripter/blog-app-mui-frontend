import dayjs from "dayjs";

import { EXPERIENCE, DATE_FORMAT, CURRENT_PERIOD_LABEL } from "./const";

import type { ExperienceItem } from "./types";

// ----------------------------------------------------------------------

const formatPeriodDate = (value: string) =>
  dayjs(value).locale("ru").format(DATE_FORMAT);

export const getPeriodLabel = (item: ExperienceItem) => {
  const startLabel = formatPeriodDate(item.startDate);

  if (!item.endDate) {
    return `${startLabel} — ${CURRENT_PERIOD_LABEL}`;
  }

  return `${startLabel} — ${formatPeriodDate(item.endDate)}`;
};

export const getSortedExperience = () =>
  [...EXPERIENCE].sort(
    (a, b) => dayjs(b.startDate).valueOf() - dayjs(a.startDate).valueOf(),
  );
