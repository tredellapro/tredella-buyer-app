import React, { useState, useMemo } from "react";
import {
    View,
    TouchableOpacity,
    Modal,
    FlatList,
    SafeAreaView,
} from "react-native";
import { Text } from "./Text";
import { Ionicons } from "@expo/vector-icons";

import { Input } from "./Input";

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
    const [searchQuery, setSearchQuery] = useState("");

    const selectedOption = options.find((opt) => opt.value === value);

    const filteredOptions = useMemo(() => {
        if (!searchQuery.trim()) return options;
        return options.filter((opt) =>
            opt.label.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [options, searchQuery]);

    const handleClose = () => {
        setModalVisible(false);
        setSearchQuery("");
    };

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
                    className={`${selectedOption ? "text-text-dark" : "text-text-accent"} text-[15px] text-ellipsis overflow-hidden whitespace-nowrap`}
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
                onRequestClose={handleClose}
            >
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-background-white rounded-t-3xl max-h-[85%]">
                        <SafeAreaView className="flex-1">
                            <View className="p-4 border-b border-border-secondary flex-row items-center justify-between">
                                <Text variant="h3">{label || "Select Option"}</Text>
                                <TouchableOpacity onPress={handleClose}>
                                    <Ionicons name="close" size={24} color="#2b3445" />
                                </TouchableOpacity>
                            </View>

                            {/* Search Bar using dynamic Input component */}
                            <View className="px-4 py-2 border-b border-border-light">
                                <Input
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    autoCorrect={false}
                                    className="mb-0"
                                />
                            </View>

                            <FlatList
                                data={filteredOptions}
                                keyExtractor={(item) => item.value.toString()}
                                ListEmptyComponent={
                                    <View className="p-10 items-center">
                                        <Text className="text-text-accent text-center">No results found for "{searchQuery}"</Text>
                                    </View>
                                }
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            onValueChange(item.value);
                                            handleClose();
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
                                keyboardShouldPersistTaps="handled"
                                initialNumToRender={15}
                                maxToRenderPerBatch={10}
                                windowSize={6}
                            />
                        </SafeAreaView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};
