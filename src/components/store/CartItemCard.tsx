import React from "react";
import { View, Image, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/Text";
import { CartItem } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { useViewModeStore } from "@/store/viewModeStore";

interface Props {
    item: CartItem;
}

export const CartItemCard = ({ item }: Props) => {
    const { updateQuantity, removeItem } = useCartStore();
    const { mode } = useViewModeStore();
    const isWholesale = mode === "wholesale";

    const getPrice = () => {
        if (isWholesale && item.wholesale) {
            const tier = [...item.wholesale.tiers]
                .reverse()
                .find((t) => item.quantity >= t.min);
            return tier ? tier.price : item.wholesalePrice || item.retailPrice;
        }
        return item.retailPrice;
    };

    const price = getPrice();
    const isUnderMoq = isWholesale && item.wholesale && item.quantity < item.wholesale.moq;

    return (
        <View className="bg-white p-4 rounded-2xl mb-3 flex-row border border-border-light shadow-sm shadow-black/5">
            {/* Image */}
            <View className="w-24 h-24 bg-background-light rounded-xl overflow-hidden border border-border-light">
                <Image
                    source={{ uri: item.imageUrl }}
                    className="w-full h-full"
                    resizeMode="cover"
                />
            </View>

            {/* Content */}
            <View className="flex-1 ml-4 justify-between">
                <View>
                    <View className="flex-row justify-between items-start">
                        <View className="flex-1 mr-2">
                            <Text variant="caption" className="text-text-accent font-medium mb-0.5" numberOfLines={1}>
                                {item.brand}
                            </Text>
                            <Text variant="body" className="font-bold text-text-dark leading-tight" numberOfLines={2}>
                                {item.title}
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => removeItem(item.id)}
                            className="w-8 h-8 items-center justify-center -mr-1"
                        >
                            <Ionicons name="trash-outline" size={18} color="#ef4444" />
                        </TouchableOpacity>
                    </View>

                    {/* Variations if any */}
                    <View className="flex-row items-center mt-1">
                        <Text variant="caption" className="text-text-accent">Qty: {item.quantity}</Text>
                        {isWholesale && item.wholesale && (
                            <View className={`ml-2 px-2 py-0.5 rounded-full ${isUnderMoq ? "bg-red-50" : "bg-primary/10"}`}>
                                <Text className={`text-[10px] font-bold ${isUnderMoq ? "text-red-500" : "text-primary"}`}>
                                    {isUnderMoq ? `MOQ ${item.wholesale.moq} required` : "MOQ Met"}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Price and Quantity Control */}
                <View className="flex-row items-center justify-between mt-2">
                    <View>
                        <Text variant="h3" className="text-primary font-bold">
                            ${price.toFixed(2)}
                            {isWholesale && <Text variant="caption" className="text-primary text-[10px]"> / unit</Text>}
                        </Text>
                    </View>

                    {/* Quantity Selector */}
                    <View className="flex-row items-center bg-background-light rounded-lg border border-border-light px-1">
                        <TouchableOpacity
                            onPress={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 items-center justify-center"
                        >
                            <Ionicons name="remove" size={16} color="#2b3445" />
                        </TouchableOpacity>
                        <TextInput
                            value={item.quantity.toString()}
                            onChangeText={(text) => {
                                const val = parseInt(text.replace(/[^0-9]/g, ""));
                                updateQuantity(item.id, isNaN(val) ? 0 : val);
                            }}
                            keyboardType="numeric"
                            className="w-8 text-center text-[14px] font-bold text-text-dark"
                        />
                        <TouchableOpacity
                            onPress={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 items-center justify-center"
                        >
                            <Ionicons name="add" size={16} color="#2b3445" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};
