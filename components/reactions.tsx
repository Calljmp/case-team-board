import { Reaction } from "@/common/types";
import React, { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";

interface ReactionsProps {
  recentReactions: Reaction[];
}

export default function Reactions({ recentReactions }: ReactionsProps) {
  const [displayedReactions, setDisplayedReactions] = useState<Reaction[]>([]);

  useEffect(() => {
    if (recentReactions.length > displayedReactions.length) {
      const newReactions = recentReactions.slice(displayedReactions.length);
      setDisplayedReactions((prev) => [...prev, ...newReactions]);

      newReactions.forEach((reaction) => {
        setTimeout(() => {
          handleReactionComplete(reaction);
        }, 3000);
      });
    }
  }, [recentReactions, displayedReactions.length]);

  const handleReactionComplete = useCallback((completedReaction: Reaction) => {
    setDisplayedReactions((prev) =>
      prev.filter(
        (reaction) =>
          !(
            reaction.postId === completedReaction.postId &&
            reaction.userId === completedReaction.userId &&
            reaction.createdAt.getTime() ===
              completedReaction.createdAt.getTime()
          )
      )
    );
  }, []);

  const formatReactionText = (reaction: Reaction) => {
    const emoji = reaction.type === "heart" ? "❤️" : "👍";
    return `${emoji}`;
  };

  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        bottom: 48,
        left: 16,
        right: 16,
      }}
    >
      {displayedReactions.map((reaction) => (
        <View
          key={`${reaction.postId}-${
            reaction.userId
          }-${reaction.createdAt.getTime()}`}
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
        </View>
      ))}
    </View>
  );
}
