import React, { useState } from "react";
import { View, ScrollView, Image, TouchableOpacity, Platform, Dimensions, TextInput } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { useViewModeStore } from "@/store/viewModeStore";
import { CustomModal } from "@/components/ui/CustomModal";
import { formatReviewCount } from "@/utils/utilFuncs";

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
    discountBadge: "15% OFF",
    stockStatus: "in_stock",
    rating: 4.8,
    reviewCount: 1245,
    retailPrice: 249.99,
    wholesale: {
        moq: 20,
        tiers: [
            { min: 20, max: 49, price: 180.00 },
            { min: 50, max: 99, price: 170.00 },
            { min: 100, max: 499, price: 155.00 },
            { min: 500, max: 999, price: 150.00 },
            { min: 1000, max: "1000+", price: 145.00 }
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
    const [isOffersVisible, setIsOffersVisible] = useState(false);

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

    const renderOffersModal = () => (
        <CustomModal
            isVisible={isOffersVisible}
            onClose={() => setIsOffersVisible(false)}
            title="Other Offers"
        >
            <ScrollView className="p-6">
                <Text variant="caption" className="text-text-accent mb-4">2 other sellers offering this item</Text>

                <View className="bg-white p-4 rounded-2xl border border-border-light mb-4 shadow-sm shadow-black/5">
                    <View className="flex-row items-center justify-between mb-3">
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 bg-background-light rounded-full items-center justify-center border border-border-light">
                                <Ionicons name="storefront" size={16} color="#697282" />
                            </View>
                            <View className="ml-3">
                                <Text variant="body" className="font-bold text-text-dark">Global Imports Ltd.</Text>
                                <View className="flex-row items-center mt-0.5">
                                    <Ionicons name="star" size={12} color="#f59e0b" />
                                    <Text variant="caption" className="text-text-accent ml-1 text-[11px]">4.7 • 89K Followers</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View className="flex-row items-end justify-between border-t border-border-light pt-3">
                        <View>
                            <Text variant="h2" className="text-primary font-bold">${(PRODUCT_DATA.retailPrice - 10).toFixed(2)}</Text>
                            <Text variant="caption" className="text-text-accent text-[11px] mt-0.5">Free Shipping</Text>
                        </View>
                        <TouchableOpacity className="bg-text-dark px-4 py-2 rounded-lg" onPress={() => setIsOffersVisible(false)}>
                            <Text variant="body" className="text-white font-bold">Select Offer</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="bg-white p-4 rounded-2xl border border-border-light mb-4 shadow-sm shadow-black/5">
                    <View className="flex-row items-center justify-between mb-3">
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 bg-background-light rounded-full items-center justify-center border border-border-light">
                                <Ionicons name="storefront" size={16} color="#697282" />
                            </View>
                            <View className="ml-3">
                                <Text variant="body" className="font-bold text-text-dark">Electro World</Text>
                                <View className="flex-row items-center mt-0.5">
                                    <Ionicons name="star" size={12} color="#f59e0b" />
                                    <Text variant="caption" className="text-text-accent ml-1 text-[11px]">4.5 • 12K Followers</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View className="flex-row items-end justify-between border-t border-border-light pt-3">
                        <View>
                            <Text variant="h2" className="text-primary font-bold">${(PRODUCT_DATA.retailPrice + 5).toFixed(2)}</Text>
                            <Text variant="caption" className="text-text-accent text-[11px] mt-0.5">$5.00 Shipping</Text>
                        </View>
                        <TouchableOpacity className="bg-background-light border border-border-light px-4 py-2 rounded-lg" onPress={() => setIsOffersVisible(false)}>
                            <Text variant="body" className="text-text-dark font-bold">Select Offer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </CustomModal>
    );

    return (
        <View className="flex-1 bg-background-light">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} bounces={false}>
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
                    {/* =================== */}
                    <SafeAreaView edges={["top"]} className="absolute top-0 w-full">
                        <View className="flex-row gap-1 p-4 w-full justify-between">
                            <TouchableOpacity
                                onPress={() => router.canGoBack() ? router.back() : router.replace("/")}
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
                        </View>
                    </SafeAreaView>
                    {/* ============== */}

                </View>
                <View className="flex-1 flex-row justify-end items-center gap-1.5 m-2 ">
                    {PRODUCT_DATA.discountBadge ? (
                        <View className="bg-primary px-3 py-1 rounded-md shadow-sm opacity-95">
                            <Text variant="caption" className="text-white font-medium tracking-wider">{PRODUCT_DATA.discountBadge}</Text>
                        </View>
                    ) : null}
                    {PRODUCT_DATA.stockStatus === "in_stock" ? (
                        <View className="bg-[#10b981]/90 px-3 py-1 rounded-md shadow-sm opacity-95">
                            <Text variant="caption" className="text-white font-medium ">In Stock</Text>
                        </View>
                    ) : null}
                    {PRODUCT_DATA.stockStatus === "out_of_stock" ? (
                        <View className="bg-[#2b3445]/90 px-3 py-1 rounded-md shadow-sm opacity-95">
                            <Text variant="caption" className="text-white font-medium opacity-90">Out of Stock</Text>
                        </View>
                    ) : null}
                </View>
                <View className="bg-white px-5 py-4 pt-4 mb-2 rounded-b-3xl shadow-sm shadow-black/5">

                    <View className="flex-row items-center justify-between mb-3">
                        <Text variant="caption" className="text-text-accent font-bold uppercase tracking-wider text-[14px]">
                            {PRODUCT_DATA.brand}
                        </Text>
                        <View className="flex-row items-center ">
                            <Ionicons name="star" size={14} color="#f59e0b" />
                            <Text variant="caption" className="text-text-dark font-bold ml-1.5 text-[12px]">
                                {PRODUCT_DATA.rating}
                                <Text variant="caption" className="text-text-accent font-normal tracking-tight ml-1">({formatReviewCount(PRODUCT_DATA.reviewCount)})</Text>
                            </Text>
                        </View>
                    </View>

                    {/* title */}
                    <Text variant="h2" className="text-text-dark font-bold leading-tight mb-2 border-b-2 border-border-light pb-2">
                        {PRODUCT_DATA.title}
                    </Text>
                    {isWholesale ? (
                        <>
                            <View className="flex-row items-center justify-between mb-2 px-1 ">
                                <Text variant="caption" className=" font-medium">Price Tiers</Text>
                                <Text variant="caption" className="text-primary font-medium">MOQ : {PRODUCT_DATA.wholesale.moq}</Text>
                            </View>
                            <View className="bg-background-light p-2 rounded-xl border border-border-light mb-2">

                                <View className="flex-row justify-start flex-wrap">
                                    {PRODUCT_DATA.wholesale.tiers.map((tier, i) => (
                                        <View key={i} className="items-start w-1/3 md:w-1/4 lg:w-1/5  p-1">
                                            <Text variant="caption" className="text-text-accent mb-1 text-[11px] text-start ">
                                                {tier.max === "1000+" ? `>= ${tier.min}` : `${tier.min}-${tier.max}`} pcs
                                            </Text>
                                            <Text variant="caption" className="text-primary font-bold">
                                                AED {tier.price.toFixed(2)}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </>
                    ) : (
                        <View className="flex-row items-end">
                            <Text variant="primary" className="text-primary text-[24px] font-bold">
                                AED {PRODUCT_DATA.retailPrice.toFixed(2)}
                            </Text>
                            <Text variant="body" className="text-text-accent ml-2 mb-1 line-through font-bold">
                                {(PRODUCT_DATA.retailPrice * 1.3).toFixed(2)}
                            </Text>
                        </View>
                    )}
                </View>

                <View className="bg-white p-5 mb-2">
                    <Text variant="caption" className=" font-medium mb-3">
                        Color : <Text variant="body" className="text-text-accent font-medium">{selectedColor.name}</Text>
                    </Text>
                    <View className="flex-row gap-3 overflow-x-scroll pb-3">
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


                {/* description */}
                <View className="bg-white px-5 pt-2 pb-3 mb-2">
                    <TouchableOpacity
                        className="py-2 flex-row justify-between items-center border-b border-border-light"
                        onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    >
                        <Text variant="body" className="text-text-dark font-bold">Description</Text>
                        <Ionicons name={isDescriptionExpanded ? "chevron-up" : "chevron-down"} size={18} color="#697282" />
                    </TouchableOpacity>
                    {isDescriptionExpanded ? (
                        <View className="py-2">
                            <Text variant="caption" className="text-text-accent leading-5">
                                {PRODUCT_DATA.description}
                            </Text>
                        </View>
                    ) : null}

                    <TouchableOpacity
                        className="py-2 flex-row justify-between items-center border-b border-border-light"
                        onPress={() => setIsSpecsExpanded(!isSpecsExpanded)}
                    >
                        <Text variant="body" className="text-text-dark font-bold">Specifications</Text>
                        <Ionicons name={isSpecsExpanded ? "chevron-up" : "chevron-down"} size={18} color="#697282" />
                    </TouchableOpacity>
                    {isSpecsExpanded ? (
                        <View className="pb-2">
                            {PRODUCT_DATA.specs.map((spec, i) => (
                                <View key={i} className={`flex-row justify-between py-2 ${i !== PRODUCT_DATA.specs.length - 1 ? "border-b border-border-light" : ""}`}>
                                    <Text variant="caption" className="text-text-accent">{spec.label}</Text>
                                    <Text variant="caption" className="text-text-dark font-medium">{spec.value}</Text>
                                </View>
                            ))}
                        </View>
                    ) : null}
                </View>
                {/* seller details */}
                <View className="bg-white p-5 mb-2 flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                        <View className="w-12 h-12 bg-background-light rounded-full items-center justify-center border border-border-light">
                            <Ionicons name="storefront" size={22} color="#697282" />
                        </View>
                        <View className="ml-3 flex-1">
                            <Text variant="body" className="text-text-dark font-bold mb-0.5" numberOfLines={1}>
                                {PRODUCT_DATA.seller.name}
                            </Text>
                            <View className="flex-row items-center">
                                <Ionicons name="star" size={12} color="#f59e0b" />
                                <Text variant="caption" className="text-text-accent ml-1">
                                    {PRODUCT_DATA.seller.rating} . {PRODUCT_DATA.seller.followers} Followers
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
                {/* reviews */}
                <View className="bg-white p-5 pb-[100px]">
                    <View className="flex-row items-center justify-between mb-2">
                        <Text variant="body" className="text-text-dark font-bold">Customer Reviews</Text>
                        <TouchableOpacity>
                            <Text variant="caption" className="text-primary font-medium">See All</Text>
                        </TouchableOpacity>
                    </View>
                    {PRODUCT_DATA.reviews.map((review, i) => (
                        <View key={i} className="mb-2 border border-border-light rounded-xl p-4">
                            <View className="flex-row items-center justify-between mb-2">
                                <View className="flex-row items-center">
                                    <View className="w-8 h-8 rounded-full bg-background-light items-center justify-center mr-2">
                                        <Text variant="caption" className="font-bold text-text-accent">{review.user[0]}</Text>
                                    </View>
                                    <Text variant="body" className="text-text-dark font-bold">{review.user}</Text>
                                </View>
                                <View className="flex-row mb-2">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <Ionicons key={star} name={star <= review.rating ? "star" : "star-outline"} size={14} color="#f59e0b" />
                                    ))}
                                </View>
                            </View>

                            <Text variant="caption" className="text-text-dark leading-5">{review.text}</Text>
                            <View className="flex-row items-center mt-1 justify-end">
                                <Text variant="caption" className="text-text-accent">{review.date}</Text>
                            </View>
                        </View>
                    ))}
                </View>
                <View className="h-6" />
            </ScrollView>
            {/* see offers button */}
            <TouchableOpacity
                onPress={() => setIsOffersVisible(true)}
                activeOpacity={0.9}
                className="absolute right-4 bottom-[80px] bg-text-dark pl-3 pr-4 py-2 rounded-full flex-row items-center shadow-lg shadow-black/20"
                style={{ zIndex: 50, elevation: 5 }}
            >
                <Ionicons name="layers-outline" size={20} color="#ffffff" />
                <Text variant="caption" className="text-white font-medium ml-2">See Offers</Text>
            </TouchableOpacity>
            {/* bottom cart */}
            <View className="absolute bottom-0 w-full bg-white border-t border-border-light px-4 py-3 pb-safe flex-row items-center z-40">
                <View className="flex-row items-center bg-background-light rounded-xl h-[46px] mr-3 border border-border-light px-1">
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
                <TouchableOpacity
                    activeOpacity={0.8}
                    className="flex-1 bg-primary h-[46px] rounded-xl flex-row items-center justify-center shadow-sm shadow-primary/20"
                >
                    <Ionicons name="cart-outline" size={18} color="#ffffff" className="mr-1" />
                    <Text variant="body" className="text-white font-medium ml-1 text-[14px]">Add to Cart</Text>
                </TouchableOpacity>
            </View>
            {renderOffersModal()}
        </View>
    );
}
