import axios from "axios";
import { Platform } from "react-native";
import { useAuthStore } from "@/store/authStore";
import Toast from "react-native-toast-message";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// For local development with Android emulator
if (Platform.OS === "android" && API_URL.includes("localhost")) {
  apiClient.defaults.baseURL = API_URL.replace("localhost", "10.0.2.2");
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
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || "Something went wrong";

    if (status === 401) {
      // Auto-logout on unauthorized
      useAuthStore.getState().logout();
      Toast.show({
        type: "error",
        text1: "Session Expired",
        text2: "Please login again",
      });
    } else if (status === 500) {
      Toast.show({
        type: "error",
        text1: "Server Error",
        text2: "Our team is working on it",
      });
    } else if (!error.response) {
      // Network error
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
