import React from "react";
import {
    Modal as RNModal,
    View,
    TouchableOpacity,
    SafeAreaView,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "./Text";

interface Props {
    isVisible: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    type?: "bottom-sheet" | "center";
    maxHeight?: string;
    showCloseButton?: boolean;
}

export const CustomModal = ({
    isVisible,
    onClose,
    title,
    children,
    type = "bottom-sheet",
    maxHeight = "h-[85%]",
    showCloseButton = true,
}: Props) => {
    const isBottomSheet = type === "bottom-sheet";

    return (
        <RNModal
            visible={isVisible}
            animationType={isBottomSheet ? "slide" : "fade"}
            transparent={true}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View className={`flex-1 bg-black/50 ${isBottomSheet ? "justify-end" : "justify-center px-4"}`}>
                    <TouchableWithoutFeedback>
                        <View
                            className={`bg-background-white ${isBottomSheet ? "rounded-t-3xl" : "rounded-2xl"
                                } ${isBottomSheet ? maxHeight : "max-h-[70%]"} w-full`}
                        >
                            <KeyboardAvoidingView
                                behavior={Platform.OS === "ios" ? "padding" : "height"}
                                className="flex-1"
                            >
                                <SafeAreaView className="flex-1">
                                    {(title || showCloseButton) && (
                                        <View className="p-4 border-b border-border-secondary flex-row items-center justify-between">
                                            <View className="flex-1">
                                                {title && <Text variant="h3" numberOfLines={1}>{title}</Text>}
                                            </View>
                                            {showCloseButton && (
                                                <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                                    <Ionicons name="close" size={24} color="#2b3445" />
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    )}
                                    <View className="flex-1">
                                        {children}
                                    </View>
                                </SafeAreaView>
                            </KeyboardAvoidingView>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </RNModal>
    );
};
