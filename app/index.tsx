import { Redirect } from "expo-router";

export default function Index() {
    // In a real app, you might check auth state here
    // For now, we redirect to (tabs) which is the main entry
    return <Redirect href="/auth/login" />;
}
