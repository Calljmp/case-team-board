import React, { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import { TypingIndicator } from "../data/mockData";

interface TypingIndicatorProps {
  typingIndicators: TypingIndicator[];
}

/**
 * Shows "user is typing..." indicator with bouncing dots animation
 * Displays when users are actively typing messages
 */
export default function TypingIndicatorComponent({
  typingIndicators,
}: TypingIndicatorProps) {
  const typingFadeAnim = useRef(new Animated.Value(0)).current;
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;

  const activeTypers = typingIndicators.filter(
    (indicator) => indicator.isTyping
  );

  useEffect(() => {
    if (activeTypers.length > 0) {
      Animated.timing(typingFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const createBounceAnimation = (
        animValue: Animated.Value,
        delay: number
      ) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(animValue, {
              toValue: -6,
              duration: 400,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(animValue, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ])
        );

      const bounceAnimations = [
        createBounceAnimation(dot1Anim, 0),
        createBounceAnimation(dot2Anim, 150),
        createBounceAnimation(dot3Anim, 300),
      ];

      bounceAnimations.forEach((anim) => anim.start());

      return () => {
        bounceAnimations.forEach((anim) => anim.stop());
      };
    } else {
      Animated.timing(typingFadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [activeTypers.length]);

  const formatTypingText = (typers: TypingIndicator[]) => {
    if (typers.length === 0) return "";

    if (typers.length === 1) {
      return `${typers[0].userName} is typing...`;
    } else if (typers.length === 2) {
      return `${typers[0].userName} and ${typers[1].userName} are typing...`;
    } else {
      return `${typers[0].userName} and ${
        typers.length - 1
      } others are typing...`;
    }
  };

  if (activeTypers.length === 0) {
    return null;
  }

  return (
    <Animated.View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1f2937",
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
        marginBottom: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
        borderWidth: 1,
        borderColor: "#374151",
        opacity: typingFadeAnim,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginRight: 10,
        }}
      >
        <Animated.View
          style={{
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: "#28e2ad",
            marginHorizontal: 1,
            transform: [{ translateY: dot1Anim }],
          }}
        />
        <Animated.View
          style={{
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: "#28e2ad",
            marginHorizontal: 1,
            transform: [{ translateY: dot2Anim }],
          }}
        />
        <Animated.View
          style={{
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: "#28e2ad",
            marginHorizontal: 1,
            transform: [{ translateY: dot3Anim }],
          }}
        />
      </View>
      <Text
        style={{
          color: "#ffffff",
          fontSize: 13,
          fontStyle: "italic",
          fontWeight: "400",
        }}
      >
        {formatTypingText(activeTypers)}
      </Text>
    </Animated.View>
  );
}