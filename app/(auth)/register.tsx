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
import AuthLayoutWrapper from "@/components/layout/AuthLayoutWrapper";

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
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        try {
            const response = await authService.register(data);
            if (response.success) {
                setAuth(response.data.user, response.data.accessToken, response.data.refreshToken);
                Toast.show({
                    type: "success",
                    text1: "Account Created",
                    text2: `Welcome to Tredella, ${response.data.user.firstName}!`,
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

        <AuthLayoutWrapper title="Create Account" description="Start by entering your email address">



            <View className="mb-8">
                <View className="flex-row gap-4 ">
                    <View className="flex-1">
                        <Controller
                            control={control}
                            name="firstName"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    label="First Name"
                                    placeholder="Jane"
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
                                    placeholder="Buyer"
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

        </AuthLayoutWrapper>
    );
}
