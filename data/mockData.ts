/**
 * Mock data types and sample data for TeamBoard demo
 * Simulates real-time collaboration features without backend
 */

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
  createdAt: Date;
  imageUrl?: string;
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

export interface ReactionEvent {
  postId: string;
  userId: string;
  userName: string;
  reaction: 'heart' | 'thumbsUp';
  timestamp: Date;
}

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@company.com',
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah@company.com',
  },
  {
    id: '3',
    name: 'Mike Rodriguez',
    email: 'mike@company.com',
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@company.com',
  },
];

export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Team Meeting Tomorrow',
    content: 'Don\'t forget we have our weekly team meeting tomorrow at 10 AM. We\'ll be discussing the Q4 roadmap and sprint planning.',
    author: mockUsers[0],
    createdAt: new Date('2024-01-15T09:30:00'),
    reactions: {
      heart: 3,
      thumbsUp: 5,
    },
  },
  {
    id: '2',
    title: 'New Design System Released',
    content: '🎉 Our new design system is now live! Check out the updated components and guidelines. This should make our development process much smoother.',
    author: mockUsers[1],
    createdAt: new Date('2024-01-14T14:20:00'),
    reactions: {
      heart: 8,
      thumbsUp: 12,
    },
  },
  {
    id: '3',
    title: 'Coffee Break Ideas',
    content: 'What does everyone think about trying that new coffee place down the street for our afternoon break? I heard they have great pastries too!',
    author: mockUsers[2],
    createdAt: new Date('2024-01-14T11:45:00'),
    reactions: {
      heart: 2,
      thumbsUp: 7,
    },
  },
  {
    id: '4',
    title: 'Code Review Best Practices',
    content: 'I\'ve compiled a list of code review best practices based on our recent discussions. Let\'s aim to implement these starting next week to improve our code quality.',
    author: mockUsers[3],
    createdAt: new Date('2024-01-13T16:10:00'),
    reactions: {
      heart: 6,
      thumbsUp: 9,
    },
  },
  {
    id: '5',
    title: 'Weekend Hackathon Results',
    content: 'Great job everyone who participated in the weekend hackathon! The projects were amazing. Looking forward to seeing some of these ideas in production.',
    author: mockUsers[0],
    createdAt: new Date('2024-01-12T08:15:00'),
    reactions: {
      heart: 15,
      thumbsUp: 20,
    },
  },
];

export const mockTypingIndicators: TypingIndicator[] = [
  {
    userId: '2',
    userName: 'Sarah Chen',
    isTyping: true,
  },
];

export const mockReactionEvents: ReactionEvent[] = [
  {
    postId: '1',
    userId: '3',
    userName: 'Mike Rodriguez',
    reaction: 'heart',
    timestamp: new Date(),
  },
];