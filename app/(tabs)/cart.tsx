import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, FlatList, Image, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { CustomHeader } from "@/components/layout/CustomHeader";
import { useCartStore } from "@/store/cartStore";
import { useViewModeStore } from "@/store/viewModeStore";
import { CartItemCard } from "@/components/store/CartItemCard";

const { width } = Dimensions.get("window");

export default function CartScreen() {
    const router = useRouter();
    const { items, getSubtotal, getTotal, clearCart } = useCartStore();
    const { mode } = useViewModeStore();
    const isWholesale = mode === "wholesale";

    const subtotal = getSubtotal(mode);
    const tax = subtotal * 0.08;
    const shipping = subtotal > 0 ? 15 : 0;
    const total = getTotal(mode);

    if (items.length === 0) {
        return (
            <View className="flex-1 bg-background-light">
                <CustomHeader title="Shopping Cart" />
                <View className="flex-1 items-center justify-center p-8">
                    <View className="w-64 h-64 mb-6 items-center justify-center opacity-20">
                        <Ionicons name="cart-outline" size={120} color="#2b3445" />
                    </View>
                    <Text variant="h2" className="text-text-dark mb-2 text-center">Your cart is empty</Text>
                    <Text variant="body" className="text-text-accent mb-8 text-center">
                        Looks like you haven't added anything to your cart yet.
                    </Text>
                    <Button
                        label="Start Shopping"
                        onPress={() => router.push("/(tabs)")}
                        className="w-full max-w-[240px]"
                    />
                </View>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background-light">
            <CustomHeader title={`Cart (${items.length})`} />

            <FlatList
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <CartItemCard item={item} />}
                contentContainerStyle={{ padding: 16, paddingBottom: 250 }}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View className="flex-row justify-between items-center mb-4">
                        <Text variant="h3" className="text-text-dark font-bold">Your Items</Text>
                        <TouchableOpacity onPress={clearCart}>
                            <Text variant="caption" className="text-primary font-bold">Clear All</Text>
                        </TouchableOpacity>
                    </View>
                }
            />

            {/* Summary Sticky Bottom */}
            <View
                className="absolute bottom-0 w-full bg-white border-t border-border-light px-6 py-6 pb-safe shadow-lg shadow-black/10"
                style={{ zIndex: 100 }}
            >
                <View className="flex-row justify-between mb-2">
                    <Text variant="body" className="text-text-accent">Subtotal</Text>
                    <Text variant="body" className="text-text-dark font-medium">${subtotal.toFixed(2)}</Text>
                </View>
                <View className="flex-row justify-between mb-2">
                    <Text variant="body" className="text-text-accent">Shipping</Text>
                    <Text variant="body" className="text-text-dark font-medium">${shipping.toFixed(2)}</Text>
                </View>
                <View className="flex-row justify-between mb-4">
                    <Text variant="body" className="text-text-accent">Tax (8%)</Text>
                    <Text variant="body" className="text-text-dark font-medium">${tax.toFixed(2)}</Text>
                </View>

                <View className="flex-row justify-between items-center mb-6 pt-4 border-t border-border-light">
                    <Text variant="h3" className="text-text-dark font-bold">Total Amount</Text>
                    <Text variant="h2" className="text-primary font-bold">${total.toFixed(2)}</Text>
                </View>

                <Button
                    label="Proceed to Checkout"
                    onPress={() => router.push("/checkout")}
                    icon={<Ionicons name="lock-closed-outline" size={18} color="white" />}
                />
            </View>
        </View>
    );
}
