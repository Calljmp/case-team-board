import { Post } from "@/common/types";
import Avatar from "@/components/avatar";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface PostCardProps {
  post: Post;
  onReaction: (postId: number, type: "heart" | "thumbsUp") => void;
  onDelete?: (postId: number) => void;
}

export default function PostCard({
  post,
  onReaction,
  onDelete,
}: PostCardProps) {
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <View
      style={{
        backgroundColor: "#ffffff",
        borderRadius: 16,
        marginBottom: 12,
        marginHorizontal: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: "#f3f4f6",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          padding: 20,
          paddingBottom: 16,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
            paddingRight: 12,
          }}
        >
          <View style={{ marginRight: 12 }}>
            <Avatar user={post.author} size={44} />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#1f2937",
                marginBottom: 2,
              }}
            >
              {post.author.name}
            </Text>
            <Text style={{ fontSize: 13, color: "#6b7280" }}>
              {formatTimeAgo(post.createdAt)}
            </Text>
          </View>
        </View>
        {onDelete && (
          <TouchableOpacity
            style={{
              paddingHorizontal: 10,
              paddingVertical: 6,
              backgroundColor: "#fef2f2",
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#fecaca",
              flexShrink: 0,
            }}
            onPress={() => onDelete(post.id)}
          >
            <Text style={{ color: "#dc2626", fontSize: 11, fontWeight: "500" }}>
              Delete
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: "#1f2937",
            marginBottom: 8,
            lineHeight: 26,
          }}
        >
          {post.title}
        </Text>
        <Text
          style={{
            fontSize: 15,
            color: "#4b5563",
            lineHeight: 24,
            marginBottom: 16,
          }}
        >
          {post.content}
        </Text>

        <View
          style={{
            flexDirection: "row",
            gap: 12,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: post.reactions.heart.reacted
                ? "#0b77e6"
                : "#f9fafb",
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 20,
              minWidth: 60,
              borderWidth: 1,
              borderColor: post.reactions.heart.reacted ? "#0b77e6" : "#f3f4f6",
            }}
            onPress={() => onReaction(post.id, "heart")}
          >
            <Text style={{ fontSize: 16, marginRight: 6 }}>❤️</Text>
            <Text
              style={{
                fontSize: 14,
                color: post.reactions.heart.reacted ? "#ffffff" : "#6b7280",
                fontWeight: "500",
              }}
            >
              {post.reactions.heart.total}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: post.reactions.thumbsUp.reacted
                ? "#0b77e6"
                : "#f9fafb",
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 20,
              minWidth: 60,
              borderWidth: 1,
              borderColor: post.reactions.thumbsUp.reacted
                ? "#0b77e6"
                : "#f3f4f6",
            }}
            onPress={() => onReaction(post.id, "thumbsUp")}
          >
            <Text style={{ fontSize: 16, marginRight: 6 }}>👍</Text>
            <Text
              style={{
                fontSize: 14,
                color: post.reactions.thumbsUp.reacted ? "#ffffff" : "#6b7280",
                fontWeight: "500",
              }}
            >
              {post.reactions.thumbsUp.total}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
