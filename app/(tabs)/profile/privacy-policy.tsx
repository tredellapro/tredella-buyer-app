import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/Text";
import { Ionicons } from "@expo/vector-icons";

export default function PrivacyPolicyScreen() {
    return (
        <SafeAreaView className="flex-1 bg-background-light" edges={["bottom"]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>

                <View className="items-center mb-6">
                    <Ionicons name="shield-checkmark-outline" size={48} color="#e94560" className="mb-3" />
                    <Text variant="h1" className="text-center mb-1">Privacy Policy</Text>
                    <Text variant="caption" className="text-text-accent text-center">
                        Last updated: March 6, 2026
                    </Text>
                </View>

                <View className="bg-background-white p-5 rounded-xl border border-border-light">

                    <Text variant="body" className="text-text-accent mb-6 leading-6">
                        Tredella ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by Tredella.
                    </Text>

                    <View className="mb-6">
                        <Text variant="h3" className="mb-2">1. Information We Collect</Text>
                        <Text variant="body" className="text-text-accent leading-6 mb-2">
                            • Account Information: Name, email address, password, phone number.
                        </Text>
                        <Text variant="body" className="text-text-accent leading-6 mb-2">
                            • Payment Information: Credit card numbers, billing address. (Note: Payment details are processed securely and not stored on our servers).
                        </Text>
                        <Text variant="body" className="text-text-accent leading-6">
                            • Usage Data: Information on how you interact with our app, preferences, and browsing history within the app.
                        </Text>
                    </View>

                    <View className="mb-6">
                        <Text variant="h3" className="mb-2">2. How We Use Information</Text>
                        <Text variant="body" className="text-text-accent leading-6 mb-2">
                            • To process your transactions and deliver the products you requested.
                        </Text>
                        <Text variant="body" className="text-text-accent leading-6 mb-2">
                            • To personalize your experience and to allow us to deliver the type of content and product offerings in which you are most interested.
                        </Text>
                        <Text variant="body" className="text-text-accent leading-6">
                            • To improve our app in order to better serve you.
                        </Text>
                    </View>

                    <View className="mb-6">
                        <Text variant="h3" className="mb-2">3. Data Security</Text>
                        <Text variant="body" className="text-text-accent leading-6">
                            We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information.
                        </Text>
                    </View>

                    <View className="mb-6">
                        <Text variant="h3" className="mb-2">4. Your Consent</Text>
                        <Text variant="body" className="text-text-accent leading-6">
                            By using our mobile app, you consent to our privacy policy.
                        </Text>
                    </View>

                    <View className="mt-4 pt-4 border-t border-border-light">
                        <Text variant="caption" className="text-center text-text-accent">
                            Contact: privacy@tredella.com
                        </Text>
                    </View>

                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
