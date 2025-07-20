import calljmp from "@/common/calljmp";
import { useAccount } from "@/providers/account";
import { router } from "expo-router";
import { SquarePen } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { user, setUser } = useAccount();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || "");

  const handleSaveName = async () => {
    if (editedName.trim() && editedName !== user?.name) {
      try {
        await calljmp.users.update({ name: editedName.trim() });
        if (user) {
          setUser({ ...user, name: editedName.trim() });
        }
        setIsEditing(false);
      } catch (error) {
        Alert.alert("Error", "Failed to update name. Please try again.");
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await calljmp.users.auth.clear();
            setUser(null);
          } catch (error) {
            Alert.alert("Error", "Failed to sign out. Please try again.");
          }
        },
      },
    ]);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatJoinDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!user) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 16, color: "#dc3545", textAlign: "center" }}>
            Unable to load profile
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 24,
            paddingHorizontal: 4,
          }}
        >
          <TouchableOpacity
            style={{ marginRight: 16 }}
            onPress={() => router.back()}
          >
            <Text style={{ fontSize: 16, color: "#007AFF", fontWeight: "500" }}>
              Back
            </Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 22, fontWeight: "600", color: "#1f2937" }}>
            Profile
          </Text>
        </View>

        <View
          style={{
            backgroundColor: "#ffffff",
            borderRadius: 16,
            padding: 24,
            marginBottom: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <View style={{ alignItems: "center", marginBottom: 24 }}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "#007AFF",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{ fontSize: 24, fontWeight: "bold", color: "#ffffff" }}
              >
                {getInitials(user.name || "User")}
              </Text>
            </View>
          </View>

          <View style={{ gap: 20 }}>
            <View style={{ gap: 6 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: "#6c757d",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Name
              </Text>
              {isEditing ? (
                <View style={{ gap: 12 }}>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: "#dee2e6",
                      borderRadius: 8,
                      padding: 12,
                      fontSize: 16,
                      backgroundColor: "#ffffff",
                    }}
                    value={editedName}
                    onChangeText={setEditedName}
                    placeholder="Enter your name"
                    autoFocus
                  />
                  <View style={{ flexDirection: "row", gap: 12 }}>
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        paddingVertical: 10,
                        paddingHorizontal: 16,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: "#6c757d",
                        alignItems: "center",
                      }}
                      onPress={() => {
                        setEditedName(user.name || "");
                        setIsEditing(false);
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "500",
                          color: "#6c757d",
                        }}
                      >
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        paddingVertical: 10,
                        paddingHorizontal: 16,
                        borderRadius: 8,
                        backgroundColor: "#007AFF",
                        alignItems: "center",
                      }}
                      onPress={handleSaveName}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "500",
                          color: "#ffffff",
                        }}
                      >
                        Save
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#1a1a1a",
                      fontWeight: "500",
                    }}
                  >
                    {user.name || "No name set"}
                  </Text>
                  <TouchableOpacity
                    style={{ padding: 4 }}
                    onPress={() => setIsEditing(true)}
                  >
                    <SquarePen stroke="#007AFF" size={20} />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={{ gap: 6 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: "#6c757d",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Email
              </Text>
              <Text
                style={{ fontSize: 16, color: "#1a1a1a", fontWeight: "500" }}
              >
                {user.email}
              </Text>
            </View>

            <View style={{ gap: 6 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: "#6c757d",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Member Since
              </Text>
              <Text
                style={{ fontSize: 16, color: "#1a1a1a", fontWeight: "500" }}
              >
                {user.createdAt ? formatJoinDate(user.createdAt) : "Unknown"}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 8 }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#dc3545",
              paddingVertical: 14,
              paddingHorizontal: 24,
              borderRadius: 12,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
            onPress={handleSignOut}
          >
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#ffffff" }}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
