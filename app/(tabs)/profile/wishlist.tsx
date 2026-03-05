import React from "react";
import { View, FlatList } from "react-native";
import { CustomHeader } from "@/components/layout/CustomHeader";
import { ProductCard } from "@/components/store/ProductCard";

const WISHLIST_PRODUCTS: any[] = [
    {
        id: "p1",
        title: "Wireless Noise-Cancelling Headphones Pro Max",
        brand: "Sony",
        imageUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=400",
        rating: 4.8,
        reviewCount: 1245,
        retailPrice: 249.99,
        wholesalePrice: 180.00,
        wholesaleMoq: 20,
        wholesaleTierText: "20-49 pcs",
        colors: ["#1a1a1a", "#e5e7eb", "#1e3a8a"],
        discountBadge: "15% OFF",
        stockStatus: "in_stock"
    },
    {
        id: "p3",
        title: "Smart Home Security Camera 4K",
        brand: "Ring",
        imageUrl: "https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?auto=format&fit=crop&q=80&w=400",
        rating: 4.3,
        reviewCount: 342,
        retailPrice: 129.50,
        wholesalePrice: 95.00,
        wholesaleMoq: 10,
        wholesaleTierText: "10-24 pcs"
    }
];

export default function WishlistScreen() {
    return (
        <View className="flex-1 bg-background-light">
            <CustomHeader title="My Wishlist" canGoBack />
            <FlatList
                data={WISHLIST_PRODUCTS}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={{ paddingHorizontal: 16, paddingTop: 16, gap: 16 }}
                contentContainerStyle={{ paddingBottom: 40 }}
                renderItem={({ item }) => (
                    <View className="flex-1 max-w-[50%]">
                        <ProductCard {...item} />
                    </View>
                )}
            />
        </View>
    );
}
