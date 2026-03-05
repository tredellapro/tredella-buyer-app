import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/Text";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useViewModeStore } from "@/store/viewModeStore";

export interface ProductCardProps {
    id: string;
    title: string;
    brand: string;
    imageUrl: string;
    rating: number;
    reviewCount: number;
    retailPrice: number;
    wholesalePrice: number;
    wholesaleMoq: number;
    wholesaleTierText?: string;
    colors?: string[];
    stockStatus?: "in_stock" | "out_of_stock" | "low_stock";
    discountBadge?: string;
    onPress?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    id,
    title,
    brand,
    imageUrl,
    rating,
    reviewCount,
    retailPrice,
    wholesalePrice,
    wholesaleMoq,
    wholesaleTierText,
    colors,
    stockStatus,
    discountBadge,
    onPress,
}) => {
    const router = useRouter();
    const { mode } = useViewModeStore();
    const isWholesale = mode === "wholesale";

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            router.push(`/product/${id}`);
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={handlePress}
            className="bg-background-white rounded-2xl overflow-hidden mb-4 border border-border-light shadow-sm shadow-black/5"
        >
            {/* Product Image */}
            <View className="w-full aspect-square bg-background-light relative">
                <Image
                    source={{ uri: imageUrl }}
                    className="w-full h-full"
                    resizeMode="cover"
                />

                {/* Favorite Button (Mock) */}
                <TouchableOpacity
                    activeOpacity={0.7}
                    className="absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full items-center justify-center backdrop-blur-sm"
                >
                    <Ionicons name="heart-outline" size={18} color="#697282" />
                </TouchableOpacity>

                {/* Status Badges - Top Left */}
                <View className="absolute top-2 left-2 items-start gap-1">
                    {discountBadge && (
                        <View className="bg-primary px-2 py-0.5 rounded-sm shadow-sm opacity-95">
                            <Text className="text-[10px] text-white font-bold tracking-wider">{discountBadge}</Text>
                        </View>
                    )}
                    {stockStatus === "out_of_stock" && (
                        <View className="bg-[#2b3445]/90 px-2 py-0.5 rounded-sm shadow-sm backdrop-blur-sm">
                            <Text className="text-[10px] text-white font-bold opacity-90">Out of Stock</Text>
                        </View>
                    )}
                    {stockStatus === "low_stock" && (
                        <View className="bg-[#f59e0b]/90 px-2 py-0.5 rounded-sm shadow-sm backdrop-blur-sm">
                            <Text className="text-[10px] text-white font-bold">Low Stock</Text>
                        </View>
                    )}
                </View>

                {/* Wholesale Badge MOQ */}
                {isWholesale && (
                    <View className="absolute bottom-2 left-2 bg-secondary/90 px-2 py-1 rounded-md backdrop-blur-sm">
                        <Text className="text-[10px] text-white font-bold leading-none">
                            MOQ: {wholesaleMoq}
                        </Text>
                    </View>
                )}
            </View>

            {/* Product Info */}
            <View className="p-3">
                <Text variant="caption" className="text-text-accent mb-1 font-medium" numberOfLines={1}>
                    {brand}
                </Text>
                <Text variant="body" className="font-semibold text-text-dark leading-tight mb-1" numberOfLines={2}>
                    {title}
                </Text>

                {/* Rating */}
                <View className="flex-row items-center mb-2">
                    <Ionicons name="star" size={12} color="#f59e0b" />
                    <Text variant="caption" className="text-text-dark font-medium ml-1 text-[11px]">
                        {rating.toFixed(1)}
                    </Text>
                    <Text variant="caption" className="text-text-accent ml-1 text-[11px]">
                        ({reviewCount})
                    </Text>
                </View>

                {/* Variations (Colors) - Retail Only */}
                {!isWholesale && colors && colors.length > 0 && (
                    <View className="flex-row items-center mb-2 gap-1.5">
                        {colors.slice(0, 4).map((c, i) => (
                            <View key={i} className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: c }} />
                        ))}
                        {colors.length > 4 && (
                            <Text variant="caption" className="text-[10px] text-text-accent ml-1">+{colors.length - 4}</Text>
                        )}
                    </View>
                )}

                {/* Pricing based on Mode */}
                <View className="flex-row items-end justify-between mt-auto">
                    <View>
                        {isWholesale ? (
                            <>
                                <Text variant="caption" className="text-text-accent text-[10px] mb-0.5 font-medium">
                                    {wholesaleTierText || `${wholesaleMoq}+ pcs`}
                                </Text>
                                <Text variant="h3" className="text-primary font-bold">
                                    ${wholesalePrice.toFixed(2)}<Text variant="caption" className="text-primary text-[10px]"> / unit</Text>
                                </Text>
                            </>
                        ) : (
                            <Text variant="h3" className="text-primary font-bold">
                                ${retailPrice.toFixed(2)}
                            </Text>
                        )}
                    </View>

                    {/* Add to Cart quick button */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        className="w-8 h-8 bg-primary rounded-full items-center justify-center"
                    >
                        <Ionicons name="add" size={20} color="#ffffff" />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};
