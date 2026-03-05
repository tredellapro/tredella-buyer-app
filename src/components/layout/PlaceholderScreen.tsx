import { View } from "react-native";
import { Text } from "@/components/ui/Text";

const PlaceholderScreen = ({ title }: { title: string }) => (
    <View className="flex-1 items-center justify-center bg-background p-6">
        <Text variant="h2" className="mb-2">{title}</Text>
        <Text variant="body" className="text-center text-muted-foreground">
            This is a placeholder for the {title.toLowerCase()} screen.
        </Text>
    </View>
);

export default PlaceholderScreen;
