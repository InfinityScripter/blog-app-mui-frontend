import axios, { endpoints } from "src/utils/axios";

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

interface ProductResponse {
  product: Product;
}

export async function getProducts(): Promise<ProductsResponse> {
  const res = await axios.get<ProductsResponse>(endpoints.product.list);

  return res.data;
}

// ----------------------------------------------------------------------

export async function getProduct(id: string): Promise<ProductResponse> {
  const URL = id ? `${endpoints.product.details}?productId=${id}` : "";

  const res = await axios.get<ProductResponse>(URL);

  return res.data;
}
