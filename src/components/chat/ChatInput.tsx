import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, ActionSheetIOS, Platform, KeyboardAvoidingView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

interface ChatInputProps {
    onSend: (text: string, attachment?: { uri: string; type: "image" | "file"; name?: string }) => void;
    isAdminAutoReply?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isAdminAutoReply }) => {
    const [message, setMessage] = useState("");

    const handleSend = () => {
        if (message.trim()) {
            onSend(message.trim());
            setMessage("");
        }
    };

    const handleAttachment = () => {
        if (Platform.OS === "ios") {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options: ["Cancel", "Take Photo", "Choose Photo", "Attach Document"],
                    cancelButtonIndex: 0,
                },
                (buttonIndex) => {
                    if (buttonIndex === 1) handleCamera();
                    else if (buttonIndex === 2) handleGallery();
                    else if (buttonIndex === 3) handleDocument();
                }
            );
        } else {
            // Android fallback (in real app, use a custom bottom sheet modal)
            handleGallery();
        }
    };

    const handleCamera = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            onSend("", { uri: result.assets[0].uri, type: "image" });
        }
    };

    const handleGallery = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            onSend("", { uri: result.assets[0].uri, type: "image" });
        }
    };

    const handleDocument = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: "*/*",
            copyToCacheDirectory: true,
        });

        if (!result.canceled && result.assets[0]) {
            onSend("", {
                uri: result.assets[0].uri,
                type: "file",
                name: result.assets[0].name
            });
        }
    };

    return (
        <View className="bg-background-white border-t border-border-light px-4 py-3 pb-safe " >
            <View className="flex-row items-end">
                <TouchableOpacity
                    onPress={handleAttachment}
                    className="w-10 h-10 items-center justify-center mr-2 mb-1"
                >
                    <Ionicons name="add" size={28} color="#e94560" />
                </TouchableOpacity>

                <View className="flex-1">
                    <TextInput
                        value={message}
                        onChangeText={setMessage}
                        placeholder={isAdminAutoReply ? "Type a message..." : "Type a message..."}
                        placeholderTextColor="#9ca3af"
                        multiline
                        className="text-[15px] text-text-dark leading-5 flex-1 bg-background-light rounded-lg border border-primary outline-none min-h-[46px] max-h-[120px] justify-center px-4 py-3 mr-3"
                        style={{ paddingTop: 12, paddingBottom: 12 }}
                    />
                </View>

                <TouchableOpacity
                    onPress={handleSend}
                    disabled={!message.trim()}
                    className={`w-11 h-11 rounded-full items-center justify-center mb-0.5 ${message.trim() ? "bg-primary" : "bg-background-light border border-border-light"
                        }`}
                >
                    <Ionicons
                        name="send"
                        size={18}
                        color={message.trim() ? "#ffffff" : "#9ca3af"}
                        className="ml-1"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};
