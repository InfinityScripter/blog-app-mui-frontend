import { useState, useEffect } from "react";

import { yearAnchorId } from "../utils";

// ----------------------------------------------------------------------

/**
 * Scrollspy for the year nav: watches the first timeline item of every year
 * (anchors rendered with {@link yearAnchorId}) and reports the year currently
 * in the reading zone (upper third of the viewport). Re-observes whenever the
 * visible year list changes (e.g. after a vendor filter).
 */
export function useYearSpy(years: number[]): number | null {
  const [activeYear, setActiveYear] = useState<number | null>(null);

  useEffect(() => {
    setActiveYear(years.length ? years[0] : null);
    if (!years.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .forEach((entry) => {
            const year = Number(entry.target.getAttribute("data-year"));
            if (!Number.isNaN(year)) setActiveYear(year);
          });
      },
      // The «reading zone»: a band from 10% to ~45% of the viewport height.
      { rootMargin: "-10% 0px -55% 0px" },
    );

    years.forEach((year) => {
      const element = document.getElementById(yearAnchorId(year));
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [years]);

  return activeYear;
}
