import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, Link } from "expo-router";
import Toast from "react-native-toast-message";

import { authService, RegisterRequest } from "@/api/authService";
import { locationService, Country, State, City } from "@/api/locationService";
import { useAuthStore } from "@/store/authStore";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { Select } from "@/components/ui/Select";
import AuthLayoutWrapper from "@/components/layout/AuthLayoutWrapper";
import {
    emailCheckSchema,
    personalInfoSchema,
    locationDetailsSchema,
    registrationPasswordSchema
} from "@/utils/validation";

type Step = 1 | 2 | 3 | 4;

export default function RegisterScreen() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState<Step>(1);

    // Location Data State
    const [countries, setCountries] = useState<Country[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [isLoadingLocations, setIsLoadingLocations] = useState(false);

    // Form Data Persisted across steps
    const [formData, setFormData] = useState<Partial<RegisterRequest>>({
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        country: "",
        state: "",
        city: "",
        postalCode: "",
        password: "",
    });

    // Load countries on mount
    useEffect(() => {
        const loadCountries = async () => {
            try {
                const response = await locationService.getCountries();
                if (response.success) {
                    setCountries(response.data);
                }
            } catch (error) {
                console.error("Failed to load countries", error);
            }
        };
        loadCountries();
    }, []);

    // Step 1 Form
    const emailForm = useForm({
        resolver: zodResolver(emailCheckSchema),
        defaultValues: { email: formData.email || "" }
    });

    // Step 2 Form
    const personalForm = useForm({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: {
            firstName: formData.firstName || "",
            lastName: formData.lastName || ""
        }
    });

    // Step 3 Form
    const locationForm = useForm({
        resolver: zodResolver(locationDetailsSchema),
        defaultValues: {
            addressLine1: formData.addressLine1 || "",
            addressLine2: formData.addressLine2 || "",
            country: formData.country || "",
            state: formData.state || "",
            city: formData.city || "",
            postalCode: formData.postalCode || "",
            phone: formData.phone || "",
        }
    });

    // Step 4 Form
    const passwordForm = useForm({
        resolver: zodResolver(registrationPasswordSchema),
        defaultValues: { password: "", confirmPassword: "" }
    });

    // Step 1 Submit
    const onStep1Submit = async (data: { email: string }) => {
        setIsLoading(true);
        try {
            const response = await authService.checkEmail(data.email);
            if (response.success && response.data.available) {
                setFormData(prev => ({ ...prev, email: data.email }));
                setCurrentStep(2);
            } else {
                Toast.show({
                    type: "error",
                    text1: "Email Unavailable",
                    text2: response.message || "Email is already registered",
                });
            }
        } catch (error: any) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: error.message || "An unexpected error occurred.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2 Submit
    const onStep2Submit = async (data: { firstName: string, lastName: string }) => {
        setFormData(prev => ({ ...prev, ...data }));
        setCurrentStep(3);
    };

    // Step 3 Submit
    const onStep3Submit = async (data: typeof locationDetailsSchema._output) => {
        setIsLoading(true);
        try {
            const response = await authService.checkPhone(data.phone);
            if (response.success && response.data.available) {
                setFormData(prev => ({ ...prev, ...data }));
                setCurrentStep(4);
            } else {
                Toast.show({
                    type: "error",
                    text1: "Phone Unavailable",
                    text2: response.message || "Phone number is already registered",
                });
            }
        } catch (error: any) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: error.message || "An unexpected error occurred.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Step 4 Submit (Final registration)
    const onStep4Submit = async (data: typeof registrationPasswordSchema._output) => {
        setIsLoading(true);
        try {
            const finalData: RegisterRequest = {
                ...formData,
                password: data.password,
            } as RegisterRequest; // Type assertion as formData is Partial<RegisterRequest>

            const response = await authService.register(finalData);
            if (response.success) {
                Toast.show({
                    type: "success",
                    text1: "Registration Successful",
                    text2: "Please verify your email to continue",
                });
                router.push({
                    pathname: "/(auth)/otp-verification",
                    params: { email: finalData.email, purpose: "email_verification" }
                });
            } else {
                Toast.show({
                    type: "error",
                    text1: "Registration Failed",
                    text2: response.message || "An error occurred during registration.",
                });
            }
        } catch (error: any) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: error.message || "An unexpected error occurred.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Location Change Handlers
    const handleCountryChange = async (countryCode: string) => {
        locationForm.setValue("country", countryCode);
        locationForm.setValue("state", "");
        locationForm.setValue("city", "");
        setStates([]);
        setCities([]);
        setIsLoadingLocations(true);
        try {
            const response = await locationService.getStates(countryCode);
            if (response.success) {
                setStates(response.data);
            }
        } catch (error) {
            console.error("Failed to load states", error);
            Toast.show({
                type: "error",
                text1: "Error loading states",
                text2: "Please try again.",
            });
        } finally {
            setIsLoadingLocations(false);
        }
    };

    const handleStateChange = async (stateCode: string) => {
        locationForm.setValue("state", stateCode);
        locationForm.setValue("city", "");
        const countryCode = locationForm.getValues("country");
        setCities([]);
        setIsLoadingLocations(true);
        try {
            const response = await locationService.getCities(countryCode, stateCode);
            if (response.success) {
                setCities(response.data);
            }
        } catch (error) {
            console.error("Failed to load cities", error);
            Toast.show({
                type: "error",
                text1: "Error loading cities",
                text2: "Please try again.",
            });
        } finally {
            setIsLoadingLocations(false);
        }
    };

    const renderStep1 = () => (
        <View className="mb-8">
            <Controller
                control={emailForm.control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        label="Email Address"
                        placeholder="name@example.com"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={emailForm.formState.errors.email?.message}
                        keyboardType="email-address"
                        editable={!isLoading}
                        autoFocus
                    />
                )}
            />
            <Button
                label="Continue"
                onPress={emailForm.handleSubmit(onStep1Submit)}
                loading={isLoading}
                className="mt-4"
            />
        </View>
    );

    const renderStep2 = () => (
        <View className="mb-8">
            <View className="flex-row gap-4 mb-4">
                <View className="flex-1">
                    <Controller
                        control={personalForm.control}
                        name="firstName"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label="First Name"
                                placeholder="Jane"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                error={personalForm.formState.errors.firstName?.message}
                                editable={!isLoading}
                                required
                            />
                        )}
                    />
                </View>
                <View className="flex-1">
                    <Controller
                        control={personalForm.control}
                        name="lastName"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label="Last Name"
                                placeholder="Buyer"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                error={personalForm.formState.errors.lastName?.message}
                                editable={!isLoading}
                                required
                            />
                        )}
                    />
                </View>
            </View>
            <Button
                label="Next"
                onPress={personalForm.handleSubmit(onStep2Submit)}
                className="mt-4"
            />
            <TouchableOpacity onPress={() => setCurrentStep(1)} className="items-center mt-4">
                <Text variant="caption" className="text-text-primary">Go Back</Text>
            </TouchableOpacity>
        </View>
    );

    const renderStep3 = () => (
        <ScrollView className="mb-8 max-h-[500px]" showsVerticalScrollIndicator={false}>
            <Controller
                control={locationForm.control}
                name="addressLine1"
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        label="Address Line 1"
                        placeholder="123 Street Name"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={locationForm.formState.errors.addressLine1?.message}
                        editable={!isLoading}
                        required
                    />
                )}
            />
            <Controller
                control={locationForm.control}
                name="addressLine2"
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        label="Address Line 2 (Optional)"
                        placeholder="Suite, Apt, etc."
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        editable={!isLoading}
                    />
                )}
            />

            <View className="mb-4">
                <Controller
                    control={locationForm.control}
                    name="country"
                    render={({ field: { value } }) => (
                        <Select
                            label="Country"
                            placeholder="Select Country"
                            options={countries.map(c => ({ label: `${c.flag} ${c.name}`, value: c.code }))}
                            value={value}
                            onValueChange={(val) => handleCountryChange(val as string)}
                            error={locationForm.formState.errors.country?.message}
                            disabled={isLoading}
                        />
                    )}
                />
            </View>

            <View className="flex-row gap-4 mb-4">
                <View className="flex-1">
                    <Controller
                        control={locationForm.control}
                        name="state"
                        render={({ field: { value } }) => (
                            <Select
                                label="State/Province"
                                placeholder="Select State"
                                options={states.map(s => ({ label: s.name, value: s.code }))}
                                value={value}
                                onValueChange={(val) => handleStateChange(val as string)}
                                error={locationForm.formState.errors.state?.message}
                                disabled={isLoading || states.length === 0 || isLoadingLocations}
                            />
                        )}
                    />
                </View>
                <View className="flex-1">
                    <Controller
                        control={locationForm.control}
                        name="city"
                        render={({ field: { value } }) => (
                            <Select
                                label="City"
                                placeholder="Select City"
                                options={cities.map(c => ({ label: c.name, value: c.name }))}
                                value={value}
                                onValueChange={(val) => locationForm.setValue("city", val as string)}
                                error={locationForm.formState.errors.city?.message}
                                disabled={isLoading || cities.length === 0 || isLoadingLocations}
                            />
                        )}
                    />
                </View>
            </View>

            <Controller
                control={locationForm.control}
                name="postalCode"
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        label="Postal Code"
                        placeholder="10001"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={locationForm.formState.errors.postalCode?.message}
                        editable={!isLoading}
                        required
                    />
                )}
            />

            <Controller
                control={locationForm.control}
                name="phone"
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        label="Phone Number"
                        placeholder="+1234567890"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={locationForm.formState.errors.phone?.message}
                        editable={!isLoading}
                        required
                        keyboardType="phone-pad"
                    />
                )}
            />

            <Button
                label="Next"
                onPress={locationForm.handleSubmit(onStep3Submit)}
                loading={isLoading}
                className="mt-4"
            />
            <TouchableOpacity onPress={() => setCurrentStep(2)} className="items-center mt-4">
                <Text variant="caption" className="text-text-primary">Go Back</Text>
            </TouchableOpacity>
        </ScrollView>
    );

    const renderStep4 = () => (
        <View className="mb-8">
            <Controller
                control={passwordForm.control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        label="Create Password"
                        placeholder="••••••••"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={passwordForm.formState.errors.password?.message}
                        secureTextEntry
                        editable={!isLoading}
                        required
                    />
                )}
            />
            <Controller
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        label="Confirm Password"
                        placeholder="••••••••"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={passwordForm.formState.errors.confirmPassword?.message}
                        secureTextEntry
                        editable={!isLoading}
                        required
                    />
                )}
            />
            <Button
                label="Complete Registration"
                onPress={passwordForm.handleSubmit(onStep4Submit)}
                loading={isLoading}
                className="mt-4"
            />
            <TouchableOpacity onPress={() => setCurrentStep(3)} className="items-center mt-4">
                <Text variant="caption" className="text-text-primary">Go Back</Text>
            </TouchableOpacity>
        </View>
    );

    const getLayoutConfig = () => {
        switch (currentStep) {
            case 1: return { title: "Create Account", desc: "Start by entering your email address" };
            case 2: return { title: "Personal Details", desc: "Tell us a bit about yourself" };
            case 3: return { title: "Location Details", desc: "Where should we deliver your packages?" };
            case 4: return { title: "Security", desc: "Last step! Secure your account" };
        }
    };

    const config = getLayoutConfig();

    return (
        <AuthLayoutWrapper title={config.title} description={config.desc}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}

            <View className="flex-row justify-center items-center mt-6">
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
