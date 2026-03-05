import { Tabs, useRouter, useSegments } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import { CustomTabBar } from "@/components/layout/CustomTabBar";
import { CustomHeader } from "@/components/layout/CustomHeader";

export default function TabLayout() {
    const { token } = useAuthStore();
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        if (!token) {
            router.replace("/(auth)/login");
        }
    }, [token]);

    if (!token) return null;

    return (
        <Tabs
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={({ route }) => ({
                headerShown: true,
                header: ({ options }) => (
                    <CustomHeader title={options.title || route.name} />
                ),
            })}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: "Search",
                }}
            />
            <Tabs.Screen
                name="cart"
                options={{
                    title: "Cart",
                }}
            />
            <Tabs.Screen
                name="orders"
                options={{
                    title: "Orders",
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                }}
            />
        </Tabs>
    );
}
