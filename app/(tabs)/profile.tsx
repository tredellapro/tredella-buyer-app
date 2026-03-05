import React from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
    const { user, logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.replace("/(auth)/login");
    };

    const MenuItem = ({ icon, title, subtitle, onPress, color = "#4b5563" }: any) => (
        <TouchableOpacity
            className="flex-row items-center p-4 bg-background-white border-b border-border-light"
            onPress={onPress}
        >
            <View className="w-10 h-10 rounded-full bg-background-light items-center justify-center mr-4">
                <Ionicons name={icon} size={20} color={color} />
            </View>
            <View className="flex-1">
                <Text variant="body" className="font-semibold">{title}</Text>
                {subtitle && <Text variant="caption" className="text-text-accent">{subtitle}</Text>}
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-background-light">
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header/User Info */}
                <View className="bg-background-white p-6 items-center border-b border-border-light">
                    <View className="w-24 h-24 rounded-full bg-background-primary items-center justify-center mb-4">
                        <Text className="text-text-white text-3xl font-bold">
                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </Text>
                    </View>
                    <Text variant="h2" className="mb-1">{user?.firstName} {user?.lastName}</Text>
                    <Text variant="body" className="text-text-accent">{user?.email}</Text>
                </View>

                {/* Account Settings */}
                <View className="mt-6">
                    <Text variant="caption" className="px-6 mb-2 uppercase font-bold text-text-accent">Account Settings</Text>
                    <MenuItem icon="person-outline" title="Personal Information" subtitle="Update your profile details" />
                    <MenuItem icon="location-outline" title="Shipping Address" subtitle="Manage your delivery locations" />
                    <MenuItem icon="card-outline" title="Payment Methods" subtitle="Add or remove saved cards" />
                </View>

                {/* Support */}
                <View className="mt-6">
                    <Text variant="caption" className="px-6 mb-2 uppercase font-bold text-text-accent">Support</Text>
                    <MenuItem icon="help-circle-outline" title="Help Center" subtitle="FAQs and customer support" />
                    <MenuItem icon="document-text-outline" title="Terms & Conditions" />
                    <MenuItem icon="shield-checkmark-outline" title="Privacy Policy" />
                </View>

                {/* Logout Button */}
                <View className="p-6 mt-4 mb-10">
                    <Button
                        label="Logout"
                        variant="outline"
                        className="border-red-500"
                        textClassName="text-red-500"
                        onPress={handleLogout}
                    />
                    <Text variant="caption" className="text-center mt-4 text-text-accent">Version 1.0.0</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
