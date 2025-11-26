import useSWR from "swr";
import { useMemo } from "react";

import { fetcher, endpoints } from "src/utils/axios";

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

interface Product {
  id: string;
  name: string;
  price: number;
  coverUrl: string;
  priceSale: number | null;
  colors: string[];
  status: string;
  inventoryType: string;
  [key: string]: unknown;
}

interface ProductsResponse {
  products: Product[];
}

export function useGetProducts() {
  const url = endpoints.product.list;

  const { data, isLoading, error, isValidating } = useSWR<ProductsResponse>(
    url,
    fetcher,
    swrOptions,
  );

  const memoizedValue = useMemo(
    () => ({
      products: data?.products ?? [],
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
      productsEmpty: !isLoading && !(data?.products?.length ?? 0),
    }),
    [data?.products, error, isLoading, isValidating],
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

interface ProductResponse {
  product: Product;
}

export function useGetProduct(productId: string | null) {
  const url = productId
    ? [endpoints.product.details, { params: { productId } }]
    : null;

  const { data, isLoading, error, isValidating } = useSWR<ProductResponse>(
    url,
    fetcher,
    swrOptions,
  );

  const memoizedValue = useMemo(
    () => ({
      product: data?.product,
      productLoading: isLoading,
      productError: error,
      productValidating: isValidating,
    }),
    [data?.product, error, isLoading, isValidating],
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

interface SearchProductsResponse {
  results: Product[];
}

export function useSearchProducts(query: string | null) {
  const url = query ? [endpoints.product.search, { params: { query } }] : null;

  const { data, isLoading, error, isValidating } = useSWR<SearchProductsResponse>(url, fetcher, {
    ...swrOptions,
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: data?.results ?? [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !(data?.results?.length ?? 0),
    }),
    [data?.results, error, isLoading, isValidating],
  );

  return memoizedValue;
}
