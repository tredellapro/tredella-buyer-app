import { View, ScrollView } from "react-native";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";

export default function HomeScreen() {
    return (
        <ScrollView className="flex-1 bg-background">
            <View className="p-6">
                <Text variant="h1" className="mb-2">Discover</Text>
                <Text variant="body" className="mb-6">
                    Welcome to Tredella. Explore our new collections.
                </Text>

                {/* Placeholder for Product Grid */}
                <View className="bg-background-light h-64 rounded-3xl items-center justify-center mb-6 border border-border-secondary">
                    <Text className="text-text-accent italic">Product List Coming Soon</Text>
                </View>

                <Button
                    label="Explore Collection"
                    onPress={() => console.log("Pressed")}
                />
            </View>
        </ScrollView>
    );
}
