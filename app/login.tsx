import { UserAuthenticationPolicy } from "@calljmp/react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import calljmp from "../common/calljmp";

/**
 * Authentication screen using Calljmp email/password authentication
 * Supports both sign-in and registration with the same form
 */
export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await calljmp.users.auth.email.authenticate({
        email,
        password,
        tags: ["role:user"],
        policy: UserAuthenticationPolicy.SignInExistingOnly,
      });

      console.log("Sign in successful:", result);
    } catch (err) {
      setError("Invalid email or password");
      console.error("Sign in error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await calljmp.users.auth.email.authenticate({
        email,
        password,
        tags: ["role:user"],
        policy: UserAuthenticationPolicy.CreateNewOnly,
      });

      console.log("Registration successful:", result);
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 24,
          }}
        >
          <View style={{ alignItems: "center", marginBottom: 48 }}>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "600",
                color: "#0b77e6",
                marginBottom: 8,
              }}
            >
              Team Board
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#6b7280",
                textAlign: "center",
                lineHeight: 24,
              }}
            >
              Connect and collaborate with your team
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 16,
              padding: 24,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: 8,
                }}
              >
                Email
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  fontSize: 16,
                  backgroundColor: "#ffffff",
                  color: "#1f2937",
                }}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!isLoading}
              />
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: "#374151",
                  marginBottom: 8,
                }}
              >
                Password
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  fontSize: 16,
                  backgroundColor: "#ffffff",
                  color: "#1f2937",
                }}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isLoading}
              />
            </View>

            {error ? (
              <Text
                style={{
                  color: "#ea4335",
                  fontSize: 14,
                  marginBottom: 16,
                  textAlign: "center",
                }}
              >
                {error}
              </Text>
            ) : null}

            <TouchableOpacity
              style={{
                borderRadius: 12,
                paddingVertical: 14,
                paddingHorizontal: 24,
                marginBottom: 12,
                alignItems: "center",
                backgroundColor: "#0b77e6",
                opacity: isLoading ? 0.6 : 1,
              }}
              onPress={handleSignIn}
              disabled={isLoading}
            >
              <Text
                style={{ color: "#ffffff", fontSize: 16, fontWeight: "500" }}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                borderRadius: 12,
                paddingVertical: 14,
                paddingHorizontal: 24,
                marginBottom: 12,
                alignItems: "center",
                backgroundColor: "#28e2ad",
                borderWidth: 1,
                borderColor: "#28e2ad",
                opacity: isLoading ? 0.6 : 1,
              }}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text
                style={{ color: "#ffffff", fontSize: 16, fontWeight: "500" }}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
