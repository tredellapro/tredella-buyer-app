import axios from "axios";
import { Platform } from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// For local development with Android emulator
if (Platform.OS === "android" && API_URL.includes("localhost")) {
  apiClient.defaults.baseURL = API_URL.replace("localhost", "10.0.2.2");
}

export default apiClient;
