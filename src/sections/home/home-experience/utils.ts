import dayjs from "dayjs";

import { EXPERIENCE, DATE_FORMAT } from "./const";

import type { ExperienceItem } from "./types";

// ----------------------------------------------------------------------

const formatPeriodDate = (value: string, locale: string) =>
  dayjs(value).locale(locale).format(DATE_FORMAT);

// `presentLabel` is the localized «настоящее время» word, passed in from the
// component (`home.experience.present`) since this pure helper can't call `t()`.
export const getPeriodLabel = (
  item: ExperienceItem,
  presentLabel: string,
  locale: string,
) => {
  const startLabel = formatPeriodDate(item.startDate, locale);

  if (!item.endDate) {
    return `${startLabel} — ${presentLabel}`;
  }

  return `${startLabel} — ${formatPeriodDate(item.endDate, locale)}`;
};

export const getSortedExperience = () =>
  [...EXPERIENCE].sort(
    (a, b) => dayjs(b.startDate).valueOf() - dayjs(a.startDate).valueOf(),
  );
