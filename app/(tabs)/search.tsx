import React, { useState } from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    FlatList,
    Platform,
    ScrollView,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/ui/Text";
import { ProductCard } from "@/components/store/ProductCard";
import { CustomHeader } from "@/components/layout/CustomHeader";
import { CustomModal } from "@/components/ui/CustomModal";

// Mock Data
const CATEGORIES = ["Electronics", "Fashion", "Home & Garden", "Automotive", "Sports"];
const BRANDS = ["Apple", "Samsung", "Sony", "Dell", "HP", "Nike", "Adidas"];

const MOCK_PRODUCTS: any[] = [
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
        id: "p2",
        title: "Minimalist Leather Backpack",
        brand: "Everlane",
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400",
        rating: 4.6,
        reviewCount: 856,
        retailPrice: 89.00,
        wholesalePrice: 45.00,
        wholesaleMoq: 50,
        wholesaleTierText: "50-99 pcs",
        colors: ["#8b5a2b", "#000000", "#556b2f", "#4682b4", "#cccccc"],
        stockStatus: "low_stock"
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
    },
    {
        id: "p4",
        title: "Professional Aluminum Laptop Stand",
        brand: "Satechi",
        imageUrl: "https://images.unsplash.com/photo-1550226891-ef816aed4ca8?auto=format&fit=crop&q=80&w=400",
        rating: 4.9,
        reviewCount: 2150,
        retailPrice: 45.00,
        wholesalePrice: 22.50,
        wholesaleMoq: 100,
        wholesaleTierText: "100+ pcs",
        colors: ["#c0c0c0", "#4B4C50"],
        stockStatus: "out_of_stock"
    }
];

