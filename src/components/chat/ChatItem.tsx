import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/Text";
import { Ionicons } from "@expo/vector-icons";

export interface ChatItemProps {
    id: string;
    name: string;
    lastMessage: string;
    timestamp: string;
    unreadCount?: number;
    avatarUrl?: string;
    isPinned?: boolean;
    isAdmin?: boolean;
    onPress: (id: string) => void;
}

export const ChatItem: React.FC<ChatItemProps> = ({
    id,
    name,
    lastMessage,
    timestamp,
    unreadCount = 0,
    avatarUrl,
    isPinned,
    isAdmin,
    onPress,
}) => {
    return (
        <TouchableOpacity
            onPress={() => onPress(id)}
            activeOpacity={0.7}
            className={`flex-row items-center p-4 bg-background-white border-b border-border-light ${isPinned ? "bg-primary/5" : ""}`}
        >
            {/* Avatar */}
            <View className={`w-14 h-14 rounded-full items-center justify-center mr-4 ${isAdmin ? "bg-primary" : "bg-background-light"}`}>
                {isAdmin ? (
                    <Ionicons name="headset-outline" size={24} color="#ffffff" />
                ) : (
                    <Text variant="h3" className={isAdmin ? "text-text-white" : "text-text-dark"}>
                        {name.charAt(0)}
                    </Text>
                )}
            </View>

            {/* Content */}
            <View className="flex-1 justify-center">
                <View className="flex-row items-center justify-between mb-1">
                    <View className="flex-row items-center">
                        <Text variant="body" className={`font-semibold ${unreadCount > 0 ? "text-text-dark" : "text-text-secondary"}`}>
                            {name}
                        </Text>
                        {isAdmin && (
                            <View className="bg-primary/20 px-2 py-0.5 rounded-sm ml-2">
                                <Text variant="caption" className="text-primary text-[10px] uppercase font-bold">Support</Text>
                            </View>
                        )}
                        {isPinned && !isAdmin && (
                            <Ionicons name="pin" size={14} color="#e94560" className="ml-1" />
                        )}
                    </View>
                    <Text variant="caption" className={`text-xs ${unreadCount > 0 ? "text-primary font-bold" : "text-text-accent"}`}>
                        {timestamp}
                    </Text>
                </View>

                <View className="flex-row items-center justify-between mt-0.5">
                    <Text
                        variant="body"
                        numberOfLines={1}
                        className={`flex-1 pr-4 ${unreadCount > 0 ? "text-text-dark font-medium" : "text-text-accent"}`}
                    >
                        {lastMessage}
                    </Text>
                    {unreadCount > 0 && (
                        <View className="bg-primary w-5 h-5 rounded-full items-center justify-center">
                            <Text variant="caption" className="text-white text-[10px] font-bold">
                                {unreadCount > 99 ? "99+" : unreadCount}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};
