import { useAccount } from "@/providers/account";
import { Redirect, Stack } from "expo-router";
import React from "react";
import { SafeAreaView, Text, View } from "react-native";

export default function RootLayout() {
  const { user, loading } = useAccount();

  if (loading) {
    return <SplashScreen />;
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

function SplashScreen() {
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
