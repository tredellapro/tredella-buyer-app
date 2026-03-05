import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, Link } from "expo-router";
import { registerSchema, RegisterFormData } from "@/utils/validation";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/api/authService";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import Toast from "react-native-toast-message";

export default function RegisterScreen() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        try {
            const response = await authService.register(data);
            if (response.data) {
                setAuth(response.data.user, response.data.token);
                Toast.show({
                    type: "success",
                    text1: "Account Created",
                    text2: `Welcome to Tredella, ${data.name}!`,
                });
                router.replace("/(tabs)");
            }
        } catch (error: any) {
            // Error is handled by interceptor
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background-white">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-6">
                <View className="mb-10 mt-5">
                    <Text variant="h1" className="mb-2">Create Account</Text>
                    <Text variant="body" className="text-text-accent">
                        Join Tredella and start shopping today
                    </Text>
                </View>

                <View className="mb-8">
                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label="Full Name"
                                placeholder="Your full name"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                error={errors.name?.message}
                                editable={!isLoading}
                            />
                        )}
                    />

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

                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label="Password"
                                placeholder="create a password"
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
                                label="Confirm Password"
                                placeholder="confirm your password"
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
                    label="Create Account"
                    onPress={handleSubmit(onSubmit)}
                    loading={isLoading}
                    className="mb-6"
                />

                <View className="flex-row justify-center items-center">
                    <Text variant="body" className="text-text-accent">
                        Already have an account?{" "}
                    </Text>
                    <Link href="/(auth)/login" asChild>
                        <TouchableOpacity>
                            <Text variant="body" className="text-text-primary font-bold">
                                Login
                            </Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
