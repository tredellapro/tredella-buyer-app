import apiClient from "./client";
import { Product } from "@/types";
import { ApiResponse, PaginatedResponse } from "@/types/api";

export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export const productService = {
  getProducts: async (params?: ProductFilters) => {
    const response = await apiClient.get<PaginatedResponse<Product>>(
      "/products",
      {
        params,
      },
    );
    return response.data;
  },

  getProductById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Product>>(
      `/products/${id}`,
    );
    return response.data;
  },

  getCategories: async () => {
    const response = await apiClient.get<ApiResponse<string[]>>(
      "/products/categories",
    );
    return response.data;
  },
};
