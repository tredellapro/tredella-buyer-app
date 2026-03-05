import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { useAuthStore } from "@/store/authStore";

const schema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
});

type FormData = z.infer<typeof schema>;

export default function PersonalInformationScreen() {
    const { user, setAuth, token, refreshToken } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);

    const { control, handleSubmit, formState: { errors, isDirty } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            firstName: user?.firstName ?? "",
            lastName: user?.lastName ?? "",
            email: user?.email ?? "",
        },
    });

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        try {
            // TODO: call PATCH /auth/profile when endpoint is available
            if (user && token && refreshToken) {
                setAuth({ ...user, firstName: data.firstName, lastName: data.lastName, email: data.email }, token, refreshToken);
            }
            Toast.show({ type: "success", text1: "Profile updated!", text2: "Your information has been saved." });
        } catch (error: any) {
            Toast.show({ type: "error", text1: "Update failed", text2: error.message ?? "Please try again." });
        } finally {
            setIsLoading(false);
        }
    };

    const initials = user
        ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
        : "?";

    return (
        <SafeAreaView className="flex-1 bg-background-light" edges={["bottom"]}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Avatar section */}
                <View className="items-center py-8 bg-background-white border-b border-border-light">
                    <View className="relative">
                        <View className="w-24 h-24 rounded-full bg-background-primary items-center justify-center">
                            <Text className="text-text-white text-3xl font-bold">{initials}</Text>
                        </View>
                        <TouchableOpacity
                            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-secondary items-center justify-center border-2 border-white"
                            activeOpacity={0.8}
                        >
                            <Ionicons name="camera-outline" size={14} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <Text variant="caption" className="mt-3 text-text-accent">
                        Tap camera to change photo
                    </Text>
                </View>

                {/* Form */}
                <View className="px-5 py-6">
                    <Text variant="caption" className="uppercase font-bold text-text-accent mb-4 tracking-widest">
                        Basic Information
                    </Text>

                    {/* Row: First + Last name */}
                    <View className="flex-row gap-3">
                        <View className="flex-1">
                            <Controller
                                control={control}
                                name="firstName"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input
                                        label="First Name"
                                        placeholder="John"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        error={errors.firstName?.message}
                                        editable={!isLoading}
                                        required
                                    />
                                )}
                            />
                        </View>
                        <View className="flex-1">
                            <Controller
                                control={control}
                                name="lastName"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input
                                        label="Last Name"
                                        placeholder="Doe"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        error={errors.lastName?.message}
                                        editable={!isLoading}
                                        required
                                    />
                                )}
                            />
                        </View>
                    </View>

                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label="Email Address"
                                placeholder="john@example.com"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                error={errors.email?.message}
                                editable={false}
                                selectTextOnFocus={false}
                                inputClassName="bg-gray-100 text-gray-500"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                required
                            />
                        )}
                    />



                    <Button
                        label={isLoading ? "Saving..." : "Save Changes"}
                        onPress={handleSubmit(onSubmit)}
                        disabled={isLoading || !isDirty}
                        className="mt-2"
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
