import "../global.css";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { Platform } from "react-native";

if (Platform.OS === "web") {
    if (typeof document !== "undefined") {
        document.documentElement.style.setProperty(
            "--css-interop-darkMode",
            "class dark"
        );
    }
}

import {
    useFonts,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
} from "@expo-google-fonts/poppins";

const queryClient = new QueryClient();

export default function RootLayout() {
    const [fontsLoaded, fontError] = useFonts({
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold,
        Poppins_700Bold,
    });

    useEffect(() => {
        // Prevent auto-hide on mount
        SplashScreen.preventAutoHideAsync().catch(() => {
            /* ignore */
        });
    }, []);

    useEffect(() => {
        if (fontsLoaded || fontError) {
            // Add a slight delay to ensure the UI is ready to paint
            // and the user actually sees the splash screen
            const timer = setTimeout(async () => {
                await SplashScreen.hideAsync().catch(() => {
                    /* ignore */
                });
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <QueryClientProvider client={queryClient}>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="(auth)" options={{ presentation: "modal" }} />
                </Stack>
                <StatusBar style="auto" />
                <Toast />
            </QueryClientProvider>
        </GestureHandlerRootView>
    );
}
