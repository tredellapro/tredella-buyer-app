import React, { useState } from "react";
import { View, ScrollView, SafeAreaView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useLocalSearchParams } from "expo-router";
import { resetPasswordSchema, ResetPasswordFormData } from "@/utils/validation";
import { apiClient } from "@/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import Toast from "react-native-toast-message";

export default function ResetPasswordScreen() {
    const router = useRouter();
    const { token } = useLocalSearchParams<{ token: string }>();
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
        setIsLoading(true);
        try {
            await apiClient.post("/auth/reset-password", {
                ...data,
                token,
            });
            Toast.show({
                type: "success",
                text1: "Password Reset",
                text2: "You can now login with your new password",
            });
            router.replace("/(auth)/login");
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
                    <Text variant="h1" className="mb-2">Reset Password</Text>
                    <Text variant="body" className="text-text-accent">
                        Create a new secure password for your account
                    </Text>
                </View>

                <View className="mb-8">
                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label="New Password"
                                placeholder="enter new password"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                error={errors.password?.message}
                                secureTextEntry
                                editable={!isLoading}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="confirmPassword"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label="Confirm New Password"
                                placeholder="confirm new password"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                error={errors.confirmPassword?.message}
                                secureTextEntry
                                editable={!isLoading}
                            />
                        )}
                    />
                </View>

                <Button
                    label="Reset Password"
                    onPress={handleSubmit(onSubmit)}
                    loading={isLoading}
                    className="mb-6"
                />
            </View>
        </SafeAreaView>
    );
}
