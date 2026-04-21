    import { NavigationContainer } from "@react-navigation/native";
    import { useEffect, useState } from "react";
    import { onAuthStateChanged } from "firebase/auth";
    import { auth } from "../services/firebase";

    import AuthNavigator from "./AuthNavigator";
    import AppNavigator from "./AppNavigator";

    export default function RootNavigator() {
        const [user, setUser] = useState<any>(null);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                setUser(currentUser);
                setLoading(false);
            });

            return unsubscribe;
        }, []);

        if (loading) return null; // or splash screen

        return (
            <NavigationContainer>
                {user ? <AppNavigator /> : <AuthNavigator />}
            </NavigationContainer>
        );
    }
