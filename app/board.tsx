import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PostCard from "../components/post-card";
import RealtimeIndicator from "../components/realtime-indicator";
import {
  mockPosts,
  mockTypingIndicators,
  Post,
  ReactionEvent,
  TypingIndicator,
} from "../data/mockData";

/**
 * Main team board screen showing posts, reactions, and real-time interactions
 * Demonstrates Expo Router navigation and Calljmp real-time features
 */
export default function BoardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [typingIndicators, setTypingIndicators] = useState<TypingIndicator[]>(
    []
  );
  const [recentReactions, setRecentReactions] = useState<ReactionEvent[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const shouldShowTyping = Math.random() > 0.7;
      if (shouldShowTyping) {
        setTypingIndicators(mockTypingIndicators);
        setTimeout(() => {
          setTypingIndicators([]);
        }, 3000);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleReaction = (postId: string, reaction: "heart" | "thumbsUp") => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              reactions: {
                ...post.reactions,
                [reaction]: post.reactions[reaction] + 1,
              },
            }
          : post
      )
    );

    const reactionEvent: ReactionEvent = {
      postId,
      userId: "current-user",
      userName: "You",
      reaction,
      timestamp: new Date(),
    };

    setRecentReactions((prev) => [...prev, reactionEvent]);

    setTimeout(() => {
      setRecentReactions((prev) => prev.filter((r) => r !== reactionEvent));
    }, 3000);
  };

  const handleDeletePost = (postId: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleNewPost = () => {
    router.push("/create-post");
  };

  const renderPost = ({ item }: { item: Post }) => (
    <PostCard
      post={item}
      onReaction={handleReaction}
      onDelete={handleDeletePost}
      isAdmin={true}
    />
  );

  const renderHeader = () => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: insets.top + 16,
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: "#ffffff",
        borderBottomWidth: 1,
        borderBottomColor: "#f3f4f6",
      }}
    >
      <Text style={{ fontSize: 22, fontWeight: "600", color: "#1f2937" }}>
        Team Board
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: "#28e2ad",
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderRadius: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 2,
        }}
        onPress={handleNewPost}
      >
        <Text style={{ color: "#ffffff", fontSize: 14, fontWeight: "500" }}>
          + New Post
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => (
    <View
      style={{
        alignItems: "center",
        paddingVertical: 60,
        paddingHorizontal: 32,
        backgroundColor: "#ffffff",
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: "600",
          color: "#1f2937",
          marginBottom: 8,
        }}
      >
        No posts yet
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: "#6b7280",
          textAlign: "center",
          lineHeight: 24,
          marginBottom: 24,
        }}
      >
        Be the first to share something with your team!
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: "#0b77e6",
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 12,
        }}
        onPress={handleNewPost}
      >
        <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "500" }}>
          Create First Post
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      {renderHeader()}

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmpty}
        style={{ flex: 1, backgroundColor: "#f9fafb" }}
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: insets.bottom + 100,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />

      <RealtimeIndicator
        typingIndicators={typingIndicators}
        recentReactions={recentReactions}
      />
    </View>
  );
}
