import React from "react";
import { View, TouchableOpacity, StyleSheet, Platform, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../ui/Text";

export const CustomTabBar = ({ state, descriptors, navigation }: any) => {
    const insets = useSafeAreaInsets();

    const getIcon = (name: string, isFocused: boolean) => {
        let iconName: any = "";
        switch (name) {
            case "index":
                iconName = isFocused ? "home" : "home-outline";
                break;
            case "search":
                iconName = isFocused ? "search" : "search-outline";
                break;
            case "cart":
                iconName = isFocused ? "cart" : "cart-outline";
                break;
            case "orders":
                iconName = isFocused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline";
                break;
            case "profile":
                iconName = isFocused ? "person" : "person-outline";
                break;
            default:
                iconName = "help-circle-outline";
        }
        return iconName;
    };

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom > 0 ? insets.bottom : 15 }]}>
            <View className="flex-row items-center justify-around h-16 px-2">
                {state.routes.map((route: any, index: number) => {
                    const { options } = descriptors[route.key];
                    const label = options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: "tabPress",
                            target: route.name,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: "tabLongPress",
                            target: route.key,
                        });
                    };

                    return (
                        <TouchableOpacity
                            key={index}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            className="flex-1 items-center justify-center pt-2 "
                        >
                            <View
                                className={`items-center justify-center p-2 rounded-2xl w-full max-w-[64px] ${isFocused ? "bg-white/20" : ""
                                    }`}
                            >
                                <Ionicons
                                    name={getIcon(route.name, isFocused)}
                                    size={24}
                                    color={isFocused ? "#ffffff" : "rgba(255,255,255,0.55)"}
                                />
                                {/* <Text
                                    className={`text-[11px] mt-1 font-medium ${isFocused ? "text-text-primary" : "text-text-accent"
                                        }`}
                                >
                                    {label}
                                </Text> */}
                                {isFocused && (
                                    <View className="absolute -bottom-2 w-1 h-1 bg-white rounded-full" />
                                )}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#e94560",
        borderTopWidth: 0,
        borderTopColor: "transparent",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        ...Platform.select({
            ios: {
                shadowColor: "#e94560",
                shadowOffset: { width: 0, height: -6 },
                shadowOpacity: 0.25,
                shadowRadius: 14,
            },
            android: {
                elevation: 20,
            },
        }),
    },
});
