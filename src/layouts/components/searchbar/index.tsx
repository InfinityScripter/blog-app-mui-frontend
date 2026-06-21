"use client";

import type { ChangeEvent } from "react";

import Box from "@mui/material/Box";
import { Label } from "src/components/label";
import { useRouter } from "src/routes/hooks";
import { useState, useCallback } from "react";
import InputBase from "@mui/material/InputBase";
import { useTheme } from "@mui/material/styles";
import { Iconify } from "src/components/iconify";
import { isExternalLink } from "src/routes/utils";
import { useBoolean } from "src/hooks/use-boolean";
import { Scrollbar } from "src/components/scrollbar";
import InputAdornment from "@mui/material/InputAdornment";
import Dialog, { dialogClasses } from "@mui/material/Dialog";
import { useEventListener } from "src/hooks/use-event-listener";
import { SearchNotFound } from "src/components/search-not-found";

import { RenderItems } from "./render-items";
import { SearchButton } from "./search-button";
import { applyFilter, getAllItems } from "./utils";

import type { SearchbarProps } from "./types";

// ----------------------------------------------------------------------

export function Searchbar({
  data: navItems = [],
  sx,
  ...other
}: SearchbarProps) {
  const theme = useTheme();

  const router = useRouter();

  const search = useBoolean();

  const [searchQuery, setSearchQuery] = useState("");

  const handleClose = useCallback(() => {
    search.onFalse();
    setSearchQuery("");
  }, [search]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "k" && event.metaKey) {
      search.onToggle();
      setSearchQuery("");
    }
  };

  useEventListener("keydown", handleKeyDown);

  const handleClick = useCallback(
    (path: string) => {
      if (isExternalLink(path)) {
        window.open(path);
      } else {
        router.push(path);
      }
      handleClose();
    },
    [handleClose, router],
  );

  const handleSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  }, []);

  const dataFiltered = applyFilter({
    inputData: getAllItems({ data: navItems }),
    query: searchQuery,
  });

  const notFound = searchQuery && !dataFiltered.length;

  return (
    <>
      <SearchButton onOpen={search.onTrue} sx={sx} {...other} />

      <Dialog
        fullWidth
        disableRestoreFocus
        maxWidth="sm"
        open={search.value}
        onClose={handleClose}
        transitionDuration={{
          enter: theme.transitions.duration.shortest,
          exit: 0,
        }}
        PaperProps={{ sx: { mt: 15, overflow: "unset" } }}
        sx={{ [`& .${dialogClasses.container}`]: { alignItems: "flex-start" } }}
      >
        <Box
          sx={{ p: 3, borderBottom: `solid 1px ${theme.vars.palette.divider}` }}
        >
          <InputBase
            fullWidth
            autoFocus
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            startAdornment={
              <InputAdornment position="start">
                <Iconify
                  icon="eva:search-fill"
                  width={24}
                  sx={{ color: "text.disabled" }}
                />
              </InputAdornment>
            }
            endAdornment={
              <Label sx={{ letterSpacing: 1, color: "text.secondary" }}>
                esc
              </Label>
            }
            inputProps={{ sx: { typography: "h6" } }}
          />
        </Box>

        {notFound ? (
          <SearchNotFound query={searchQuery} sx={{ py: 15 }} />
        ) : (
          <Scrollbar sx={{ px: 3, pb: 3, pt: 2, height: 400 }}>
            <RenderItems
              dataFiltered={dataFiltered}
              searchQuery={searchQuery}
              onClickItem={handleClick}
            />
          </Scrollbar>
        )}
      </Dialog>
    </>
  );
}
