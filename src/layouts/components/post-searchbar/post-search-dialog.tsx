"use client";

import type { ChangeEvent } from "react";

import Box from "@mui/material/Box";
import { paths } from "src/routes/paths";
import { Label } from "src/components/label";
import { useRouter } from "src/routes/hooks";
import { useState, useCallback } from "react";
import InputBase from "@mui/material/InputBase";
import { useTheme } from "@mui/material/styles";
import { Iconify } from "src/components/iconify";
import { useBoolean } from "src/hooks/use-boolean";
import { Scrollbar } from "src/components/scrollbar";
import InputAdornment from "@mui/material/InputAdornment";
import Dialog, { dialogClasses } from "@mui/material/Dialog";
import { useEventListener } from "src/hooks/use-event-listener";
import { SearchNotFound } from "src/components/search-not-found";

import { usePostSearch } from "./hooks/use-post-search";
import { PostResultList } from "./components/post-result-list";
import { PostSearchEmpty } from "./components/post-search-empty";
import { PostSearchButton } from "./components/post-search-button";

// ----------------------------------------------------------------------

// Public post-search cmd+k dialog. Visually modeled on the dashboard's
// Searchbar (src/layouts/components/searchbar/index.tsx) but wired to blog
// posts via usePostSearch instead of nav items.
export function PostSearchDialog() {
  const theme = useTheme();

  const router = useRouter();

  const search = useBoolean();

  // `query` from usePostSearch is debounced (drives `results`/highlighting).
  // The input itself is controlled by `inputValue` so keystrokes render
  // immediately instead of lagging behind the debounce delay.
  const [inputValue, setInputValue] = useState("");

  const { query, results, loading, onSearch } = usePostSearch();

  const handleClose = useCallback(() => {
    search.onFalse();
    setInputValue("");
    onSearch("");
  }, [search, onSearch]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "k" && event.metaKey) {
      search.onToggle();
      setInputValue("");
      onSearch("");
    }
  };

  useEventListener("keydown", handleKeyDown);

  const handleClickItem = useCallback(
    (postId: string) => {
      router.push(paths.post.details(postId));
      handleClose();
    },
    [handleClose, router],
  );

  const handleSearch = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
      onSearch(event.target.value);
    },
    [onSearch],
  );

  const handleKeyUp = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (query && event.key === "Enter" && results.length) {
        handleClickItem(String(results[0]._id));
      }
    },
    [query, results, handleClickItem],
  );

  const notFound = Boolean(query) && !loading && !results.length;

  // Before the visitor types, show recent posts instead of a blank panel.
  // Gated on `search.value` so the recent-posts fetch only fires while open.
  const showEmptyState = search.value && !query;

  return (
    <>
      <PostSearchButton onOpen={search.onTrue} />

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
            placeholder="Поиск..."
            value={inputValue}
            onChange={handleSearch}
            onKeyUp={handleKeyUp}
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
              loading ? (
                <Iconify icon="svg-spinners:8-dots-rotate" sx={{ mr: 1 }} />
              ) : (
                <Label sx={{ letterSpacing: 1, color: "text.secondary" }}>
                  esc
                </Label>
              )
            }
            inputProps={{ sx: { typography: "h6" } }}
          />
        </Box>

        {notFound ? (
          <SearchNotFound query={query} sx={{ py: 15 }} />
        ) : (
          <Scrollbar sx={{ px: 3, pb: 3, pt: 2, height: 400 }}>
            {showEmptyState ? (
              <PostSearchEmpty onClickItem={handleClickItem} />
            ) : (
              <PostResultList
                results={results}
                query={query}
                onClickItem={handleClickItem}
              />
            )}
          </Scrollbar>
        )}
      </Dialog>
    </>
  );
}
