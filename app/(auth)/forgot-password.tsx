import React, { useState } from "react";
import { View, ScrollView, SafeAreaView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { forgotPasswordSchema, ForgotPasswordFormData } from "@/utils/validation";
import { apiClient } from "@/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import Toast from "react-native-toast-message";

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsLoading(true);
        try {
            await apiClient.post("/auth/forgot-password", data);
            Toast.show({
                type: "success",
                text1: "Email Sent",
                text2: "Please check your inbox for reset instructions",
            });
            router.push("/(auth)/login");
        } catch (error: any) {
            // Handled by interceptor
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background-white">
            <View className="p-6">
                <View className="mb-10 mt-10">
                    <Text variant="h1" className="mb-2">Forgot Password</Text>
                    <Text variant="body" className="text-text-accent">
                        Enter your email address and we'll send you a link to reset your password
                    </Text>
                </View>

                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            label="Email Address"
                            placeholder="name@example.com"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            error={errors.email?.message}
                            keyboardType="email-address"
                            editable={!isLoading}
                        />
                    )}
                />

                <Button
                    label="Send Reset Link"
                    onPress={handleSubmit(onSubmit)}
                    loading={isLoading}
                    className="mt-4 mb-6"
                />

                <Button
                    label="Back to Login"
                    variant="ghost"
                    onPress={() => router.back()}
                />
            </View>
        </SafeAreaView>
    );
}
