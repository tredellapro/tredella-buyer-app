import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CustomModal } from "./CustomModal";
import { Text } from "./Text";
import { Button } from "./Button";

export type AlertType = "success" | "error" | "warning" | "info";

interface Props {
    isVisible: boolean;
    onClose: () => void;
    type?: AlertType;
    title: string;
    message: string;
    confirmText?: string;
    onConfirm?: () => void;
    showCancel?: boolean;
    cancelText?: string;
}

export const AlertModal = ({
    isVisible,
    onClose,
    type = "info",
    title,
    message,
    confirmText = "OK",
    onConfirm,
    showCancel = false,
    cancelText = "Cancel",
}: Props) => {
    const getIcon = () => {
        switch (type) {
            case "success":
                return { name: "checkmark-circle", color: "#10b981" };
            case "error":
                return { name: "close-circle", color: "#ef4444" };
            case "warning":
                return { name: "warning", color: "#f59e0b" };
            default:
                return { name: "information-circle", color: "#3b82f6" };
        }
    };

    const icon = getIcon();

    const handleConfirm = () => {
        onConfirm?.();
        onClose();
    };

    return (
        <CustomModal isVisible={isVisible} onClose={onClose} type="center" showCloseButton={false}>
            <View className="p-6 items-center">
                <View className="mb-4">
                    <Ionicons name={icon.name as any} size={60} color={icon.color} />
                </View>

                <Text variant="h2" className="text-center mb-2">
                    {title}
                </Text>

                <Text variant="body" className="text-center text-text-secondary mb-8">
                    {message}
                </Text>

                <View className={`flex-row w-full ${showCancel ? "gap-4" : ""}`}>
                    {showCancel && (
                        <View className="flex-1">
                            <Button
                                label={cancelText}
                                variant="outline"
                                onPress={onClose}
                                className="h-11"
                            />
                        </View>
                    )}
                    <View className="flex-1">
                        <Button
                            label={confirmText}
                            onPress={handleConfirm}
                            className="h-11"
                        />
                    </View>
                </View>
            </View>
        </CustomModal>
    );
};
