import React from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/Text";
import { ChatItem } from "@/components/chat/ChatItem";
import Toast from "react-native-toast-message";

// Mock data for chat list
const MOCK_CHATS = [
    {
        id: "admin",
        name: "Tredella Support",
        lastMessage: "Hi there! How can we help you today?",
        timestamp: "Now",
        unreadCount: 1,
        isPinned: true,
        isAdmin: true,
    },
    {
        id: "seller_1",
        name: "Tech Haven",
        lastMessage: "Your order has been shipped via FedEx.",
        timestamp: "10:42 AM",
        unreadCount: 0,
        isPinned: false,
        isAdmin: false,
    },
    {
        id: "seller_2",
        name: "Global Apparel",
        lastMessage: "Yes, we have the blue jacket in size L.",
        timestamp: "Yesterday",
        unreadCount: 2,
        isPinned: false,
        isAdmin: false,
    },
    {
        id: "seller_3",
        name: "Home Essentials",
        lastMessage: "Thanks for your purchase!",
        timestamp: "Mar 2",
        unreadCount: 0,
        isPinned: false,
        isAdmin: false,
    },
];

export default function ChatsListScreen() {
    const router = useRouter();

    const handleChatPress = (id: string) => {
        router.push(`/chat/${id}`);
    };

    const handleNewChat = () => {
        Toast.show({
            type: "info",
            text1: "Select Seller",
            text2: "Browse products to start a new conversation.",
        });
    };

    return (
        <View className="flex-1 bg-background-light relative">
            <FlatList
                data={MOCK_CHATS}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ChatItem
                        id={item.id}
                        name={item.name}
                        lastMessage={item.lastMessage}
                        timestamp={item.timestamp}
                        unreadCount={item.unreadCount}
                        isPinned={item.isPinned}
                        isAdmin={item.isAdmin}
                        onPress={handleChatPress}
                    />
                )}
                contentContainerStyle={{ paddingBottom: 130 }}
                ListEmptyComponent={() => (
                    <View className="flex-1 items-center justify-center p-8 mt-20">
                        <Ionicons name="chatbubbles-outline" size={64} color="#ccd3e1" />
                        <Text variant="h3" className="mt-4 text-center text-text-secondary">No chats yet</Text>
                        <Text variant="body" className="mt-2 text-center text-text-accent">
                            Message sellers directly from product pages to start a conversation.
                        </Text>
                    </View>
                )}
            />

            {/* Floating Action Button for New Chat */}
            <TouchableOpacity
                activeOpacity={0.8}
                className="absolute right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg shadow-black/20"
                style={{ bottom: 110, elevation: 10, zIndex: 50 }}
                onPress={handleNewChat}
            >
                <Ionicons name="chatbubble-ellipses" size={24} color="#ffffff" />
            </TouchableOpacity>
        </View>
    );
}
