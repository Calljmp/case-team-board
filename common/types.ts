import { User } from "@calljmp/react-native";

export interface Post {
  id: number;
  title: string;
  content: string;
  author: User;
  createdAt: Date;
  reactions: {
    heart: number;
    thumbsUp: number;
  };
}

export interface TypingIndicator {
  userId: string;
  userName: string;
  isTyping: boolean;
}

export interface Reaction {
  type: 'heart' | 'thumbsUp';
  postId: number;
  userId: number;
  createdAt: Date;
}
