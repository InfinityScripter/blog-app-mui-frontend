"use client";

import { useRef, useState, useEffect, useCallback } from "react";

// ----------------------------------------------------------------------

export function useInfiniteScroll(initialItems = [], itemsPerPage = 8) {
  const [items, setItems] = useState(initialItems.slice(0, itemsPerPage));
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialItems.length > itemsPerPage);
  const [loading, setLoading] = useState(false);
  const scrollListenerRef = useRef(null);

  useEffect(() => {
    setItems(initialItems.slice(0, itemsPerPage));
    setPage(1);
    setHasMore(initialItems.length > itemsPerPage);
  }, [initialItems, itemsPerPage]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);

    // Simulate loading delay
    setTimeout(() => {
      const nextPage = page + 1;
      const nextItems = initialItems.slice(0, nextPage * itemsPerPage);

      setItems(nextItems);
      setPage(nextPage);
      setHasMore(nextItems.length < initialItems.length);
      setLoading(false);
    }, 500);
  }, [initialItems, itemsPerPage, page, loading, hasMore]);

  const handleScroll = useCallback(() => {
    if (loading || !hasMore) return;

    const { scrollHeight } = document.documentElement;
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    const { clientHeight } = document.documentElement;

    // Load more when user scrolls to bottom (with a 200px threshold)
    if (scrollTop + clientHeight >= scrollHeight - 200) {
      loadMore();
    }
  }, [loadMore, loading, hasMore]);

  useEffect(() => {
    // Remove previous listener if it exists
    if (scrollListenerRef.current) {
      window.removeEventListener("scroll", scrollListenerRef.current);
    }

    // Save the current handler to the ref
    scrollListenerRef.current = handleScroll;

    // Add the event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return {
    items,
    hasMore,
    loading,
    loadMore,
  };
}
