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

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold,
        Poppins_700Bold,
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <QueryClientProvider client={queryClient}>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="(auth)" options={{ presentation: "modal" }} />
                    <Stack.Screen name="product/[id]" options={{ headerShown: true, title: "Product Detail" }} />
                    <Stack.Screen name="checkout" options={{ headerShown: true, title: "Checkout" }} />
                </Stack>
                <StatusBar style="auto" />
                <Toast />
            </QueryClientProvider>
        </GestureHandlerRootView>
    );
}
