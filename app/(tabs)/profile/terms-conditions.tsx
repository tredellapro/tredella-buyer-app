import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/Text";
import { Ionicons } from "@expo/vector-icons";

export default function TermsConditionsScreen() {
    return (
        <SafeAreaView className="flex-1 bg-background-light" edges={["bottom"]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>

                <View className="items-center mb-6">
                    <Ionicons name="document-text-outline" size={48} color="#e94560" className="mb-3" />
                    <Text variant="h1" className="text-center mb-1">Terms & Conditions</Text>
                    <Text variant="caption" className="text-text-accent text-center">
                        Last updated: March 6, 2026
                    </Text>
                </View>

                <View className="bg-background-white p-5 rounded-xl border border-border-light">

                    <Text variant="body" className="text-text-accent mb-6">
                        Welcome to Tredella. Please read these terms and conditions carefully before using our mobile application and services.
                    </Text>

                    <View className="mb-6">
                        <Text variant="h3" className="mb-2">1. Acceptance of Terms</Text>
                        <Text variant="body" className="text-text-accent leading-6">
                            By accessing and using this application, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                        </Text>
                    </View>

                    <View className="mb-6">
                        <Text variant="h3" className="mb-2">2. User Accounts</Text>
                        <Text variant="body" className="text-text-accent leading-6 mb-2">
                            • You are responsible for maintaining the confidentiality of your account and password.
                        </Text>
                        <Text variant="body" className="text-text-accent leading-6 mb-2">
                            • You agree to accept responsibility for all activities that occur under your account.
                        </Text>
                        <Text variant="body" className="text-text-accent leading-6">
                            • We reserve the right to refuse service, terminate accounts, remove or edit content, or cancel orders in its sole discretion.
                        </Text>
                    </View>

                    <View className="mb-6">
                        <Text variant="h3" className="mb-2">3. Product Descriptions</Text>
                        <Text variant="body" className="text-text-accent leading-6">
                            Tredella attempts to be as accurate as possible. However, Tredella does not warrant that product descriptions or other content of any Tredella Service is accurate, complete, reliable, current, or error-free.
                        </Text>
                    </View>

                    <View className="mb-6">
                        <Text variant="h3" className="mb-2">4. Pricing</Text>
                        <Text variant="body" className="text-text-accent leading-6">
                            Except where noted otherwise, the List Price displayed for products on any Tredella Service represents the full retail price listed on the product itself. All prices are inclusive of legally applicable VAT.
                        </Text>
                    </View>

                    <View className="mt-4 pt-4 border-t border-border-light">
                        <Text variant="caption" className="text-center text-text-accent">
                            End of Terms & Conditions
                        </Text>
                    </View>

                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
