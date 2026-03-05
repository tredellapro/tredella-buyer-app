import React, { useState, useRef, useEffect } from "react";
import { View, FlatList, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CustomHeader } from "@/components/layout/CustomHeader";
import { MessageBubble, MessageProps } from "@/components/chat/MessageBubble";
import { ChatInput } from "@/components/chat/ChatInput";
import { Text } from "@/components/ui/Text";
import { Ionicons } from "@expo/vector-icons";

const INITIAL_MESSAGES: Record<string, MessageProps[]> = {
    admin: [
        {
            id: "1",
            text: "Hi! Welcome to Tredella Support. How can we assist you today?",
            isSentByMe: false,
            timestamp: "10:00 AM",
        },
    ],
    seller_1: [
        {
            id: "1",
            text: "Your order has been shipped via FedEx.",
            isSentByMe: false,
            timestamp: "10:42 AM",
        },
    ],
    seller_2: [
        {
            id: "1",
            text: "Do you have this in blue?",
            isSentByMe: true,
            timestamp: "Yesterday",
        },
        {
            id: "2",
            text: "Yes, we have the blue jacket in size L.",
            isSentByMe: false,
            timestamp: "Yesterday",
        },
    ]
};

const BOT_PROMPTS = [
    "How does shipping work?",
    "What is the return policy?",
    "Where is my order?",
    "Talk to a human",
];

const BOT_REPLIES: Record<string, string> = {
    "How does shipping work?": "Standard shipping takes 3-5 business days. Express options are available at checkout.",
    "What is the return policy?": "You can return items within 30 days of receiving them. Ensure they are in original packaging.",
    "Where is my order?": "You can track your order by going to the 'Orders' tab and selecting your specific order.",
    "Talk to a human": "I am putting you in touch with a real agent. Please wait a moment...",
};

export default function ChatRoomScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [messages, setMessages] = useState<MessageProps[]>(INITIAL_MESSAGES[id || "seller_1"] || []);
    const flatListRef = useRef<FlatList>(null);

    const isAdmin = id === "admin";

    // Dynamic Header Title
    let chatName = "Chat";
    if (isAdmin) chatName = "Tredella Support";
    else if (id === "seller_1") chatName = "Tech Haven";
    else if (id === "seller_2") chatName = "Global Apparel";

    useEffect(() => {
        // Scroll to bottom on load
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: false });
        }, 100);
    }, []);

    const handleSend = (text: string, attachment?: { uri: string; type: "image" | "file"; name?: string }) => {
        const newMessage: MessageProps = {
            id: Date.now().toString(),
            text,
            isSentByMe: true,
            timestamp: "Now",
            imageUrl: attachment?.type === "image" ? attachment.uri : undefined,
            fileName: attachment?.type === "file" ? attachment.name : undefined,
            fileUrl: attachment?.type === "file" ? attachment.uri : undefined,
        };

        setMessages((prev) => [...prev, newMessage]);

        // Mock a received reply after 1 second if it's a normal seller
        if (!isAdmin && text) {
            setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now().toString(),
                        text: "We have received your message. A representative will reply shortly.",
                        isSentByMe: false,
                        timestamp: "Now",
                    },
                ]);
            }, 1000);
        }

        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    };

    const handleBotPromptSelect = (prompt: string) => {
        // 1. Send user's prompt
        handleSend(prompt);

        // 2. Add automated bot reply
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    text: BOT_REPLIES[prompt] || "I don't have an answer for that yet.",
                    isSentByMe: false,
                    timestamp: "Now",
                },
            ]);
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        }, 600);
    };

    return (
        <View className="flex-1 bg-background-light">
            <CustomHeader title={chatName} canGoBack />

            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <MessageBubble {...item} />}
                    contentContainerStyle={{ paddingVertical: 20 }}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                />

                {/* Bot Quick Prompts (Only for Admin) */}
                {isAdmin && (
                    <View className="px-4 pb-3">
                        <FlatList
                            data={BOT_PROMPTS}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => handleBotPromptSelect(item)}
                                    className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-full mr-2"
                                >
                                    <Text variant="caption" className="text-primary font-medium">{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                )}

                <ChatInput onSend={handleSend} isAdminAutoReply={isAdmin} />
            </KeyboardAvoidingView>

            {/* Safe Area helper for notch devices without pushing keyboard unnecessarily */}
            {Platform.OS === "ios" && <SafeAreaView edges={["bottom"]} className="bg-background-white" />}
        </View>
    );
}
