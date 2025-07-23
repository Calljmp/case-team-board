import calljmp from "@/common/calljmp";
import { Post } from "@/common/types";
import Avatar, { AvatarProps } from "@/components/avatar";
import PostCard, { PostCardProps } from "@/components/post-card";
import { useAccount } from "@/providers/account";
import { usePresence } from "@/providers/presence";
import { DatabaseSubscription } from "@calljmp/react-native";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BoardScreen() {
  const router = useRouter();
  const { user } = useAccount();
  const { usersOnline } = usePresence();
  const insets = useSafeAreaInsets();
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const fetchPostInfo = useCallback(
    async (postId: number) => {
      const { data, error } = await calljmp.database.query({
        sql: `
        SELECT
          users.id AS author_id,
          users.name AS author_name,
          users.avatar AS author_avatar,
          users.tags AS author_tags,
          users.created_at AS author_created_at,
          COALESCE(SUM(CASE WHEN reactions.type = 'heart' THEN 1 ELSE 0 END), 0) AS heart_reactions,
          COALESCE(SUM(CASE WHEN reactions.type = 'thumbsUp' THEN 1 ELSE 0 END), 0) AS thumbs_up_reactions,
          COALESCE(SUM(CASE WHEN reactions.type = 'heart' AND reactions.user_id = ? THEN 1 ELSE 0 END), 0) AS user_reacted_heart,
          COALESCE(SUM(CASE WHEN reactions.type = 'thumbsUp' AND reactions.user_id = ? THEN 1 ELSE 0 END), 0) AS user_reacted_thumbs_up
        FROM posts
        JOIN users ON posts.author = users.id
        LEFT JOIN reactions ON posts.id = reactions.post_id
        WHERE posts.id = ?`,
        params: [user?.id || 0, user?.id || 0, postId],
      });
      if (error) {
        console.error("Error fetching post author:", error);
        return null;
      }
      const info = data.rows[0] as {
        author_id: number;
        author_name: string;
        author_avatar: string | null;
        author_tags: string | null;
        author_created_at: string;
        heart_reactions: number;
        thumbs_up_reactions: number;
        user_reacted_heart: number;
        user_reacted_thumbs_up: number;
      };
      return {
        author: {
          id: info.author_id,
          name: info.author_name,
          email: null,
          tags: info.author_tags ? JSON.parse(info.author_tags) : null,
          avatar: info.author_avatar,
          createdAt: new Date(info.author_created_at),
        },
        reactions: {
          heart: {
            total: info.heart_reactions,
            reacted: info.user_reacted_heart > 0,
          },
          thumbsUp: {
            total: info.thumbs_up_reactions,
            reacted: info.user_reacted_thumbs_up > 0,
          },
        },
      };
    },
    [user?.id]
  );

  useEffect(() => {
    let reactions: DatabaseSubscription | null = null;
    let posts: DatabaseSubscription | null = null;

    const subscribe = async () => {
      posts = await calljmp.database
        .observe<{
          id: number;
          author: number;
          title: string;
          content: string;
          created_at: string;
        }>("posts")
        .on("insert", async (event) => {
          const newPosts: Post[] = [];
          for (const row of event.rows) {
            const info = await fetchPostInfo(row.id);
            if (!info) continue;
            newPosts.push({
              id: row.id,
              title: row.title,
              content: row.content,
              createdAt: new Date(row.created_at),
              author: info.author,
              reactions: info.reactions,
            });
          }
          setPosts((prevPosts) => [...newPosts, ...prevPosts]);
        })
        .on("delete", (event) => {
          setPosts((prevPosts) =>
            prevPosts.filter(
              (post) => !event.rows.some((row) => row.id === post.id)
            )
          );
        })
        .subscribe();

      reactions = await calljmp.database
        .observe<{
          post_id: number;
          type: "heart" | "thumbsUp";
          user_id: number;
          created_at: string;
        }>("reactions")
        .on("insert", (event) => {
          setPosts((prevPosts) =>
            prevPosts.map((post) => {
              for (const row of event.rows) {
                if (row.user_id === user?.id) continue;
                if (post.id === row.post_id) {
                  return {
                    ...post,
                    reactions: {
                      ...post.reactions,
                      [row.type]: {
                        total: (post.reactions[row.type].total || 0) + 1,
                        reacted: post.reactions[row.type].reacted,
                      },
                    },
                  };
                }
              }
              return post;
            })
          );
        })
        .on("delete", (event) => {
          setPosts((prevPosts) =>
            prevPosts.map((post) => {
              for (const row of event.rows) {
                if (row.user_id === user?.id) continue;
                if (post.id === row.post_id) {
                  return {
                    ...post,
                    reactions: {
                      ...post.reactions,
                      [row.type]: {
                        total: Math.max(
                          (post.reactions[row.type].total || 0) - 1,
                          0
                        ),
                        reacted: post.reactions[row.type].reacted,
                      },
                    },
                  };
                }
              }
              return post;
            })
          );
        })
        .subscribe();
    };

    subscribe();

    return () => {
      reactions?.unsubscribe();
      posts?.unsubscribe();
    };
  }, [fetchPostInfo, user?.id]);

  const fetchPosts = useCallback(
    async (pageOffset = 0, reset = false) => {
      if (loading || (!hasMore && !reset)) return;

      setLoading(true);
      try {
        const pageSize = 20;
        const { data, error } = await calljmp.database.query({
          sql: `
            SELECT
              posts.id,
              posts.title,
              posts.content,
              posts.created_at,
              users.id AS author_id,
              users.name AS author_name,
              users.avatar AS author_avatar,
              users.tags AS author_tags,
              users.created_at AS author_created_at,
              COALESCE(SUM(CASE WHEN reactions.type = 'heart' THEN 1 ELSE 0 END), 0) AS heart_reactions,
              COALESCE(SUM(CASE WHEN reactions.type = 'thumbsUp' THEN 1 ELSE 0 END), 0) AS thumbs_up_reactions,
              COALESCE(SUM(CASE WHEN reactions.type = 'heart' AND reactions.user_id = ? THEN 1 ELSE 0 END), 0) AS user_reacted_heart,
              COALESCE(SUM(CASE WHEN reactions.type = 'thumbsUp' AND reactions.user_id = ? THEN 1 ELSE 0 END), 0) AS user_reacted_thumbs_up
            FROM posts
            JOIN users ON posts.author = users.id
            LEFT JOIN reactions ON posts.id = reactions.post_id
            GROUP BY posts.id
            ORDER BY posts.created_at DESC
            LIMIT ? OFFSET ?`,
          params: [user?.id || 0, user?.id || 0, pageSize, pageOffset],
        });

        if (error) {
          console.error("Error fetching posts:", error);
          return;
        }

        const newPosts: Post[] = data.rows.map((row: any) => ({
          id: row.id,
          title: row.title,
          content: row.content,
          author: {
            id: row.author_id,
            name: row.author_name,
            email: null,
            tags: row.author_tags ? JSON.parse(row.author_tags) : null,
            avatar: row.author_avatar,
            createdAt: new Date(row.author_created_at),
          },
          createdAt: new Date(row.created_at),
          reactions: {
            heart: {
              total: row.heart_reactions,
              reacted: row.user_reacted_heart > 0,
            },
            thumbsUp: {
              total: row.thumbs_up_reactions,
              reacted: row.user_reacted_thumbs_up > 0,
            },
          },
        }));

        if (reset) {
          setPosts(newPosts);
          setOffset(pageSize);
        } else {
          setPosts((prev) => [...prev, ...newPosts]);
          setOffset((prev) => prev + pageSize);
        }

        // Check if we have more posts
        setHasMore(newPosts.length === pageSize);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    },
    [loading, hasMore, user?.id]
  );

  const loadMorePosts = useCallback(() => {
    if (!loading && hasMore) {
      fetchPosts(offset);
    }
  }, [offset, loading, hasMore, fetchPosts]);

  const handleReaction = async (postId: number, type: "heart" | "thumbsUp") => {
    if (!user?.id) {
      Alert.alert("Error", "You must be logged in to react to a post");
      return;
    }

    const reacted = posts.find((post) => post.id === postId)?.reactions[type]
      ?.reacted;

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            reactions: {
              ...post.reactions,
              [type]: {
                total: Math.max(
                  (post.reactions[type].total || 0) + (reacted ? -1 : 1),
                  0
                ),
                reacted: !reacted,
              },
            },
          };
        }
        return post;
      })
    );

    if (reacted) {
      await calljmp.database.query({
        sql: "DELETE FROM reactions WHERE post_id = ? AND type = ?",
        params: [postId, type],
      });
    } else {
      await calljmp.database.query({
        sql: "INSERT INTO reactions (post_id, user_id, type) VALUES (?, ?, ?)",
        params: [postId, user.id, type],
      });
    }
  };

  const handleDeletePost = async (postId: number) => {
    await calljmp.database.query({
      sql: "DELETE FROM posts WHERE id = ?",
      params: [postId],
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchPosts(0, true);
    } finally {
      setRefreshing(false);
    }
  };

  const handleNewPost = () => {
    router.push("/create-post");
  };

  const handleProfile = () => {
    router.push("/profile");
  };

  const renderPost = ({ item }: { item: Post }) => (
    <AnimatedPostCard
      post={item}
      onReaction={handleReaction}
      onDelete={item.author.id === user?.id ? handleDeletePost : undefined}
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
      <View>
        <Text style={{ fontSize: 22, fontWeight: "600", color: "#1f2937" }}>
          Team Board
        </Text>
        {user && (
          <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
            Welcome, {user.name || user.email}
          </Text>
        )}
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
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
        <TouchableOpacity
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2,
          }}
          onPress={handleProfile}
        >
          <Avatar user={user} size={36} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View
      style={{
        alignItems: "center",
        paddingVertical: 60,
        paddingHorizontal: 32,
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
        keyExtractor={(item) => item.id.toString()}
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
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? (
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text style={{ color: "#6b7280", fontSize: 14 }}>
                Loading posts...
              </Text>
            </View>
          ) : null
        }
      />

      <View
        style={{
          flexDirection: "row",
          position: "absolute",
          bottom: insets.bottom + 16,
          left: 16,
          right: 16,
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        {[user, ...usersOnline]
          .filter((user) => !!user)
          .map((user, index) => (
            <View
              key={user.id}
              style={{
                marginLeft: index > 0 ? -16 : 0,
              }}
            >
              <AnimatedAvatar user={user} size={42} />
            </View>
          ))}
      </View>
    </View>
  );
}

function AnimatedAvatar(props: AvatarProps) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.3,
        duration: 350,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Avatar {...props} />
    </Animated.View>
  );
}

function AnimatedPostCard(props: PostCardProps) {
  const translateX = useRef(new Animated.Value(50)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ translateX }], opacity }}>
      <PostCard {...props} />
    </Animated.View>
  );
}