export default function SearchScreen() {
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState("");
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [isCategoryVisible, setIsCategoryVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All Categories");

    // Filter States
    const [selectedBrand, setSelectedBrand] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [selectedRating, setSelectedRating] = useState(0);

    const renderSearchBar = () => (
        <View className="bg-background-light px-4 py-3 z-10 my-2">
            <View className="flex-row items-center justify-between">
                {/* Categories Button */}
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setIsCategoryVisible(true)}
                    className="w-11 h-11 bg-white rounded-md items-center justify-center mr-2 border border-border-light shadow-sm shadow-black/5"
                >
                    <Ionicons name="grid-outline" size={18} color="#2b3445" />
                </TouchableOpacity>

                {/* Search Bar */}
                <View className="flex-1 bg-white rounded-md flex-row items-center px-3 h-11 border border-border-light shadow-sm shadow-black/5">
                    <Ionicons name="search" size={16} color="#697282" />
                    <TextInput
                        className="flex-1 mx-1 text-[14px] text-text-dark outline-none"
                        placeholder="Search products..."
                        placeholderTextColor="#9ca3af"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        returnKeyType="search"
                        maxLength={100}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery("")}>
                            <Ionicons name="close-circle" size={16} color="#ccd3e1" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Filter Button */}
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setIsFilterVisible(true)}
                    className="w-11 h-11 bg-white rounded-md items-center justify-center ml-2 relative border border-border-light shadow-sm shadow-black/5"
                >
                    <Ionicons name="options-outline" size={20} color="#2b3445" />
                    {(selectedBrand || minPrice || selectedRating > 0) && (
                        <View className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#f59e0b] rounded-full border border-white" />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderCategoryModal = () => (
        <CustomModal
            isVisible={isCategoryVisible}
            onClose={() => setIsCategoryVisible(false)}
            title="Select Category"
            // maxHeight="h-[60%]"
            type="center"
        >
            <ScrollView showsVerticalScrollIndicator={false} className="px-6 py-4">
                {CATEGORIES.map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        onPress={() => {
                            setSelectedCategory(cat);
                            setIsCategoryVisible(false);
                        }}
                        className={`flex-row items-center justify-between py-2 border-b border-border-light ${selectedCategory === cat ? "bg-primary/5 rounded-lg px-4 border-b-0 mb-1" : ""}`}
                    >
                        <Text
                            variant="caption"
                            className={`text-[16px] ${selectedCategory === cat ? "text-primary font-medium" : "text-text-dark"}`}
                        >
                            {cat}
                        </Text>
                        {selectedCategory === cat && (
                            <Ionicons name="checkmark-circle" size={18} color="#e94560" />
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </CustomModal>
    );

    const renderFilterModal = () => (
        <CustomModal
            isVisible={isFilterVisible}
            onClose={() => setIsFilterVisible(false)}
            title="Select Filters"

        >
            <View className="flex-1">
                <ScrollView className="px-6 py-4" showsVerticalScrollIndicator={false}>
                    {/* Price Range */}
                    <Text variant="body" className="text-text-dark font-medium mb-2">Price Range :</Text>
                    <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-1 bg-background-light rounded-md flex-row items-center px-4 h-10 border border-border-light ">
                            <Text className="text-text-accent mr-1">$</Text>
                            <TextInput
                                className="flex-1 text-[12px] text-text-dark outline-none "
                                placeholder="Min"
                                keyboardType="numeric"
                                value={minPrice}
                                onChangeText={setMinPrice}
                                maxLength={18}
                            />
                        </View>
                        <View className="w-2 h-[1px] bg-border-light " />
                        <View className="flex-1 bg-background-light rounded-md flex-row items-center px-4 h-10 border border-border-light">
                            <Text className="text-text-accent mr-1">$</Text>
                            <TextInput
                                className="flex-1 text-[12px] text-text-dark outline-none"
                                placeholder="Max"
                                keyboardType="numeric"
                                value={maxPrice}
                                onChangeText={setMaxPrice}
                                maxLength={18}
                            />
                        </View>
                    </View>


                    {/* Brands */}
                    <Text variant="body" className="text-text-dark font-medium mb-4">Brands :</Text>
                    <View className="flex-row flex-wrap gap-3 mb-8">
                        {BRANDS.map((brand) => (
                            <TouchableOpacity
                                key={brand}
                                onPress={() => setSelectedBrand(brand === selectedBrand ? "" : brand)}
                                className={`px-4 py-2 rounded-full border ${selectedBrand === brand ? "bg-primary border-primary" : "bg-white border-border-light"}`}
                            >
                                <Text variant="caption" className={`font-medium ${selectedBrand === brand ? "text-white" : "text-text-dark"}`}>
                                    {brand}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Ratings */}
                    <Text variant="body" className="text-text-dark font-medium mb-4">Rating :</Text>
                    <View className="flex-row items-center justify-between bg-background-light py-2 px-4 rounded-xl mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity
                                key={star}
                                onPress={() => setSelectedRating(star)}
                                className="items-center"
                            >
                                <View className={`w-10 h-10 rounded-full items-center justify-center  ${selectedRating >= star ? "bg-[#f59e0b]/10" : "bg-white"}`}>
                                    <Ionicons
                                        name={selectedRating >= star ? "star" : "star-outline"}
                                        size={18}
                                        color={selectedRating >= star ? "#f59e0b" : "#ccd3e1"}
                                    />
                                </View>
                                <Text variant="caption" className="text-text-accent font-medium mt-2">{star}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View className="h-20" />
                </ScrollView>

                {/* Footer Buttons */}
                <View className="p-4 border-t border-border-light flex-row gap-4 bg-white">
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                            setMinPrice("");
                            setMaxPrice("");
                            setSelectedBrand("");
                            setSelectedRating(0);
                        }}
                        className="flex-1 h-10 rounded-md border border-border-light items-center justify-center bg-background-light"
                    >
                        <Text variant="body" className="text-text-dark font-medium">Reset</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setIsFilterVisible(false)}
                        className="flex-1 h-10 rounded-md items-center justify-center bg-primary"
                    >
                        <Text variant="body" className="text-white font-medium">Apply</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </CustomModal>
    );

    return (
        <View className="flex-1 bg-background-light">
            {renderSearchBar()}

            {/* Active Category Indicator */}
            {selectedCategory !== "All Categories" && (
                <View className="px-4 py-3 bg-white border-b border-border-light flex-row items-center justify-between">
                    <Text variant="caption" className="text-text-dark font-medium ml-2">
                        {selectedCategory}
                    </Text>
                    <TouchableOpacity onPress={() => setSelectedCategory("All Categories")}>
                        <Ionicons name="close-circle" size={18} color="#ccd3e1" />
                    </TouchableOpacity>
                </View>
            )}

            <FlatList
                data={MOCK_PRODUCTS}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={{ paddingHorizontal: 16, paddingTop: 16, gap: 16 }}
                ListFooterComponent={<View style={{ height: 100 }} />}
                renderItem={({ item }) => (
                    <View className="flex-1 max-w-[50%]">
                        <ProductCard {...item} />
                    </View>
                )}
            />

            {renderCategoryModal()}
            {renderFilterModal()}
        </View>
    );
}
