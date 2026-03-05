import apiClient from "./client";
import { User } from "@/types";
import { ApiResponse } from "@/types/api";

export interface LoginRequest {
  email: string;
  password?: string;
  token?: string; // For social login or similar
}

export interface RegisterRequest extends LoginRequest {
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  login: async (data: LoginRequest) => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      data,
    );
    return response.data;
  },

  register: async (data: RegisterRequest) => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/register",
      data,
    );
    return response.data;
  },

  logout: async () => {
    await apiClient.post("/auth/logout");
  },

  getMe: async () => {
    const response = await apiClient.get<ApiResponse<User>>("/auth/me");
    return response.data;
  },
};
