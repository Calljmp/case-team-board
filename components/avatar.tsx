import calljmp from "@/common/calljmp";
import { useAccount } from "@/providers/account";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Camera, Upload } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  AlertButton,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface AvatarPickerProps {
  size?: number;
  editable?: boolean;
}

export default function Avatar({ size = 80, editable }: AvatarPickerProps) {
  const { user, setUser } = useAccount();
  const [uploading, setUploading] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "We need access to your photo library to upload an avatar."
      );
      return false;
    }
    return true;
  };

  const requestCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "We need access to your camera to take a photo."
      );
      return false;
    }
    return true;
  };

  const uploadImage = async (image: {
    uri: string;
    fileName?: string | null;
    mimeType?: string | null;
  }) => {
    if (!user) {
      Alert.alert("Error", "User not found. Please log in again.");
      return;
    }

    try {
      setUploading(true);

      const name = `avatar-${Date.now()}.jpg`;
      const type = image.mimeType || "image/jpeg";

      const { data: file, error: fileError } = await calljmp.storage.upload({
        content: {
          uri: image.uri,
          name: image.fileName || name,
          type,
        },
        bucket: "bucket",
        key: `${user.id}/${name}`,
        description: "User avatar",
        type,
      });

      if (fileError) {
        throw fileError;
      }

      const { data: signed, error: signError } =
        await calljmp.storage.signPublicUrl({
          bucket: "bucket",
          key: file.key,
          cacheTtl: 28 * 24 * 60 * 60, // 28 days
        });

      if (signError) {
        throw signError;
      }

      const { data: newUser, error: updateError } = await calljmp.users.update({
        avatar: signed.url,
      });

      if (updateError) {
        throw updateError;
      }

      setUser(newUser);
    } catch (error) {
      console.error("Avatar upload error:", error);
      Alert.alert("Error", "Failed to upload avatar. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const pickImageFromLibrary = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: false,
    });

    if (!result.canceled && result.assets[0]) {
      await uploadImage(result.assets[0]);
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: false,
    });

    if (!result.canceled && result.assets[0]) {
      await uploadImage(result.assets[0]);
    }
  };

  const showImageOptions = () => {
    Alert.alert("Change Avatar", "Choose how you want to update your avatar", [
      { text: "Take Photo", onPress: takePhoto },
      { text: "Choose from Library", onPress: pickImageFromLibrary },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const removeAvatar = async () => {
    if (!user?.avatar) {
      Alert.alert("No Avatar", "You don't have an avatar to remove.");
      return;
    }

    try {
      setUploading(true);

      const { data: info, error: urlError } =
        calljmp.storage.resolveSignedPublicUrl(user.avatar);
      if (urlError) {
        throw urlError;
      }

      await calljmp.storage.delete(info);

      const { data: newUser, error } = await calljmp.users.update({
        avatar: null,
      });
      if (error) {
        throw error;
      }

      setUser(newUser);
    } catch (error) {
      console.error("Avatar removal error:", error);
      Alert.alert("Error", "Failed to remove avatar. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const showAvatarActions = () => {
    const actions: AlertButton[] = [];

    if (user?.avatar) {
      actions.push({
        text: "Remove Avatar",
        style: "destructive",
        onPress: removeAvatar,
      });
    } else {
      actions.push(
        { text: "Take Photo", onPress: takePhoto },
        { text: "Choose from Library", onPress: pickImageFromLibrary }
      );
    }

    actions.push({ text: "Cancel", style: "cancel" });
    Alert.alert("Your Avatar", "Choose an action", actions);
  };

  const borderRadius = size / 2;

  const containerStyle = {
    width: size,
    height: size,
    borderRadius,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    backgroundColor: user?.avatar ? "transparent" : "#007AFF",
    position: "relative" as const,
  };

  const content = (
    <>
      {uploading ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : user?.avatar ? (
        <Image
          source={{ uri: user.avatar }}
          style={{
            width: size,
            height: size,
            borderRadius,
          }}
          contentFit="cover"
        />
      ) : (
        <Text
          style={{
            fontSize: size * 0.3,
            fontWeight: "bold",
            color: "#ffffff",
          }}
        >
          {getInitials(user?.name || "User")}
        </Text>
      )}

      {editable && !uploading && (
        <View
          style={{
            position: "absolute",
            bottom: -2,
            right: -2,
            backgroundColor: "#007AFF",
            borderRadius: 12,
            width: 24,
            height: 24,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 2,
            borderColor: "#ffffff",
          }}
        >
          {user?.avatar ? (
            <Upload stroke="#ffffff" size={12} />
          ) : (
            <Camera stroke="#ffffff" size={12} />
          )}
        </View>
      )}
    </>
  );

  return (
    <View style={{ alignItems: "center" }}>
      {editable ? (
        <TouchableOpacity
          onPress={showAvatarActions}
          disabled={uploading}
          style={containerStyle}
        >
          {content}
        </TouchableOpacity>
      ) : (
        <View style={containerStyle}>{content}</View>
      )}
    </View>
  );
}
