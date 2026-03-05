import React, { forwardRef } from "react";
import {
    TextInput,
    TextInputProps,
    View,
} from "react-native";
import { Text } from "./Text";

interface Props extends TextInputProps {
    label?: string;
    error?: string;
    className?: string;
    inputClassName?: string;
    required?: boolean;
    showCharCount?: boolean;
}

export const TextArea = forwardRef<TextInput, Props>(
    ({ label, error, className = "", inputClassName = "", required = false, showCharCount, ...props }, ref) => {
        const [isFocused, setIsFocused] = React.useState(false);

        const handleFocus = (e: any) => {
            setIsFocused(true);
            props.onFocus?.(e);
        };

        const handleBlur = (e: any) => {
            setIsFocused(false);
            props.onBlur?.(e);
        };

        const getBorderColor = () => {
            if (error) return "border-border-primary";
            if (isFocused) return "border-border-primary";
            return "border-border-secondary";
        };

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

                <TextInput
                    ref={ref}
                    className={`text-text-dark text-[15px] min-h-[100px] text-top bg-background-light border rounded-lg px-4 py-3 outline-none ${getBorderColor()} ${props.editable === false ? "opacity-60" : ""
                        } ${inputClassName}`}
                    placeholderTextColor="#697282"
                    multiline
                    textAlignVertical="top"
                    {...props}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                {error && (
                    <Text variant="caption" className="mt-1 text-text-primary">
                        {error}
                    </Text>
                )}
            </View>
        );
    }
);

TextArea.displayName = "TextArea";
