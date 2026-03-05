import React, { useState } from "react";
import {
    View,
    TouchableOpacity,
    Modal,
    FlatList,
    SafeAreaView,
} from "react-native";
import { Text } from "./Text";
import { Ionicons } from "@expo/vector-icons";

interface Option {
    label: string;
    value: string | number;
}

interface Props {
    label?: string;
    error?: string;
    options: Option[];
    value?: string | number;
    onValueChange: (value: string | number) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export const Select = ({
    label,
    error,
    options,
    value,
    onValueChange,
    placeholder = "Select an option",
    className = "",
    disabled = false,
}: Props) => {
    const [modalVisible, setModalVisible] = useState(false);

    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <View className={`mb-4 ${className}`}>
            <View className="mb-1.5">
                {label && (
                    <Text variant="body" className="font-medium text-[15px]">
                        {label}
                    </Text>
                )}
            </View>

            <TouchableOpacity
                onPress={() => !disabled && setModalVisible(true)}
                activeOpacity={0.7}
                className={`bg-background-light border rounded-lg px-4 h-12 flex-row items-center justify-between ${error ? "border-border-primary" : "border-border-secondary"
                    } ${disabled ? "opacity-60" : ""}`}
            >
                <Text
                    className={`${selectedOption ? "text-text-dark" : "text-text-accent"} text-[15px]`}
                >
                    {selectedOption ? selectedOption.label : placeholder}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#697282" />
            </TouchableOpacity>

            {error && (
                <Text variant="caption" className="mt-1 text-text-primary">
                    {error}
                </Text>
            )}

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-background-white rounded-t-3xl max-h-[80%]">
                        <SafeAreaView>
                            <View className="p-4 border-b border-border-secondary flex-row items-center justify-between">
                                <Text variant="h3">Select Option</Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Ionicons name="close" size={24} color="#2b3445" />
                                </TouchableOpacity>
                            </View>

                            <FlatList
                                data={options}
                                keyExtractor={(item) => item.value.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            onValueChange(item.value);
                                            setModalVisible(false);
                                        }}
                                        className={`p-4 border-b border-border-light flex-row items-center justify-between ${value === item.value ? "bg-background-light" : ""
                                            }`}
                                    >
                                        <Text
                                            className={
                                                value === item.value
                                                    ? "text-text-primary font-semibold"
                                                    : "text-text-secondary"
                                            }
                                        >
                                            {item.label}
                                        </Text>
                                        {value === item.value && (
                                            <Ionicons name="checkmark" size={20} color="#e94560" />
                                        )}
                                    </TouchableOpacity>
                                )}
                                contentContainerStyle={{ paddingBottom: 40 }}
                            />
                        </SafeAreaView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};
