import type { NavItemBaseProps } from "src/components/nav-section/types";

import { flattenArray } from "src/utils/helper";

import type {
  SearchLoopItem,
  SearchNavSection,
  SearchResultItem,
} from "./types";

// ----------------------------------------------------------------------

export function getAllItems({
  data,
}: {
  data: SearchNavSection[];
}): SearchResultItem[] {
  const reduceItems = data
    .map((list) => handleLoop(list.items, list.subheader))
    .flat();

  const items: SearchResultItem[] = flattenArray<SearchLoopItem>(
    reduceItems,
  ).map((option) => {
    const group = splitPath(reduceItems, option.path);

    return {
      group: group && group.length > 1 ? group[0] : (option.subheader ?? ""),
      title: option.title ?? "",
      path: option.path,
    };
  });

  return items;
}

// ----------------------------------------------------------------------

export function applyFilter({
  inputData,
  query,
}: {
  inputData: SearchResultItem[];
  query: string;
}): SearchResultItem[] {
  if (query) {
    inputData = inputData.filter(
      (item) =>
        item.title.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        item.path.toLowerCase().indexOf(query.toLowerCase()) !== -1,
    );
  }

  return inputData;
}

// ----------------------------------------------------------------------

function splitPath(array: SearchLoopItem[], key: string): string[] | null {
  let stack: { path: string[]; currItem: SearchLoopItem }[] = array.map(
    (item) => ({ path: [item.title ?? ""], currItem: item }),
  );

  while (stack.length) {
    const popped = stack.pop();

    if (!popped) {
      break;
    }

    const { path, currItem } = popped;

    if (currItem.path === key) {
      return path;
    }

    if (currItem.children?.length) {
      stack = stack.concat(
        currItem.children.map((item) => ({
          path: path.concat(item.title ?? ""),
          currItem: item,
        })),
      );
    }
  }
  return null;
}

// ----------------------------------------------------------------------

function handleLoop(
  array: NavItemBaseProps[] | undefined,
  subheader?: string,
): SearchLoopItem[] {
  return (
    array?.map((list) => ({
      subheader,
      ...list,
      ...(list.children && {
        children: handleLoop(list.children, subheader),
      }),
    })) ?? []
  );
}

export function groupItems(
  array: SearchResultItem[],
): Record<string, SearchResultItem[]> {
  const group = array.reduce<Record<string, SearchResultItem[]>>(
    (groups, item) => {
      groups[item.group] = groups[item.group] || [];

      groups[item.group].push(item);

      return groups;
    },
    {},
  );

  return group;
}
