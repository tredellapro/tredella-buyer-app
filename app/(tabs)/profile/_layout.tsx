import { Stack } from "expo-router";
import { CustomHeader } from "@/components/layout/CustomHeader";

export default function ProfileLayout() {
    return (
        <Stack
            screenOptions={{
                // Hide the default Expo header — our CustomHeader is set per-screen
                headerShown: true,
                header: ({ options, route, navigation }) => (
                    <CustomHeader
                        title={options.title ?? ""}
                        canGoBack={navigation.canGoBack()}
                    />
                ),
            }}
        >
            <Stack.Screen name="index" options={{ title: "Profile" }} />
            <Stack.Screen name="personal-information" options={{ title: "Personal Information" }} />
            <Stack.Screen name="shipping-address" options={{ title: "Shipping Address" }} />
            <Stack.Screen name="payment-methods" options={{ title: "Payment Methods" }} />
        </Stack>
    );
}
