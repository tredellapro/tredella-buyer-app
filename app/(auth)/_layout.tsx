import { Stack, useRouter } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

export default function AuthLayout() {
    const { token } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (token) {
            router.replace("/(tabs)");
        }
    }, [token]);

    if (token) return null;

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: "#ffffff" },
            }}
        >
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
            <Stack.Screen name="forgot-password" />
            <Stack.Screen name="otp-verification" />
            <Stack.Screen name="reset-password" />
        </Stack>
    );
}
