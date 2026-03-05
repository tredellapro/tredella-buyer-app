import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, Link } from "expo-router";
import { loginSchema, LoginFormData } from "@/utils/validation";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/api/authService";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import Toast from "react-native-toast-message";

export default function LoginScreen() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        try {
            const response = await authService.login(data);
            if (response.data) {
                setAuth(response.data.user, response.data.token);
                Toast.show({
                    type: "success",
                    text1: "Login Successful",
                    text2: `Welcome back, ${response.data.user.name}!`,
                });
                router.replace("/(tabs)");
            }
        } catch (error: any) {
            // Error is already handled by interceptor but we stop loading
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background-white">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-6">
                <View className="mb-10 mt-10">
                    <Text variant="h1" className="mb-2">Welcome Back</Text>
                    <Text variant="body" className="text-text-accent">
                        Login to your Tredella account to continue
                    </Text>
                </View>

                <View className="mb-8">
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
                                required
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label="Password"
                                placeholder="enter your password"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                error={errors.password?.message}
                                secureTextEntry
                                editable={!isLoading}
                                required
                            />
                        )}
                    />

                    <TouchableOpacity
                        onPress={() => router.push("/(auth)/forgot-password")}
                        className="self-end"
                    >
                        <Text variant="caption" className="text-text-primary font-medium">
                            Forgot Password?
                        </Text>
                    </TouchableOpacity>
                </View>

                <Button
                    label="Login"
                    onPress={handleSubmit(onSubmit)}
                    loading={isLoading}
                    className="mb-6"
                />

                <View className="flex-row justify-center items-center">
                    <Text variant="body" className="text-text-accent">
                        Don't have an account?{" "}
                    </Text>
                    <Link href="/(auth)/register" asChild>
                        <TouchableOpacity>
                            <Text variant="body" className="text-text-primary font-bold">
                                Sign Up
                            </Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
