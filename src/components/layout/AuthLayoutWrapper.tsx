import React from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from '../ui/Text'
import { ScrollView } from 'react-native-gesture-handler'

const AuthLayoutWrapper = ({ children, title, description }: { children: React.ReactNode, title: string, description: string }) => {
    return (
        <SafeAreaView className="flex-1 bg-background-white ">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

                <View className="flex-1 justify-center p-6">

                    <View className="my-10 ">
                        <Text variant="h1" className="mb-2 text-center  ">{title}</Text>
                        <Text variant="body" className="text-text-accent text-center">
                            {description}
                        </Text>
                    </View>

                    {children}

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default AuthLayoutWrapper