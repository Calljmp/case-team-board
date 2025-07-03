import React, { useEffect, useRef } from "react";
import { Animated, Text } from "react-native";
import { ReactionEvent } from "../data/mockData";

interface AnimatedReactionProps {
  reaction: ReactionEvent;
  onAnimationComplete: (reaction: ReactionEvent) => void;
}

/**
 * Animated reaction bubble that pulses and auto-removes after 3 seconds
 * Used for showing real-time reactions like hearts and thumbs up
 */
export default function AnimatedReaction({
  reaction,
  onAnimationComplete,
}: AnimatedReactionProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();

    timeoutRef.current = setTimeout(() => {
      pulseAnimation.stop();
      onAnimationComplete(reaction);
    }, 3000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      pulseAnimation.stop();
    };
  }, []);

  const formatReactionText = (reaction: ReactionEvent) => {
    const emoji = reaction.reaction === "heart" ? "❤️" : "👍";
    return `${emoji} ${reaction.userName}`;
  };

  return (
    <Animated.View
      style={{
        alignSelf: "flex-end",
        backgroundColor: "#0b77e6",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        marginBottom: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        borderWidth: 1,
        borderColor: "#3b82f6",
        transform: [{ scale: pulseAnim }],
      }}
    >
      <Text
        style={{
          color: "#ffffff",
          fontSize: 12,
          fontWeight: "500",
        }}
      >
        {formatReactionText(reaction)}
      </Text>
    </Animated.View>
  );
}