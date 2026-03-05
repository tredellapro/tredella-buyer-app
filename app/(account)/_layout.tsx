import { Stack } from "expo-router";
import { CustomHeader } from "@/components/layout/CustomHeader";

export default function AccountLayout() {
    return (
        <Stack
            screenOptions={({ route }) => ({
                headerShown: true,
                header: ({ options }) => (
                    <CustomHeader
                        title={options.title || ""}
                        canGoBack={true}
                    />
                ),
            })}
        >
            <Stack.Screen name="personal-information" options={{ title: "Personal Information" }} />
            <Stack.Screen name="account-settings" options={{ title: "Account Settings" }} />
        </Stack>
    );
}
