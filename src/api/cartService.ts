import apiClient from "./client";
import { CartItem } from "@/types";
import { ApiResponse } from "@/types/api";

export const cartService = {
  getCart: async () => {
    const response = await apiClient.get<ApiResponse<CartItem[]>>("/cart");
    return response.data;
  },

  addToCart: async (productId: string, quantity: number) => {
    const response = await apiClient.post<ApiResponse<CartItem>>("/cart/add", {
      productId,
      quantity,
    });
    return response.data;
  },

  updateCartItem: async (itemId: string, quantity: number) => {
    const response = await apiClient.put<ApiResponse<CartItem>>(
      `/cart/${itemId}`,
      {
        quantity,
      },
    );
    return response.data;
  },

  removeFromCart: async (itemId: string) => {
    await apiClient.delete(`/cart/${itemId}`);
  },

  clearCart: async () => {
    await apiClient.delete("/cart");
  },
};
