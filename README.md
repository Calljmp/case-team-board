# Teamboard - Calljmp App

> A real-time collaborative team board showcasing Calljmp's authentication, database, and real-time capabilities

[![Calljmp](https://img.shields.io/badge/Built%20with-Calljmp-blue?style=flat-square)](https://calljmp.com)
[![React Native](https://img.shields.io/badge/React%20Native-0.79.5-blue?style=flat-square)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-SDK%2052-black?style=flat-square)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?style=flat-square)](https://typescriptlang.org)

## Overview

Teamboard is a case study application that demonstrates the core capabilities of the Calljmp platform through a real-time team collaboration board. Users can create posts, react to content, and see live updates from other team members - all powered by Calljmp's real-time infrastructure.

This demo showcases:

- **Real-time collaboration** with live post updates and reactions
- **User authentication** with email/password and user management
- **Raw SQL queries** for complex data operations and analytics
- **Real-time subscriptions** for instant UI updates
- **Cross-platform mobile app** built with React Native and Expo

## Features

### 🔐 Authentication & User Management

- Email/password authentication with Calljmp Users
- User registration and login flows
- Profile management with editable user information
- Session management and secure logout

### 📝 Real-time Post Creation

- Create and publish posts to the team board
- Rich text content with title and body
- Real-time post publishing with instant visibility
- User attribution and timestamps

### ⚡ Live Reactions & Engagement

- Heart and thumbs-up reactions on posts
- Real-time reaction updates across all connected clients
- Visual reaction indicators and counters
- Optimistic UI updates for smooth UX

### 👥 Collaborative Features

- Live typing indicators when users are active
- Real-time user presence awareness
- Multi-user collaboration with conflict-free updates
- Cross-device synchronization

### 📱 Modern Mobile Experience

- Native iOS and Android app with Expo
- Clean, intuitive user interface
- Responsive design with safe area handling
- Pull-to-refresh and infinite scroll

## Tech Stack

- **Frontend**: React Native 0.79.5 with Expo SDK 52
- **Language**: TypeScript for type safety
- **Backend**: Calljmp platform for real-time infrastructure
- **Database**: Calljmp Database with raw SQL queries
- **Authentication**: Calljmp Users with email/password
- **Real-time**: Calljmp real-time subscriptions and presence
- **Icons**: Lucide React Native for consistent iconography

## Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- [Expo CLI](https://docs.expo.dev/get-started/installation/) installed globally
- iOS Simulator (Mac) or Android Emulator
- [Calljmp account](https://calljmp.com) and project setup

### Installation

1. **Clone and install dependencies**

   ```bash
   cd demos/teamboard
   npm install
   ```

2. **Start the development server**

   ```bash
   npx expo start
   ```

3. **Run on device/simulator**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app for physical device

## App Architecture

```
app/
├── (app)/                 # Authenticated routes
│   ├── index.tsx          # Main board with posts feed
│   ├── create-post.tsx    # Post creation form
│   ├── profile.tsx        # User profile management
│   └── _layout.tsx        # Auth-protected layout
├── login.tsx              # Authentication screen
└── _layout.tsx            # Root layout

components/
├── post-card.tsx          # Individual post display
├── realtime-indicator.tsx # Live activity indicators
└── ...

providers/
└── account.tsx            # User state management

common/
├── calljmp.ts            # Calljmp SDK configuration
└── types.ts              # TypeScript type definitions
```

## What This Demo Shows

This teamboard app demonstrates several key Calljmp capabilities:

1. **Real-time Data Sync**: Posts and reactions update instantly across all connected clients
2. **Complex SQL Operations**: Join queries for posts with author info and aggregated reactions
3. **User Management**: Complete authentication flow with profile management
4. **Scalable Architecture**: Clean separation of concerns with providers and components
5. **Mobile-First Design**: Native mobile experience with proper UX patterns

## Support

- 📧 Email: [info@calljmp.com](mailto:info@calljmp.com)
- 💬 Discord: [Calljmp Community](https://discord.gg/DHsrADPUC6)
- 📖 Docs: [docs.calljmp.com](https://docs.calljmp.com)
- 🐛 Issues: [GitHub Issues](https://github.com/calljmp/case-team-board/issues)

---

Built with ❤️ using [Calljmp](https://calljmp.com) - The real-time application platform
