import React, { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity } from "react-native";

export interface ReactionButtonProps {
  emoji: string;
  count: number;
  reacted: boolean;
  onPress: () => void;
}

export default function ReactionButton({
  emoji,
  count,
  reacted,
  onPress,
}: ReactionButtonProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const prevCountRef = useRef(count);

  useEffect(() => {
    if (count > prevCountRef.current) {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.5,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
    prevCountRef.current = count;
  }, [count, pulseAnim]);

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: reacted ? "#0b77e6" : "#f9fafb",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        minWidth: 60,
        borderWidth: 1,
        borderColor: reacted ? "#0b77e6" : "#f3f4f6",
      }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Animated.Text
        style={{
          fontSize: 16,
          marginRight: 6,
          transform: [{ scale: pulseAnim }],
        }}
      >
        {emoji}
      </Animated.Text>
      <Text
        style={{
          fontSize: 14,
          color: reacted ? "#ffffff" : "#6b7280",
          fontWeight: "500",
        }}
      >
        {count}
      </Text>
    </TouchableOpacity>
  );
}
