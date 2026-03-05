import React from "react";
import { View, Image, TouchableOpacity, Linking, Platform } from "react-native";
import { Text } from "@/components/ui/Text";
import { Ionicons } from "@expo/vector-icons";

export interface MessageProps {
    id: string;
    text?: string;
    imageUrl?: string;
    fileName?: string;
    fileUrl?: string;
    isSentByMe: boolean;
    timestamp: string;
    isBotPrompt?: boolean;
}

export const MessageBubble: React.FC<MessageProps> = ({
    text,
    imageUrl,
    fileName,
    fileUrl,
    isSentByMe,
    timestamp,
    isBotPrompt
}) => {
    const handleFileOpen = () => {
        if (fileUrl) {
            // Check if it's a web url or local uri. 
            // In a real app we'd use Expo FileSystem / Sharing / WebBrowser
            Linking.openURL(fileUrl).catch(() => console.log("Failed to open file"));
        }
    };

    if (isBotPrompt) {
        return (
            <View className="mb-4 items-center">
                <View className="bg-background-light py-2 px-4 rounded-full border border-border-light">
                    <Text variant="caption" className="text-text-accent text-center font-medium">
                        {text}
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View className={`w-full mb-4 px-4 ${isSentByMe ? "items-end" : "items-start"}`}>
            <View className={`flex-row items-end max-w-[85%] ${!isSentByMe ? "shrink" : ""}`}>

                {/* Avatar for received messages */}
                {!isSentByMe && (
                    <View className="w-8 h-8 rounded-full bg-primary items-center justify-center mr-2 mb-1">
                        <Ionicons name="headset-outline" size={16} color="#ffffff" />
                    </View>
                )}

                {/* Bubble Container */}
                <View
                    className={`shrink rounded-2xl px-4 py-3 ${isSentByMe
                        ? "bg-primary rounded-br-sm"
                        : "bg-background-white border border-border rounded-bl-sm"
                        }`}
                >
                    {/* Attachment: Image */}
                    {imageUrl && (
                        <View className="w-48 h-48 rounded-xl overflow-hidden mb-2 bg-background-light">
                            <Image source={{ uri: imageUrl }} className="w-full h-full" resizeMode="cover" />
                        </View>
                    )}

                    {/* Attachment: Document */}
                    {fileName && (
                        <TouchableOpacity
                            onPress={handleFileOpen}
                            activeOpacity={0.7}
                            className={`flex-row items-center p-3 rounded-lg mb-2 ${isSentByMe ? "bg-white/20" : "bg-background-light border border-border-light"}`}
                        >
                            <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${isSentByMe ? "bg-white/30" : "bg-primary/10"}`}>
                                <Ionicons name="document-text" size={20} color={isSentByMe ? "#ffffff" : "#e94560"} />
                            </View>
                            <View className="flex-1">
                                <Text
                                    variant="caption"
                                    className={`font-semibold ${isSentByMe ? "text-white" : "text-text-dark"}`}
                                    numberOfLines={1}
                                >
                                    {fileName}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}

                    {/* Text Message */}
                    {!!text && (
                        <Text
                            variant="body"
                            className={`text-[15px] leading-6 ${isSentByMe ? "text-white" : "text-text-dark"}`}
                        >
                            {text}
                        </Text>
                    )}

                    {/* Timestamp */}
                    <Text
                        variant="caption"
                        className={`text-[10px] self-end mt-1 ${isSentByMe ? "text-white/70" : "text-text-accent"}`}
                    >
                        {timestamp}
                    </Text>
                </View>
            </View>
        </View>
    );
};
