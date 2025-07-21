import calljmp from "@/common/calljmp";
import { useAccount } from "@/providers/account";
import { RealtimeSubscription, User } from "@calljmp/react-native";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AppState } from "react-native";

export interface PresenceProviderType {
  usersOnline: User[];
}

const PresenceContext = createContext<Partial<PresenceProviderType>>({});

const PresenceTopic = "users.presence";

interface PresenceData {
  user: User;
  online: boolean;
}

export function PresenceProvider({ children }: { children: React.ReactNode }) {
  const [usersOnline, setUsersOnline] = useState<User[]>([]);
  const { user } = useAccount();

  const publishPresence = async (online: boolean) => {
    if (!user) {
      return;
    }
    try {
      await calljmp.realtime.publish<PresenceData>({
        topic: PresenceTopic,
        data: { user, online },
      });
    } catch (error) {
      console.error("Failed to publish presence data:", error);
    }
  };

  useEffect(() => {
    if (!user) return;
    publishPresence(true);
    return () => {
      publishPresence(false);
    };
  }, [user]);

  useEffect(() => {
    let presenceSubscription: RealtimeSubscription | null = null;

    const subscribe = async () => {
      presenceSubscription = await calljmp.realtime
        .observe<PresenceData>(PresenceTopic)
        .on("data", (_topic, data) => {
          if (data.online) {
            setUsersOnline((prev) =>
              prev.some((u) => u.id === data.user.id)
                ? prev
                : [...prev, data.user]
            );
          } else {
            setUsersOnline((prev) =>
              prev.filter((user) => user.id !== data.user.id)
            );
          }
        })
        .subscribe()
        .catch((error) => {
          console.error("Failed to subscribe to presence topic:", error);
          return null;
        });
    };

    const stateSubscription = AppState.addEventListener(
      "change",
      (nextAppState) => {
        if (nextAppState === "active") {
          publishPresence(true);
        } else if (nextAppState === "background") {
          publishPresence(false);
        }
      }
    );

    subscribe();
    return () => {
      presenceSubscription?.unsubscribe();
      stateSubscription.remove();
    };
  }, []);

  const value = useMemo(() => ({ usersOnline }), [usersOnline]);

  return (
    <PresenceContext.Provider value={value}>
      {children}
    </PresenceContext.Provider>
  );
}

export function usePresence() {
  const context = useContext(PresenceContext);
  if (!context) {
    throw new Error("usePresence must be used within a PresenceProvider");
  }
  return context as PresenceProviderType;
}
