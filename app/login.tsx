import {
  ServiceError,
  ServiceErrorCode,
  UserAuthenticationPolicy,
} from "@calljmp/react-native";
import { useRouter } from "expo-router";
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
  const [email, setEmail] = useState("jonny@test.com");
  const [password, setPassword] = useState("Hj#137163$");
  const [isSigning, setIsSigning] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsSigning(true);
    setError("");

    try {
      const { data: user, error } = await calljmp.users.auth.email.authenticate(
        {
          email,
          password,
          tags: ["role:user"],
          policy: UserAuthenticationPolicy.SignInExistingOnly,
        }
      );

      if (error) {
        throw error;
      }

      router.replace("/board");
    } catch (err) {
      if (err instanceof ServiceError) {
        if (err.code === ServiceErrorCode.UserNotFound) {
          setError("User not found. Please register first.");
        } else {
          setError(err.message);
        }
      } else {
        setError("Failed to sign in. Please try again.");
      }
    } finally {
      setIsSigning(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsRegistering(true);
    setError("");

    try {
      const { data: user, error } = await calljmp.users.auth.email.authenticate(
        {
          email,
          password,
          tags: ["role:user"],
          policy: UserAuthenticationPolicy.CreateNewOnly,
        }
      );

      if (error) {
        throw error;
      }

      router.replace("/board");
    } catch (err) {
      if (err instanceof ServiceError) {
        if (err.code === ServiceErrorCode.UserAlreadyExists) {
          setError("User already exists. Please log in.");
        } else {
          setError(err.message);
        }
      } else {
        setError("Failed to register. Please try again.");
      }
    } finally {
      setIsRegistering(false);
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
                editable={!isSigning}
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
                editable={!isSigning}
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
                opacity: isSigning ? 0.6 : 1,
              }}
              onPress={handleSignIn}
              disabled={isSigning || isRegistering}
            >
              <Text
                style={{ color: "#ffffff", fontSize: 16, fontWeight: "500" }}
              >
                {isSigning ? "Signing In..." : "Sign In"}
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
                opacity: isSigning ? 0.6 : 1,
              }}
              onPress={handleRegister}
              disabled={isSigning || isRegistering}
            >
              <Text
                style={{ color: "#ffffff", fontSize: 16, fontWeight: "500" }}
              >
                {isRegistering ? "Creating Account..." : "Create Account"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
