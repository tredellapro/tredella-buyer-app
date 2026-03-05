import { Text as RNText, TextProps } from "react-native";

interface Props extends TextProps {
    variant?: "h1" | "h2" | "h3" | "body" | "caption";
    className?: string;
}

export const Text = ({ variant = "body", className = "", ...props }: Props) => {
    const variantStyles = {
        h1: "text-3xl font-bold text-text-dark",
        h2: "text-2xl font-semibold text-text-dark",
        h3: "text-xl font-medium text-text-dark",
        body: "text-base text-text-secondary",
        caption: "text-sm text-text-accent",
        primary: "text-base text-text-primary",
    };

    return (
        <RNText
            className={`${variantStyles[variant]} ${className}`}
            {...props}
        />
    );
};
