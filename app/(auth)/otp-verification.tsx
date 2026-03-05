import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Text } from "@/components/ui/Text";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { authService } from "@/api/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import AuthLayoutWrapper from "@/components/layout/AuthLayoutWrapper";

export default function OTPVerificationScreen() {
    const router = useRouter();
    const { email, purpose = "password_reset" } = useLocalSearchParams<{ email: string; purpose: string }>();
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isResending, setIsResending] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    const TIMER_STORAGE_KEY = `otp_timer_expiry_${email}`;

    // Initialize timer from storage on mount
    useEffect(() => {
        const initTimer = async () => {
            try {
                const storedExpiry = await AsyncStorage.getItem(TIMER_STORAGE_KEY);
                if (storedExpiry) {
                    const expiry = parseInt(storedExpiry, 10);
                    const now = Date.now();
                    const remaining = Math.max(0, Math.floor((expiry - now) / 1000));

                    if (remaining > 0) {
                        setTimer(remaining);
                    } else {
                        // If expired, let's start a fresh one if it's the first visit
                        // Or if it was just triggered
                        await startNewTimer();
                    }
                } else {
                    // No stored timer, start a fresh one (assume OTP was just sent)
                    await startNewTimer();
                }
            } catch (error) {
                console.error("Error loading timer:", error);
                setTimer(60);
            } finally {
                setIsInitialized(true);
            }
        };

        if (email) {
            initTimer();
        }
    }, [email]);

    const startNewTimer = async () => {
        const expiry = Date.now() + 60 * 1000;
        await AsyncStorage.setItem(TIMER_STORAGE_KEY, expiry.toString());
        setTimer(60);
    };

    useEffect(() => {
        let interval: any;
        if (isInitialized && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        AsyncStorage.removeItem(TIMER_STORAGE_KEY);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer, isInitialized]);

    const handleVerify = async () => {
        if (otp.length !== 6) {
            Toast.show({
                type: "error",
                text1: "Invalid OTP",
                text2: "Please enter a 6-digit code",
            });
            return;
        }

        setIsLoading(true);
        try {
            let response;
            if (purpose === "email_verification") {
                response = await authService.verifyEmailOtp({
                    email: email!,
                    otp,
                    purpose: "email_verification",
                });
            } else {
                response = await authService.verifyOtp({
                    email: email!,
                    otp,
                    purpose: "password_reset",
                });
            }

            if (response.success) {
                await AsyncStorage.removeItem(TIMER_STORAGE_KEY);
                Toast.show({
                    type: "success",
                    text1: "Verification Successful",
                    text2: (response.data as any)?.message || "Your email has been verified",
                });

                if (purpose === "email_verification") {
                    router.replace("/(tabs)");
                } else {
                    router.push({
                        pathname: "/(auth)/reset-password",
                        params: { resetToken: (response.data as any).resetToken }
                    });
                }
            }
        } catch (error: any) {
            // Handled by interceptor
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;

        setIsResending(true);
        try {
            const response = await authService.resendOtp({
                email: email!,
                purpose: purpose!,
            });

            if (response.success) {
                await startNewTimer();
                Toast.show({
                    type: "success",
                    text1: "OTP Resent",
                    text2: response.data?.message || "Please check your inbox",
                });
            }
        } catch (error: any) {
            // Handled by interceptor
        } finally {
            setIsResending(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (

        <AuthLayoutWrapper title="Verify OTP" description={`Enter the 6-digit code we sent to ${email}`}>



            <View className="">
                <Input
                    label="OTP Code"
                    placeholder="000000"
                    keyboardType="number-pad"
                    maxLength={6}
                    value={otp}
                    onChangeText={setOtp}
                    editable={!isLoading}
                    required
                />
            </View>

            <Button
                label="Verify OTP"
                onPress={handleVerify}
                loading={isLoading}
                className="mb-4"
            />

            <View className="items-center mt-8">
                <Text variant="caption" className="text-text-secondary mb-3">
                    Please wait before requesting a new code:
                </Text>
                <TouchableOpacity
                    onPress={handleResend}
                    disabled={timer > 0 || isResending}
                    className={`w-full h-12 rounded-lg items-center justify-center ${timer > 0 ? "bg-slate-100" : "bg-background-primary"
                        }`}
                >
                    <Text
                        className={`font-semibold ${timer > 0 ? "text-text-secondary" : "text-text-white"
                            }`}
                    >
                        {timer > 0 ? `Resend in ${formatTime(timer)}` : "Resend OTP"}
                    </Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                className="mt-10"
                onPress={() => router.replace("/(auth)/login")}
            >
                <Text variant="body" className="text-center">
                    Remember your password? <Text className="text-background-primary font-bold">Login</Text>
                </Text>
            </TouchableOpacity>

            <Button
                label="Back"
                variant="ghost"
                onPress={() => router.canGoBack() ? router.back() : router.replace("/(auth)/login")}
                disabled={isLoading} />

        </AuthLayoutWrapper>

    );
}
