import React, { useState } from "react";
import { View, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useLocalSearchParams } from "expo-router";
import { resetPasswordSchema, ResetPasswordFormData } from "@/utils/validation";
import { authService } from "@/api/authService";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import Toast from "react-native-toast-message";
import { ApiResponse } from "@/types/api";
import AuthLayoutWrapper from "@/components/layout/AuthLayoutWrapper";

export default function ResetPasswordScreen() {
    const router = useRouter();
    const { resetToken } = useLocalSearchParams<{ resetToken: string }>();
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
            const result = await authService.resetPassword({
                newPassword: data.password,
                resetToken: resetToken!,
            });
            if (result.success) {
                Toast.show({
                    type: "success",
                    text1: "Password Reset",
                    text2: result.data?.message || "You can now login with your new password",
                });
                router.replace("/(auth)/login");
            }
        } catch (error: any) {
            // Handled by interceptor
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayoutWrapper title="Reset Password" description="Create a new secure password for your account">

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
                className="mb-8"
            />
            <TouchableOpacity
                className=""
                onPress={() => router.replace("/(auth)/login")}
            >
                <Text variant="body" className="text-center">
                    Remember your password? <Text className="text-background-primary font-bold">Login</Text>
                </Text>
            </TouchableOpacity>
        </AuthLayoutWrapper>
    );
}
