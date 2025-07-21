import { User } from "@calljmp/react-native";

export interface Post {
  id: number;
  title: string;
  content: string;
  author: User;
  createdAt: Date;
  reactions: {
    heart: {
      total: number;
      reacted: boolean;
    };
    thumbsUp: {
      total: number;
      reacted: boolean;
    };
  };
}

export interface Reaction {
  type: 'heart' | 'thumbsUp';
  postId: number;
  userId: number;
  createdAt: Date;
}
