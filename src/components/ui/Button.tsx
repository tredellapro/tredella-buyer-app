import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Text } from "./Text";

interface Props extends TouchableOpacityProps {
    label: string;
    variant?: "primary" | "secondary" | "outline" | "ghost";
    className?: string;
    textClassName?: string;
    loading?: boolean;
}

export const Button = ({
    label,
    variant = "primary",
    className = "",
    textClassName = "",
    loading = false,
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
            className={`py-3 px-6 rounded-xl items-center justify-center ${variantStyles[variant]} ${className} ${props.disabled ? "opacity-50" : ""}`}
            disabled={loading || props.disabled}
            {...props}
        >
            <Text
                className={`font-semibold ${textStyles[variant]} ${textClassName}`}
            >
                {loading ? "Loading..." : label}
            </Text>
        </TouchableOpacity>
    );
};
