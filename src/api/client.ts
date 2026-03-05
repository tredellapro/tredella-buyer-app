import axios from "axios";
import { Platform } from "react-native";
import { useAuthStore } from "@/store/authStore";
import Toast from "react-native-toast-message";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000";
const API_TIMEOUT = 30000;
const API_KEY = process.env.EXPO_PUBLIC_API_KEY || "tredella-api-key-2024";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-API-Key": API_KEY,
  },
});

// For local development with Android emulator
if (Platform.OS === "android" && API_BASE_URL.includes("localhost")) {
  apiClient.defaults.baseURL = API_BASE_URL.replace("localhost", "10.0.2.2");
}

// Request Interceptor: Inject Auth Token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Centralized Error Handling & Auth Guard
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // Extract the most descriptive error message
    const responseData = error.response?.data;
    let errorMessage = responseData?.message || "";

    // If backend provides a specific errors array (common for validation), use those instead
    if (
      responseData?.errors &&
      Array.isArray(responseData.errors) &&
      responseData.errors.length > 0
    ) {
      errorMessage = responseData.errors.join("\n");
    }

    if (status === 401) {
      // 1. Handle specific account status error messages
      const isAccountStatusError =
        errorMessage.includes("verify your email") ||
        errorMessage.includes("rejected") ||
        errorMessage.includes("suspended") ||
        errorMessage.includes("deactivated") ||
        errorMessage.includes("inactive") ||
        errorMessage.includes("pending admin approval");

      if (isAccountStatusError) {
        // For these specific errors, we show the message but don't trigger the generic logout/refresh
        Toast.show({
          type: "error",
          text1: "Account Status",
          text2: errorMessage,
        });
        return Promise.reject(error);
      }

      // 2. Token Refresh Logic
      if (originalRequest.url !== "/auth/login" && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = useAuthStore.getState().refreshToken;

        if (refreshToken) {
          try {
            console.log(
              "🔍 API Interceptor: Token expired, attempting refresh...",
            );
            // Use a clean axios instance to avoid interceptor loop
            const refreshResponse = await axios.post(
              `${apiClient.defaults.baseURL}/auth/refresh-token`,
              { refreshToken },
              { headers: { "X-API-Key": API_KEY } },
            );

            const { success, data } = refreshResponse.data;

            if (success && data) {
              console.log(
                "🔍 API Interceptor: Token refreshed, retrying request",
              );
              useAuthStore
                .getState()
                .setTokens(data.accessToken, data.refreshToken);

              // Update the original request with new token
              originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
              return apiClient(originalRequest);
            }
          } catch (refreshError) {
            console.log(
              "🔍 API Interceptor: Token refresh failed:",
              refreshError,
            );
          }
        }
      }

      // 3. Regular 401 error or refresh failed - clear auth and logout
      if (originalRequest.url !== "/auth/login") {
        console.log("🔍 API Interceptor: 401 error, logging out...");
        useAuthStore.getState().logout();
        Toast.show({
          type: "error",
          text1: "Session Expired",
          text2: "Please login again",
        });
      } else {
        // For login attempts, show the actual error from server (e.g. "Invalid Credentials")
        if (errorMessage) {
          Toast.show({
            type: "error",
            text1: "Login Failed",
            text2: errorMessage,
          });
        }
      }
    } else if (status === 500) {
      Toast.show({
        type: "error",
        text1: "Server Error",
        text2: "Our team is working on it",
      });
    } else if (status === 429) {
      Toast.show({
        type: "error",
        text1: "Too Many Requests",
        text2: "Please wait a moment before trying again",
      });
    } else if (error.response?.data?.message) {
      // Show server-provided error message for other 4xx errors
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response.data.message,
      });
    } else if (!error.response) {
      Toast.show({
        type: "error",
        text1: "Network Error",
        text2: "Please check your internet connection",
      });
    }

    return Promise.reject(error);
  },
);

export default apiClient;
