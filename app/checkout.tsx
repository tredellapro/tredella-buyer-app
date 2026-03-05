import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";

export default function CheckoutScreen() {
    return (
        <View className="flex-1 bg-background-white p-6 justify-center items-center">
            <Text variant="h2" className="mb-4">Checkout</Text>
            <Text variant="body" className="mb-8 text-text-accent text-center">
                Your order is almost ready!
            </Text>
            <Button label="Pay Now" onPress={() => { }} />
        </View>
    );
}
