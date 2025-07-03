import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, View } from "react-native";

export default function SplashScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthenticationStatus();
  }, []);

  const checkAuthenticationStatus = async () => {
    try {
      // Simulate app initialization
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Check if user is already authenticated
      const isAuthenticated = await checkUserSession();

      if (isAuthenticated) {
        router.replace("/board");
      } else {
        router.replace("/login");
      }
    } catch (error) {
      console.error("Initialization error:", error);
      router.replace("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const checkUserSession = async () => {
    try {
      // This would typically check for stored auth tokens or session
      // For demo purposes, we'll return false to show login screen
      return false;
    } catch (error) {
      console.error("Session check error:", error);
      return false;
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#0b77e6",
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "600",
              color: "#ffffff",
              marginBottom: 8,
            }}
          >
            Team Board
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#ffffff",
              textAlign: "center",
              paddingHorizontal: 40,
              fontWeight: "500",
            }}
          >
            Connect and collaborate with your team
          </Text>
        </View>

        <Text
          style={{
            color: "#ffffff",
            fontSize: 14,
            marginTop: 20,
            fontWeight: "500",
            opacity: 0.9,
          }}
        >
          Powered by Calljmp
        </Text>
      </View>
    </SafeAreaView>
  );
}
