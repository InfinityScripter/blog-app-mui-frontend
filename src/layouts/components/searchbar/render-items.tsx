import Box from "@mui/material/Box";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

import { groupItems } from "./utils";
import { ResultItem } from "./result-item";

import type { RenderItemsProps } from "./types";

// ----------------------------------------------------------------------

export function RenderItems({
  dataFiltered,
  searchQuery,
  onClickItem,
}: RenderItemsProps) {
  const dataGroups = groupItems(dataFiltered);

  return Object.keys(dataGroups)
    .sort((a, b) => -b.localeCompare(a))
    .map((group, index) => (
      <Box component="ul" key={`${group}-${index}`}>
        {dataGroups[group].map((item) => {
          const { title, path } = item;

          const partsTitle = parse(title, match(title, searchQuery));

          const partsPath = parse(path, match(path, searchQuery));

          return (
            <Box
              component="li"
              key={`${title}${path}`}
              sx={{ display: "flex" }}
            >
              <ResultItem
                path={partsPath}
                title={partsTitle}
                groupLabel={searchQuery && group}
                onClickItem={() => onClickItem(path)}
              />
            </Box>
          );
        })}
      </Box>
    ));
}
