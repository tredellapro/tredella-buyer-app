import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/Text";
import { Ionicons } from "@expo/vector-icons";

export default function HelpCenterScreen() {
    const FAQS = [
        {
            q: "How do I track my order?",
            a: "You can track your order in the Orders tab by tapping on the specific order. Tracking updates usually appear within 24 hours of shipment.",
        },
        {
            q: "What is your return policy?",
            a: "We accept returns within 30 days of delivery. Items must be unused and in original packaging. Go to Orders > Return Item to initiate.",
        },
        {
            q: "How can I change my shipping address?",
            a: "Go to Profile > Shipping Address to add, edit, or remove your saved delivery locations.",
        },
        {
            q: "Who do I contact for app issues?",
            a: "Please email our technical support team at support@tredella.com with a screenshot of the issue.",
        },
    ];

    return (
        <SafeAreaView className="flex-1 bg-background-light" edges={["bottom"]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, marginBottom: 40 }}>

                <View className="items-center mb-8">
                    <View className="w-16 h-16 bg-primary/10 rounded-full items-center justify-center mb-4">
                        <Ionicons name="headset-outline" size={32} color="#e94560" />
                    </View>
                    <Text variant="h1" className="text-center mb-2">How can we help?</Text>
                    <Text variant="body" className="text-text-accent text-center">
                        Browse our FAQs or contact support below.
                    </Text>
                </View>

                {/* Contact Card */}
                <View className="bg-background-white p-5 rounded-xl border border-border-light mb-8 shadow-sm">
                    <Text variant="h3" className="mb-4">Contact Support</Text>

                    <View className="flex-row items-center mb-4 border-b border-border-light pb-4">
                        <View className="w-10 h-10 bg-background-light rounded-full items-center justify-center mr-3">
                            <Ionicons name="mail-outline" size={20} color="#e94560" />
                        </View>
                        <View>
                            <Text variant="body" className="font-semibold text-text-dark">Email Us</Text>
                            <Text variant="body" className="text-text-accent">support@tredella.com</Text>
                        </View>
                    </View>

                    <View className="flex-row items-center">
                        <View className="w-10 h-10 bg-background-light rounded-full items-center justify-center mr-3">
                            <Ionicons name="call-outline" size={20} color="#e94560" />
                        </View>
                        <View>
                            <Text variant="body" className="font-semibold text-text-dark">Call Us</Text>
                            <Text variant="body" className="text-text-accent">1-800-TREDELLA</Text>
                        </View>
                    </View>
                </View>

                {/* FAQs */}
                <Text variant="h2" className="mb-4">Frequently Asked Questions</Text>
                <View className="bg-background-white rounded-xl border border-border-light overflow-hidden">
                    {FAQS.map((faq, index) => (
                        <View
                            key={index}
                            className={`p-5 ${index !== FAQS.length - 1 ? "border-b border-border-light" : ""}`}
                        >
                            <Text variant="body" className="font-semibold mb-2 text-text-dark">{faq.q}</Text>
                            <Text variant="body" className="text-text-accent leading-5">{faq.a}</Text>
                        </View>
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
