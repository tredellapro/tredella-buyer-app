import React from "react";
import { TouchableOpacity, TouchableOpacityProps, View } from "react-native";
import { Text } from "./Text";

interface Props extends TouchableOpacityProps {
    label: string;
    variant?: "primary" | "secondary" | "outline" | "ghost";
    className?: string;
    textClassName?: string;
    loading?: boolean;
    icon?: React.ReactNode;
}

export const Button = ({
    label,
    variant = "primary",
    className = "",
    textClassName = "",
    loading = false,
    icon,
    ...props
}: Props) => {
    const variantStyles = {
        primary: "bg-background-primary",
        secondary: "bg-background-secondary",
        outline: "border border-border-primary bg-transparent",
        ghost: "bg-transparent",
    };

    const textStyles = {
        primary: "text-text-white",
        secondary: "text-text-white",
        outline: "text-text-primary",
        ghost: "text-text-primary",
    };

    return (
        <TouchableOpacity
            className={`h-12 px-6 rounded-lg items-center justify-center flex-row ${variantStyles[variant]} ${className} ${props.disabled ? "opacity-50" : ""}`}
            disabled={loading || props.disabled}
            {...props}
        >
            {icon && <View className="mr-2">{icon}</View>}
            <Text
                className={`font-semibold text-[15px] ${textStyles[variant]} ${textClassName}`}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
};
