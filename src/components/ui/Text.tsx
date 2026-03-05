import { Text as RNText, TextProps } from "react-native";

interface Props extends TextProps {
    variant?: "h1" | "h2" | "h3" | "body" | "caption" | "primary";
    className?: string;
}

export const Text = ({ variant = "body", className = "", ...props }: Props) => {
    const variantStyles = {
        h1: "text-2xl font-bold text-text-dark",
        h2: "text-xl font-semibold text-text-dark",
        h3: "text-lg font-medium text-text-dark",
        body: "text-[15px] text-text-secondary leading-6",
        caption: "text-xs text-text-accent",
        primary: "text-[15px] text-text-primary",
    };

    return (
        <RNText
            className={`${variantStyles[variant]} ${className}`}
            {...props}
        />
    );
};
