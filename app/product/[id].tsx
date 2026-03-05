import React, { useState } from "react";
import { View, ScrollView, Image, TouchableOpacity, Platform, Dimensions, TextInput } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { useViewModeStore } from "@/store/viewModeStore";

const { width } = Dimensions.get("window");

// Mock Data
const PRODUCT_DATA = {
    id: "p1",
    title: "Wireless Noise-Cancelling Headphones Pro Max",
    brand: "Sony",
    category: "Electronics",
    description: "Experience industry-leading noise cancellation with these premium over-ear headphones. Featuring 30-hour battery life, touch sensor controls, and crystal-clear hands-free calling. Perfect for travel, work, or relaxing at home.",
    images: [
        "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1546435770-a3e426fa4b8da?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.8,
    reviewCount: 1245,
    retailPrice: 249.99,
    wholesale: {
        moq: 20,
        tiers: [
            { min: 20, max: 49, price: 180.00 },
            { min: 50, max: 99, price: 170.00 },
            { min: 100, max: "500+", price: 155.00 }
        ]
    },
    colors: [
        { name: "Matte Black", hex: "#1a1a1a" },
        { name: "Silver", hex: "#e5e7eb" },
        { name: "Midnight Blue", hex: "#1e3a8a" }
    ],
    seller: {
        id: "seller_1",
        name: "Tech Haven Official Store",
        rating: 4.9,
        followers: "125K"
    },
    specs: [
        { label: "Connectivity", value: "Bluetooth 5.0" },
        { label: "Battery Life", value: "Up to 30 hours" },
        { label: "Weight", value: "254g" },
        { label: "Warranty", value: "1 Year Manufacturer" }
    ],
    reviews: [
        { id: "r1", user: "John D.", rating: 5, date: "2 days ago", text: "Incredible sound quality and the noise cancellation is unreal. Best purchase this year." },
        { id: "r2", user: "Sarah M.", rating: 4, date: "1 week ago", text: "Very comfortable for long flights. The app could be better but the hardware is perfect." }
    ]
};

export default function ProductDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { mode } = useViewModeStore();
    const isWholesale = mode === "wholesale";

    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [selectedColor, setSelectedColor] = useState(PRODUCT_DATA.colors[0]);
    const [quantity, setQuantity] = useState(isWholesale ? PRODUCT_DATA.wholesale.moq.toString() : "1");
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(true);
    const [isSpecsExpanded, setIsSpecsExpanded] = useState(false);

    const handleScroll = (event: any) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const index = event.nativeEvent.contentOffset.x / slideSize;
        setActiveImageIndex(Math.round(index));
    };

    const handleQuantityChange = (text: string) => {
        // Strip non-numeric
        const numeric = text.replace(/[^0-9]/g, "");
        setQuantity(numeric);
    };

    return (
        <View className="flex-1 bg-background-light">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} bounces={false}>
                {/* Image Carousel */}
                <View className="w-full bg-white relative">
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        className="w-full aspect-square"
                    >
                        {PRODUCT_DATA.images.map((img, i) => (
                            <Image
                                key={i}
                                source={{ uri: img }}
                                style={{ width, height: width }}
                                resizeMode="cover"
                            />
                        ))}
                    </ScrollView>

                    {/* Custom Header Actions overlaid on image */}
                    <SafeAreaView edges={["top"]} className="absolute top-0 w-full flex-row justify-between px-4 pt-4">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="w-10 h-10 bg-white/80 rounded-full items-center justify-center backdrop-blur-md shadow-sm"
                        >
                            <Ionicons name="arrow-back" size={24} color="#2b3445" />
                        </TouchableOpacity>
                        <View className="flex-row gap-2">
                            <TouchableOpacity className="w-10 h-10 bg-white/80 rounded-full items-center justify-center backdrop-blur-md shadow-sm">
                                <Ionicons name="share-outline" size={22} color="#2b3445" />
                            </TouchableOpacity>
                            <TouchableOpacity className="w-10 h-10 bg-white/80 rounded-full items-center justify-center backdrop-blur-md shadow-sm">
                                <Ionicons name="heart-outline" size={22} color="#2b3445" />
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>

                    {/* Pagination Dots */}
                    <View className="absolute bottom-4 w-full flex-row justify-center gap-2">
                        {PRODUCT_DATA.images.map((_, i) => (
                            <View
                                key={i}
                                className={`h-2 rounded-full ${activeImageIndex === i ? "w-6 bg-primary" : "w-2 bg-white/60"}`}
                            />
                        ))}
                    </View>
                </View>

                {/* Primary Info */}
                <View className="bg-white p-5 mb-2">
                    <View className="flex-row items-center justify-between mb-2">
                        <Text variant="caption" className="text-text-accent font-medium uppercase tracking-wider">
                            {PRODUCT_DATA.brand}
                        </Text>
                        <View className="flex-row items-center bg-[#f59e0b]/10 px-2 py-1 rounded-md">
                            <Ionicons name="star" size={14} color="#f59e0b" />
                            <Text variant="caption" className="text-[#f59e0b] font-bold ml-1">
                                {PRODUCT_DATA.rating} <Text className="text-text-accent font-normal">({PRODUCT_DATA.reviewCount})</Text>
                            </Text>
                        </View>
                    </View>

                    <Text variant="h2" className="text-text-dark font-bold leading-tight mb-4">
                        {PRODUCT_DATA.title}
                    </Text>

                    {/* Pricing Block - Depends on Mode */}
                    {isWholesale ? (
                        <View className="bg-background-light p-4 rounded-xl border border-border-light mb-2">
                            <View className="flex-row items-center justify-between mb-3 border-b border-border-light pb-3">
                                <Text variant="body" className="text-text-dark font-bold">Wholesale Pricing</Text>
                                <View className="bg-primary/10 px-2 py-1 rounded-md">
                                    <Text variant="caption" className="text-primary font-bold">MOQ: {PRODUCT_DATA.wholesale.moq}</Text>
                                </View>
                            </View>
                            <View className="flex-row justify-between">
                                {PRODUCT_DATA.wholesale.tiers.map((tier, i) => (
                                    <View key={i} className="items-center">
                                        <Text variant="caption" className="text-text-accent mb-1 text-[11px]">
                                            {tier.max === "500+" ? `≥ ${tier.min}` : `${tier.min}-${tier.max}`} units
                                        </Text>
                                        <Text variant="h3" className="text-primary font-bold">
                                            ${tier.price.toFixed(2)}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ) : (
                        <View className="flex-row items-end">
                            <Text variant="h1" className="text-primary font-bold">
                                ${PRODUCT_DATA.retailPrice.toFixed(2)}
                            </Text>
                            <Text variant="caption" className="text-text-accent ml-2 mb-1 line-through">
                                ${(PRODUCT_DATA.retailPrice * 1.3).toFixed(2)}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Variations */}
                <View className="bg-white p-5 mb-2">
                    <Text variant="h3" className="text-text-dark font-bold mb-3">
                        Color: <Text className="text-text-accent font-normal">{selectedColor.name}</Text>
                    </Text>
                    <View className="flex-row gap-3">
                        {PRODUCT_DATA.colors.map((color, i) => (
                            <TouchableOpacity
                                key={i}
                                onPress={() => setSelectedColor(color)}
                                className={`w-12 h-12 rounded-full items-center justify-center border-2 ${selectedColor.hex === color.hex ? "border-primary" : "border-transparent"}`}
                            >
                                <View
                                    className="w-10 h-10 rounded-full border border-black/10"
                                    style={{ backgroundColor: color.hex }}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Seller Block */}
                <View className="bg-white p-5 mb-2 flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                        <View className="w-12 h-12 bg-background-light rounded-full items-center justify-center border border-border-light">
                            <Ionicons name="storefront" size={20} color="#697282" />
                        </View>
                        <View className="ml-3 flex-1">
                            <Text variant="body" className="text-text-dark font-bold mb-0.5" numberOfLines={1}>
                                {PRODUCT_DATA.seller.name}
                            </Text>
                            <View className="flex-row items-center">
                                <Ionicons name="star" size={12} color="#f59e0b" />
                                <Text variant="caption" className="text-text-accent ml-1">
                                    {PRODUCT_DATA.seller.rating} • {PRODUCT_DATA.seller.followers} Followers
                                </Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity
                        className="ml-4 w-10 h-10 bg-primary/10 rounded-full items-center justify-center"
                        onPress={() => router.push(`/chat/${PRODUCT_DATA.seller.id}`)}
                    >
                        <Ionicons name="chatbubble-ellipses" size={20} color="#e94560" />
                    </TouchableOpacity>
                </View>

                {/* Details Accordions */}
                <View className="bg-white px-5 py-2 mb-2">
                    <TouchableOpacity
                        className="py-4 flex-row justify-between items-center border-b border-border-light"
                        onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    >
                        <Text variant="h3" className="text-text-dark font-bold">Description</Text>
                        <Ionicons name={isDescriptionExpanded ? "chevron-up" : "chevron-down"} size={20} color="#697282" />
                    </TouchableOpacity>
                    {isDescriptionExpanded && (
                        <View className="py-4">
                            <Text variant="body" className="text-text-accent leading-6">
                                {PRODUCT_DATA.description}
                            </Text>
                        </View>
                    )}

                    <TouchableOpacity
                        className="py-4 flex-row justify-between items-center"
                        onPress={() => setIsSpecsExpanded(!isSpecsExpanded)}
                    >
                        <Text variant="h3" className="text-text-dark font-bold">Specifications</Text>
                        <Ionicons name={isSpecsExpanded ? "chevron-up" : "chevron-down"} size={20} color="#697282" />
                    </TouchableOpacity>
                    {isSpecsExpanded && (
                        <View className="pb-4">
                            {PRODUCT_DATA.specs.map((spec, i) => (
                                <View key={i} className={`flex-row justify-between py-3 ${i !== PRODUCT_DATA.specs.length - 1 ? "border-b border-border-light" : ""}`}>
                                    <Text variant="body" className="text-text-accent">{spec.label}</Text>
                                    <Text variant="body" className="text-text-dark font-medium">{spec.value}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                {/* Reviews */}
                <View className="bg-white p-5 mb-[100px]">
                    <View className="flex-row items-center justify-between mb-6">
                        <Text variant="h3" className="text-text-dark font-bold">Customer Reviews</Text>
                        <TouchableOpacity>
                            <Text variant="body" className="text-primary font-medium">See All</Text>
                        </TouchableOpacity>
                    </View>
                    {PRODUCT_DATA.reviews.map((review, i) => (
                        <View key={i} className="mb-6">
                            <View className="flex-row items-center justify-between mb-2">
                                <View className="flex-row items-center">
                                    <View className="w-8 h-8 rounded-full bg-background-light items-center justify-center mr-2">
                                        <Text variant="caption" className="font-bold text-text-accent">{review.user[0]}</Text>
                                    </View>
                                    <Text variant="body" className="text-text-dark font-bold">{review.user}</Text>
                                </View>
                                <Text variant="caption" className="text-text-accent">{review.date}</Text>
                            </View>
                            <View className="flex-row mb-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Ionicons key={star} name={star <= review.rating ? "star" : "star-outline"} size={14} color="#f59e0b" />
                                ))}
                            </View>
                            <Text variant="body" className="text-text-dark leading-5">{review.text}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Bottom Floating Action Bar */}
            <View className="absolute bottom-0 w-full bg-white border-t border-border-light px-5 py-4 pb-safe flex-row items-center shadow-lg">
                {/* Quantity Selector */}
                <View className="flex-row items-center bg-background-light rounded-xl h-12 mr-4 border border-border-light px-1">
                    <TouchableOpacity
                        onPress={() => setQuantity(prev => Math.max(isWholesale ? PRODUCT_DATA.wholesale.moq : 1, parseInt(prev) - 1).toString())}
                        className="w-10 h-10 items-center justify-center"
                    >
                        <Ionicons name="remove" size={20} color="#2b3445" />
                    </TouchableOpacity>
                    <TextInput
                        value={quantity}
                        onChangeText={handleQuantityChange}
                        keyboardType="numeric"
                        className="w-10 text-center text-[16px] font-bold text-text-dark"
                    />
                    <TouchableOpacity
                        onPress={() => setQuantity(prev => (parseInt(prev || "0") + 1).toString())}
                        className="w-10 h-10 items-center justify-center"
                    >
                        <Ionicons name="add" size={20} color="#2b3445" />
                    </TouchableOpacity>
                </View>

                {/* Add to Cart Button */}
                <Button
                    title="Add to Cart"
                    onPress={() => { }}
                    className="flex-1 h-12"
                    textClassName="font-bold text-[16px]"
                />
            </View>
        </View>
    );
}
