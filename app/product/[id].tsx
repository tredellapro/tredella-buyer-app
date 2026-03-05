import React from "react";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";

export default function ProductDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    return (
        <View className="flex-1 bg-background-white p-6 justify-center items-center">
            <Text variant="h2" className="mb-4">Product Detail</Text>
            <Text variant="body" className="mb-8 text-text-accent text-center">
                Viewing details for product ID: {id}
            </Text>
            <Button label="Add to Cart" onPress={() => { }} />
        </View>
    );
}
