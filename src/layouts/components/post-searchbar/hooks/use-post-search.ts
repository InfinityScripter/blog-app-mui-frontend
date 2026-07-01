import { useState, useCallback } from "react";
import { useSearchPosts } from "src/actions/blog";
import { useDebounce } from "src/hooks/use-debounce";

// ----------------------------------------------------------------------

/**
 * Public post-search state for the shared header searchbar. Debounces the query
 * and calls useSearchPosts WITHOUT the dashboard flag — anonymous visitors must
 * never see admin drafts (backend search is optional-auth: anon → published only).
 */
export function usePostSearch() {
  const [query, setQuery] = useState("");

  const debouncedQuery = useDebounce(query);

  const { searchResults, searchLoading } = useSearchPosts(debouncedQuery);

  const onSearch = useCallback((value: string) => {
    setQuery(value);
  }, []);

  return {
    query: debouncedQuery,
    results: searchResults,
    loading: searchLoading,
    onSearch,
  };
}
