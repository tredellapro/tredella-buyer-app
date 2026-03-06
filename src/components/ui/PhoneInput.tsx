import React, { useState, useMemo, useEffect } from "react";
import {
    View,
    TouchableOpacity,
    TextInput,
    FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "./Text";
import { CustomModal } from "./CustomModal";
import { Input } from "./Input";
import { Country } from "@/api/locationService";

interface PhoneInputProps {
    label?: string;
    value: string;
    onChangeText: (text: string) => void;
    countries: Country[];
    selectedCountryCode?: string;
    isCountryPickerDisabled?: boolean;
    error?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
}

export const PhoneInput = ({
    label,
    value,
    onChangeText,
    countries,
    selectedCountryCode,
    isCountryPickerDisabled = false,
    error,
    placeholder = "Enter phone number",
    disabled = false,
    required = false,
}: PhoneInputProps) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
    const [localNumber, setLocalNumber] = useState("");

    // Sync with external selectedCountryCode
    useEffect(() => {
        if (selectedCountryCode && countries.length > 0) {
            const country = countries.find(c => c.code === selectedCountryCode);
            if (country && country.code !== selectedCountry?.code) {
                setSelectedCountry(country);

                // If we have a local number, notify parent with new combined value
                if (localNumber) {
                    const prefix = country.phoneCode.startsWith("+") ? country.phoneCode : `+${country.phoneCode}`;
                    onChangeText(`${prefix}${localNumber}`);
                }
            }
        }
    }, [selectedCountryCode, countries]);

    // Initialize/Sync from value prop when no external code is provided
    useEffect(() => {
        if (value && countries.length > 0 && !selectedCountryCode) {
            const sortedCountries = [...countries].sort((a, b) => b.phoneCode.length - a.phoneCode.length);
            for (const country of sortedCountries) {
                const prefix = country.phoneCode.startsWith("+") ? country.phoneCode : `+${country.phoneCode}`;
                if (value.startsWith(prefix)) {
                    if (selectedCountry?.code !== country.code) {
                        setSelectedCountry(country);
                    }
                    setLocalNumber(value.slice(prefix.length));
                    return;
                }
            }
        }
    }, [value, countries, selectedCountryCode]);

    const filteredCountries = useMemo(() => {
        if (!searchQuery.trim()) return countries;
        const query = searchQuery.toLowerCase();
        return countries.filter(
            (c) =>
                c.name.toLowerCase().includes(query) ||
                c.phoneCode.includes(query) ||
                c.code.toLowerCase().includes(query)
        );
    }, [countries, searchQuery]);

    const handleCountrySelect = (country: Country) => {
        setSelectedCountry(country);
        setModalVisible(false);
        setSearchQuery("");

        // Update parent with combined value
        const prefix = country.phoneCode.startsWith("+") ? country.phoneCode : `+${country.phoneCode}`;
        onChangeText(`${prefix}${localNumber}`);
    };

    const handleNumberChange = (text: string) => {
        // Keep only numbers
        const cleaned = text.replace(/[^0-9]/g, "");
        setLocalNumber(cleaned);

        if (selectedCountry) {
            const prefix = selectedCountry.phoneCode.startsWith("+")
                ? selectedCountry.phoneCode
                : `+${selectedCountry.phoneCode}`;
            onChangeText(`${prefix}${cleaned}`);
        }
    };

    return (
        <View className="mb-4">
            {label && (
                <View className="flex-row justify-between items-center mb-1.5">
                    <Text variant="body" className="font-medium text-[15px]">
                        {label}
                        {required && <Text className="text-red-500"> *</Text>}
                    </Text>
                </View>
            )}

            <View className={`flex-row bg-background-light border rounded-lg h-12 items-center overflow-hidden ${error ? "border-border-primary" : "border-border-secondary"
                } ${disabled ? "opacity-60" : ""}`}>

                {/* Country Selector */}
                <TouchableOpacity
                    onPress={() => !disabled && !isCountryPickerDisabled && setModalVisible(true)}
                    activeOpacity={0.7}
                    className={`flex-row items-center px-3 border-r border-border-secondary h-full bg-slate-50 ${isCountryPickerDisabled ? "opacity-90" : ""
                        }`}
                >
                    <Text className="text-[18px] mr-1">
                        {selectedCountry?.flag || "🏳️"}
                    </Text>
                    <Text className="text-[15px] text-text-dark font-medium mr-1">
                        {selectedCountry?.phoneCode.startsWith("+")
                            ? selectedCountry.phoneCode
                            : `+${selectedCountry?.phoneCode || ""}`}
                    </Text>
                    {!isCountryPickerDisabled && <Ionicons name="chevron-down" size={14} color="#697282" />}
                </TouchableOpacity>

                {/* Number Input */}
                <TextInput
                    className="flex-1 px-4 h-full text-[15px] text-text-dark"
                    placeholder={placeholder}
                    placeholderTextColor="#697282"
                    keyboardType="phone-pad"
                    value={localNumber}
                    onChangeText={handleNumberChange}
                    editable={!disabled}
                />
            </View>

            {error && (
                <Text variant="caption" className="mt-1 text-text-primary">
                    {error}
                </Text>
            )}

            {/* Country Selection Modal */}
            <CustomModal
                isVisible={modalVisible}
                onClose={() => setModalVisible(false)}
                title="Select Country"
            >
                <View className="px-4 py-2 border-b border-border-light">
                    <Input
                        placeholder="Search country or code..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoCorrect={false}
                        className="mb-0"
                    />
                </View>

                <FlatList
                    data={filteredCountries}
                    keyExtractor={(item) => item.code}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => handleCountrySelect(item)}
                            className={`p-4 border-b border-border-light flex-row items-center justify-between ${selectedCountry?.code === item.code ? "bg-background-light" : ""
                                }`}
                        >
                            <View className="flex-row items-center flex-1">
                                <Text className="text-[20px] mr-3">{item.flag}</Text>
                                <Text className="text-[15px] text-text-dark flex-1" numberOfLines={1}>
                                    {item.name}
                                </Text>
                            </View>
                            <Text className="text-[15px] font-semibold text-text-primary">
                                {item.phoneCode.startsWith("+") ? item.phoneCode : `+${item.phoneCode}`}
                            </Text>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={{ paddingBottom: 40 }}
                    keyboardShouldPersistTaps="handled"
                    initialNumToRender={15}
                    maxToRenderPerBatch={10}
                    windowSize={5}
                />
            </CustomModal>
        </View>
    );
};
