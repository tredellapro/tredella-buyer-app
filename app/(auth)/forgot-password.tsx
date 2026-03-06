import { authService } from "@/api/authService";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ForgotPasswordFormData, forgotPasswordSchema } from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Toast from "react-native-toast-message";

import AuthLayoutWrapper from "@/components/layout/AuthLayoutWrapper";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
            const result = await authService.forgotPassword({ ...data, role: "BUYER" });
            if (result.success) {
                // Clear any existing timer for this email to ensure a fresh 60s
                await AsyncStorage.removeItem(`otp_timer_expiry_${data.email}`);
                Toast.show({
                    type: "success",
                    text1: "OTP Sent",
                    text2: result.data?.message || "Please check your inbox for the verification code",
                });
                router.push({
                    pathname: "/(auth)/otp-verification",
                    params: { email: data.email }
                });
            } else {
                Toast.show({
                    type: "error",
                    text1: "Request Failed",
                    text2: result.message || "Could not process request",
                });
            }
        } catch (error: any) {
            // Handled by interceptor
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayoutWrapper title="Forgot Password" description="Enter your email address and we'll send you a otp to reset your password">

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
                onPress={() => router.canGoBack() ? router.back() : router.replace("/(auth)/login")}
            />


        </AuthLayoutWrapper>
    );
}
