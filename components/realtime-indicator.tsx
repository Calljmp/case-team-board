import React, { useCallback, useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { ReactionEvent, TypingIndicator } from "../data/mockData";
import AnimatedReaction from "./animated-reaction";
import TypingIndicatorComponent from "./typing-indicator";

interface RealtimeIndicatorProps {
  typingIndicators: TypingIndicator[];
  recentReactions: ReactionEvent[];
}

/**
 * Container for real-time UI elements (typing indicators and reaction bubbles)
 * Manages state for displaying and animating ephemeral user interactions
 */
export default function RealtimeIndicator({
  typingIndicators,
  recentReactions,
}: RealtimeIndicatorProps) {
  const [displayedReactions, setDisplayedReactions] = useState<ReactionEvent[]>(
    []
  );

  // Handle new reactions
  useEffect(() => {
    if (recentReactions.length > displayedReactions.length) {
      const newReactions = recentReactions.slice(displayedReactions.length);
      setDisplayedReactions((prev) => [...prev, ...newReactions]);
    }
  }, [recentReactions, displayedReactions.length]);

  const handleReactionAnimationComplete = useCallback(
    (completedReaction: ReactionEvent) => {
      setDisplayedReactions((prev) =>
        prev.filter(
          (reaction) =>
            !(
              reaction.postId === completedReaction.postId &&
              reaction.userId === completedReaction.userId &&
              reaction.timestamp.getTime() ===
                completedReaction.timestamp.getTime()
            )
        )
      );
    },
    []
  );

  const activeTypers = typingIndicators.filter(
    (indicator) => indicator.isTyping
  );

  if (activeTypers.length === 0 && displayedReactions.length === 0) {
    return null;
  }

  return (
    <View
      style={{
        position: "absolute",
        bottom: 48,
        left: 16,
        right: 16,
        zIndex: 1000,
      }}
    >
      <TypingIndicatorComponent typingIndicators={typingIndicators} />

      {displayedReactions.map((reaction, index) => (
        <AnimatedReaction
          key={`${reaction.postId}-${
            reaction.userId
          }-${reaction.timestamp.getTime()}-${index}`}
          reaction={reaction}
          onAnimationComplete={handleReactionAnimationComplete}
        />
      ))}
    </View>
  );
}
