import React from "react";
import { View, StyleSheet, Platform, TouchableOpacity, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text } from "../ui/Text";
import { useAuthStore } from "@/store/authStore";

const PRIMARY = "#e94560";

interface CustomHeaderProps {
    title: string;
    canGoBack?: boolean;
    rightElement?: React.ReactNode;
}

export const CustomHeader = ({ title, canGoBack = false, rightElement }: CustomHeaderProps) => {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { user } = useAuthStore();

    const initials = user
        ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
        : "?";

    const defaultRight = (
        <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top > 0 ? insets.top : 16 }]}>
            <View style={styles.content}>
                {/* Left – back button or spacer */}
                <View style={styles.side}>
                    {canGoBack ? (
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={styles.backButton}
                            activeOpacity={0.75}
                        >
                            <Ionicons name="arrow-back" size={20} color="#ffffff" />
                        </TouchableOpacity>
                    ) : null}
                </View>

                {/* Title */}
                <Text style={styles.title} numberOfLines={1}>
                    {title}
                </Text>

                {/* Right – custom element or avatar */}
                <View style={[styles.side, styles.rightSide]}>
                    {rightElement ?? defaultRight}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: PRIMARY,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingBottom: 16,
        paddingHorizontal: 16,
        ...Platform.select({
            ios: {
                shadowColor: PRIMARY,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.25,
                shadowRadius: 14,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 44,
    },
    title: {
        fontSize: 17,
        fontWeight: "700",
        color: "#ffffff",
        flex: 1,
        textAlign: "center",
        letterSpacing: 0.3,
    },
    side: {
        width: 40,
        justifyContent: "center",
    },
    rightSide: {
        alignItems: "flex-end",
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.15)",
        alignItems: "center",
        justifyContent: "center",
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "rgba(255,255,255,0.25)",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.5)",
    },
    avatarText: {
        fontSize: 13,
        fontWeight: "700",
        color: "#ffffff",
        letterSpacing: 0.5,
    },
});
