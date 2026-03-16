import React, { useState, useRef } from "react";
import {
    View,
    StyleSheet,
    Platform,
    TouchableOpacity,
    Modal,
    Animated,
    TouchableWithoutFeedback,
    Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text } from "../ui/Text";
import { useAuthStore } from "@/store/authStore";
import { useViewModeStore, ViewMode } from "@/store/viewModeStore";

const PRIMARY = "#e94560";
const { width: SCREEN_W } = Dimensions.get("window");

export interface ModeOption {
    key: ViewMode;
    label: string;
    description: string;
    icon: string;
    disabled: boolean;
}

export const MODES: ModeOption[] = [
    {
        key: "retail",
        label: "Retail",
        description: "Standard pricing for all items",
        icon: "storefront-outline",
        disabled: false,
    },
    {
        key: "wholesale",
        label: "Wholesale",
        description: "Bulk pricing & discounts",
        icon: "cube-outline",
        disabled: false,
    },
    {
        key: "royal",
        label: "Royal",
        description: "Exclusive access — coming soon",
        icon: "diamond-outline",
        disabled: true,
    },
];

interface CustomHeaderProps {
    title: string;
    canGoBack?: boolean;
    rightElement?: React.ReactNode;
    notificationCount?: number;
}

export const CustomHeader = ({ title, canGoBack = false, rightElement, notificationCount = 0 }: CustomHeaderProps) => {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const { mode, setMode } = useViewModeStore();
    const [popupVisible, setPopupVisible] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    const handleLogout = () => {
        closePopup();
        logout();
        // router.replace is called after modal closes
        setTimeout(() => router.replace("/(auth)/login"), 180);
    };

    const initials = user
        ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
        : "?";

    const openPopup = () => {
        setPopupVisible(true);
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, damping: 18, stiffness: 220 }),
        ]).start();
    };

    const closePopup = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 0, duration: 140, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 0.9, duration: 140, useNativeDriver: true }),
        ]).start(() => setPopupVisible(false));
    };

    const selectMode = (m: ViewMode, disabled: boolean) => {
        if (disabled) return;
        setMode(m);
        closePopup();
    };

    const currentMode = MODES.find((m) => m.key === mode);

    const avatarButton = (
        <TouchableOpacity onPress={openPopup} style={styles.avatarButton} activeOpacity={0.8}>
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
            </View>
            {/* Active mode badge */}
            <View style={styles.modeBadge}>
                <Ionicons name={currentMode?.icon as any} size={12} color="#fff" />
            </View>
        </TouchableOpacity>
    );

    return (
        <>
            <View style={[styles.container, { paddingTop: insets.top > 0 ? insets.top : 16 }]}>
                <View style={styles.content}>
                    {/* Left */}
                    <View style={styles.side}>
                        {canGoBack && (
                            <TouchableOpacity
                                onPress={() => {
                                    if (router.canGoBack()) {
                                        router.back();
                                    } else {
                                        router.replace("/(tabs)/");
                                    }
                                }}
                                style={styles.backButton}
                                activeOpacity={0.75}
                            >
                                <Ionicons name="arrow-back" size={20} color="#ffffff" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Title */}
                    <Text style={styles.title} numberOfLines={1}>
                        {title}
                    </Text>

                    {/* Right – notification bell + avatar (or custom element) */}
                    <View style={[styles.side, styles.rightSide]}>
                        {rightElement ?? (
                            <View style={styles.rightGroup}>
                                {/* Notification Bell */}
                                <TouchableOpacity style={styles.bellBtn} activeOpacity={0.75}>
                                    <Ionicons name="notifications-outline" size={22} color="#ffffff" />
                                    {notificationCount > 0 && (
                                        <View style={styles.notifBadge}>
                                            <Text style={styles.notifBadgeText}>
                                                {notificationCount > 9 ? "9+" : notificationCount}
                                            </Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                                {/* Avatar */}
                                {avatarButton}
                            </View>
                        )}
                    </View>
                </View>
            </View>

            {/* Mode Switcher Popup */}
            <Modal transparent visible={popupVisible} animationType="fade" onRequestClose={closePopup}>
                <TouchableWithoutFeedback onPress={closePopup}>
                    <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
                </TouchableWithoutFeedback>

                <Animated.View
                    style={[
                        styles.popup,
                        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
                    ]}
                    pointerEvents="box-none"
                >
                    {/* Popup header */}
                    <View style={styles.popupHeader}>
                        <View style={styles.popupHeaderLeft}>
                            <View style={styles.popupAvatar}>
                                <Text style={styles.popupAvatarText}>{initials}</Text>
                            </View>
                            <View>
                                <Text style={styles.popupName}>
                                    {user?.firstName} {user?.lastName}
                                </Text>
                                <Text variant="caption" style={styles.popupEmail}>{user?.email}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={closePopup} style={styles.closeBtn}>
                            <Ionicons name="close" size={18} color="#697282" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.divider} />

                    {/* Mode label */}
                    {/* <Text style={styles.sectionLabel}>Mode</Text> */}

                    {/* Mode options */}
                    {MODES.map((m) => {
                        const isActive = mode === m.key;
                        return (
                            <TouchableOpacity
                                key={m.key}
                                onPress={() => selectMode(m.key, m.disabled)}
                                activeOpacity={m.disabled ? 1 : 0.7}
                                style={[
                                    styles.modeRow,
                                    isActive && styles.modeRowActive,
                                    m.disabled && styles.modeRowDisabled,
                                ]}
                            >
                                {/* Icon */}
                                <View
                                    style={[
                                        styles.modeIcon,
                                        isActive && styles.modeIconActive,
                                        m.disabled && styles.modeIconDisabled,
                                    ]}
                                >
                                    <Ionicons
                                        name={m.icon as any}
                                        size={20}
                                        color={isActive ? "#ffffff" : m.disabled ? "#b0bec5" : PRIMARY}
                                    />
                                </View>

                                {/* Labels */}
                                <View style={{ flex: 1 }}>
                                    <View style={styles.modeRowTitleRow}>
                                        <Text
                                            style={[
                                                styles.modeLabel,
                                                isActive && styles.modeLabelActive,
                                                m.disabled && styles.modeLabelDisabled,
                                            ]}
                                        >
                                            {m.label}
                                        </Text>
                                        {m.disabled && (
                                            <View style={styles.lockBadge}>
                                                <Ionicons name="lock-closed" size={10} color="#b0bec5" />
                                                <Text style={styles.lockText}>Soon</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text
                                        variant="caption"
                                        style={[
                                            styles.modeDescription,
                                            m.disabled && styles.modeDescDisabled,
                                        ]}
                                    >
                                        {m.description}
                                    </Text>
                                </View>

                                {/* Active check */}
                                {isActive && (
                                    <Ionicons name="checkmark-circle" size={20} color={PRIMARY} />
                                )}
                            </TouchableOpacity>
                        );
                    })}

                    {/* Separator */}
                    <View style={[styles.divider, { marginTop: 8 }]} />

                    {/* Logout button */}
                    <TouchableOpacity
                        onPress={handleLogout}
                        activeOpacity={0.75}
                        style={styles.logoutRow}
                    >
                        <View style={styles.logoutIcon}>
                            <Ionicons name="log-out-outline" size={20} color={PRIMARY} />
                        </View>
                        <Text style={styles.logoutLabel}>Log Out</Text>
                        <Ionicons name="chevron-forward" size={16} color="#ccd3e1" />
                    </TouchableOpacity>
                </Animated.View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: PRIMARY,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingBottom: 16,
        paddingHorizontal: 16,
        zIndex: 10,
        ...Platform.select({
            ios: {
                shadowColor: PRIMARY,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.25,
                shadowRadius: 14,
            },
            android: { elevation: 8 },
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
    side: { width: 40, justifyContent: "center" },
    rightSide: { alignItems: "flex-end" },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.15)",
        alignItems: "center",
        justifyContent: "center",
    },
    avatarButton: {
        position: "relative",
    },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "rgba(255,255,255,0.2)",
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
    modeBadge: {
        position: "absolute",
        bottom: -4,
        right: -4,
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: "#2b3445",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1.5,
        borderColor: PRIMARY,
    },

    // Backdrop
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.3)",
    },

    // Popup card
    popup: {
        position: "absolute",
        top: 90,
        right: 12,
        width: Math.min(SCREEN_W - 24, 380),
        backgroundColor: "#ffffff",
        borderRadius: 20,
        paddingBottom: 12,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.15,
                shadowRadius: 20,
            },
            android: { elevation: 16 },
        }),
    },
    popupHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
    },
    popupHeaderLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    popupAvatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: PRIMARY,
        alignItems: "center",
        justifyContent: "center",
    },
    popupAvatarText: {
        fontSize: 15,
        fontWeight: "700",
        color: "#ffffff",
    },
    popupName: {
        fontSize: 15,
        fontWeight: "700",
        color: "#2b3445",
    },
    popupEmail: {
        fontSize: 12,
        color: "#697282",
        marginTop: 1,
    },
    closeBtn: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "#f6f9fc",
        alignItems: "center",
        justifyContent: "center",
    },
    divider: {
        height: 1,
        backgroundColor: "#f0f2f5",
        marginHorizontal: 16,
    },
    sectionLabel: {
        fontSize: 11,
        fontWeight: "600",
        color: "#697282",
        letterSpacing: 0.8,
        textTransform: "uppercase",
        marginHorizontal: 16,
        marginTop: 14,
        marginBottom: 6,
    },

    // Mode rows
    modeRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginHorizontal: 12,
        marginVertical: 3,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 14,
    },
    modeRowActive: {
        backgroundColor: "#fef2f4",
    },
    modeRowDisabled: {
        opacity: 0.5,
    },
    modeIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "#fef2f4",
        alignItems: "center",
        justifyContent: "center",
    },
    modeIconActive: {
        backgroundColor: PRIMARY,
    },
    modeIconDisabled: {
        backgroundColor: "#f3f4f6",
    },
    modeRowTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    modeLabel: {
        fontSize: 15,
        fontWeight: "600",
        color: "#2b3445",
    },
    modeLabelActive: {
        color: PRIMARY,
    },
    modeLabelDisabled: {
        color: "#b0bec5",
    },
    modeDescription: {
        fontSize: 12,
        color: "#697282",
        marginTop: 2,
    },
    modeDescDisabled: {
        color: "#ccd3e1",
    },
    lockBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
        backgroundColor: "#f3f4f6",
        borderRadius: 8,
        paddingHorizontal: 5,
        paddingVertical: 2,
    },
    lockText: {
        fontSize: 10,
        color: "#b0bec5",
        fontWeight: "600",
    },
    logoutRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginHorizontal: 12,
        marginVertical: 4,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 14,
    },
    logoutIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "#fef2f4",
        alignItems: "center",
        justifyContent: "center",
    },
    logoutLabel: {
        flex: 1,
        fontSize: 15,
        fontWeight: "600",
        color: PRIMARY,
    },
    // Notification bell + right group
    rightGroup: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    bellBtn: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.15)",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    notifBadge: {
        position: "absolute",
        top: -3,
        right: -3,
        minWidth: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: "#2b3445",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 3,
        borderWidth: 1.5,
        borderColor: PRIMARY,
    },
    notifBadgeText: {
        fontSize: 9,
        fontWeight: "700",
        color: "#ffffff",
    },
});
