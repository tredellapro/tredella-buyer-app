import React, { forwardRef } from "react";
import {
    TextInput,
    TextInputProps,
    View,
    TouchableOpacity,
    Platform,
} from "react-native";
import { Text } from "./Text";
import { Ionicons } from "@expo/vector-icons";

interface Props extends TextInputProps {
    label?: string;
    error?: string;
    className?: string; // For container
    inputClassName?: string;
    required?: boolean;
    showCharCount?: boolean;
    isNumeric?: boolean;
    allowDecimals?: boolean;
    allowNegative?: boolean;
}

export const Input = forwardRef<TextInput, Props>(
    ({
        label,
        error,
        className = "",
        inputClassName = "",
        required = false,
        secureTextEntry,
        showCharCount,
        isNumeric,
        allowDecimals = true,
        allowNegative = false,
        onChangeText,
        ...props
    }, ref) => {
        const [isFocused, setIsFocused] = React.useState(false);
        const [showPassword, setShowPassword] = React.useState(false);

        const handleFocus = (e: any) => {
            setIsFocused(true);
            props.onFocus?.(e);
        };

        const handleBlur = (e: any) => {
            setIsFocused(false);
            props.onBlur?.(e);
        };

        const handleTextChange = (text: string) => {
            if (isNumeric) {
                // Remove all non-numeric characters except decimals and negatives if allowed
                let sanitized = text;
                if (!allowDecimals && !allowNegative) {
                    sanitized = text.replace(/[^0-9]/g, "");
                } else {
                    // Allow only one decimal point and one leading negative sign
                    const regex = new RegExp(
                        `^${allowNegative ? "-?" : ""}[0-9]*${allowDecimals ? "\\.?[0-9]*" : ""}$`
                    );
                    if (!regex.test(text)) {
                        // If invalid, try to keep the previous valid state or just strip bad chars
                        // Simple fallback: keep only allowed chars
                        sanitized = text.replace(
                            allowNegative && allowDecimals
                                ? /[^0-9.-]/g
                                : allowDecimals
                                    ? /[^0-9.]/g
                                    : allowNegative
                                        ? /[^0-9-]/g
                                        : /[^0-9]/g,
                            ""
                        );
                    }
                }
                onChangeText?.(sanitized);
            } else {
                onChangeText?.(text);
            }
        };

        const getBorderColor = () => {
            if (error) return "border-border-primary";
            if (isFocused) return "border-border-primary";
            return "border-border-secondary";
        };

        const isPassword = secureTextEntry && !showPassword;
        const currentLength = props.value?.length || 0;

        return (
            <View className={`mb-4 ${className}`}>
                <View className="flex-row justify-between items-center mb-1.5">
                    {label && (
                        <Text variant="body" className="font-medium text-[15px]">
                            {label}
                            {required && <Text className="text-red-500"> *</Text>}
                        </Text>
                    )}
                    {showCharCount && props.maxLength && (
                        <Text variant="caption" className="text-text-accent">
                            {currentLength}/{props.maxLength}
                        </Text>
                    )}
                </View>

                <View className="relative justify-center">
                    <TextInput
                        ref={ref}
                        className={`text-text-dark text-[15px] bg-background-light border rounded-lg px-4 h-12 outline-none ${getBorderColor()} ${props.editable === false ? "opacity-60" : ""
                            } ${secureTextEntry ? "pr-12" : ""} ${inputClassName}`}
                        placeholderTextColor="#697282"
                        autoCapitalize="none"
                        {...props}
                        keyboardType={isNumeric ? (Platform.OS === 'ios' ? 'decimal-pad' : 'numeric') : props.keyboardType}
                        secureTextEntry={isPassword}
                        onChangeText={handleTextChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                    {secureTextEntry && (
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            className="absolute right-4"
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={!showPassword ? "eye-off-outline" : "eye-outline"}
                                size={20}
                                color="#697282"
                            />
                        </TouchableOpacity>
                    )}
                </View>

                {error && (
                    <Text variant="caption" className="mt-1 text-text-primary">
                        {error}
                    </Text>
                )}
            </View>
        );
    }
);

Input.displayName = "Input";
