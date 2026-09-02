import { it, expect, describe } from "vitest";
import {
  groupItems,
  getAllItems,
  applyFilter,
} from "src/layouts/components/searchbar/utils";

import type { SearchNavSection } from "../types";

// ----------------------------------------------------------------------

const NAV: SearchNavSection[] = [
  {
    subheader: "Меню",
    items: [
      { title: "Блог", path: "/blog" },
      {
        title: "Справочники",
        path: "/library",
        children: [
          { title: "Инструменты", path: "/library/tools" },
          {
            title: "Чтение",
            path: "/library/reading",
            children: [{ title: "Архив", path: "/library/reading/archive" }],
          },
        ],
      },
    ],
  },
];

describe("getAllItems", () => {
  it("разворачивает дерево навигации в плоский список", () => {
    const items = getAllItems({ data: NAV });
    expect(items.map((i) => i.path)).toEqual([
      "/blog",
      "/library",
      "/library/tools",
      "/library/reading",
      "/library/reading/archive",
    ]);
  });

  it("верхний уровень группируется по subheader, вложенные — по корню своей ветки", () => {
    const items = getAllItems({ data: NAV });
    const byPath = Object.fromEntries(items.map((i) => [i.path, i.group]));
    expect(byPath["/blog"]).toBe("Меню");
    expect(byPath["/library"]).toBe("Меню");
    // Ветка «Справочники»: и прямой ребёнок, и внук группируются по её корню.
    expect(byPath["/library/tools"]).toBe("Справочники");
    expect(byPath["/library/reading/archive"]).toBe("Справочники");
  });
});

describe("applyFilter", () => {
  it("фильтрует по вхождению в title или path без учёта регистра", () => {
    const inputData = getAllItems({ data: NAV });
    expect(
      applyFilter({ inputData, query: "блог" }).map((i) => i.path),
    ).toEqual(["/blog"]);
    expect(applyFilter({ inputData, query: "READING" })).toHaveLength(2);
    expect(applyFilter({ inputData, query: "" })).toHaveLength(5);
  });
});

describe("groupItems", () => {
  it("складывает результаты по группам", () => {
    const grouped = groupItems(getAllItems({ data: NAV }));
    expect(Object.keys(grouped).sort()).toEqual(["Меню", "Справочники"]);
    expect(grouped["Меню"]).toHaveLength(2);
    expect(grouped["Справочники"]).toHaveLength(3);
  });
});
