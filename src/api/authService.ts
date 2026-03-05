import apiClient from "./client";
import { User } from "@/types";
import { ApiResponse } from "@/types/api";

export interface LoginRequest {
  email: string;
  password?: string;
  token?: string; // For social login or similar
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
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

  checkEmail: async (email: string) => {
    const response = await apiClient.post<
      ApiResponse<{ available: boolean; email: string; message: string }>
    >("/auth/check-email", { email });
    return response.data;
  },

  checkPhone: async (phone: string) => {
    const response = await apiClient.post<
      ApiResponse<{ available: boolean; phone: string; message: string }>
    >("/auth/check-phone", { phone });
    return response.data;
  },

  verifyEmailOtp: async (data: {
    email: string;
    otp: string;
    purpose: string;
  }) => {
    const response = await apiClient.post<
      ApiResponse<{ verified: boolean; message: string }>
    >("/auth/verify-otp", data);
    return response.data;
  },

  logout: async () => {
    await apiClient.post("/auth/logout");
  },

  refreshToken: async (data: { refreshToken: string }) => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/refresh-token",
      data,
    );
    return response.data;
  },

  forgotPassword: async (data: { email: string; role: string }) => {
    const response = await apiClient.post<ApiResponse<any>>(
      "/auth/forgot-password",
      data,
    );
    return response.data;
  },

  resendOtp: async (data: { email: string; purpose: string }) => {
    const response = await apiClient.post<ApiResponse<any>>(
      "/auth/resend-otp",
      data,
    );
    return response.data;
  },

  verifyOtp: async (data: { email: string; otp: string; purpose: string }) => {
    const response = await apiClient.post<
      ApiResponse<{ resetToken: string; expiresIn: string }>
    >("/auth/verify-otp-and-get-token", data);
    return response.data;
  },

  resetPassword: async (data: { newPassword: string; resetToken: string }) => {
    const response = await apiClient.post<ApiResponse<any>>(
      "/auth/reset-password-with-token",
      data,
    );
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get<ApiResponse<User>>("/auth/me");
    return response.data;
  },
};
