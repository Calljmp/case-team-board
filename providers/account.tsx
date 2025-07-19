import calljmp from "@/common/calljmp";
import { User } from "@calljmp/react-native";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface AccountProviderType {
  user: User | null;
  loading: boolean;

  setUser: (user: User | null) => void;
}

const AccountContext = createContext<Partial<AccountProviderType>>({});

export function AccountProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    verifyAuthentication();
  }, []);

  const verifyAuthentication = async () => {
    setLoading(true);
    try {
      const authenticated = await calljmp.users.auth.authenticated();
      if (authenticated) {
        const { data: user } = await calljmp.users.retrieve();
        setUser(user || null);
      }
    } catch (error) {
      console.error("Error verifying authentication:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(() => {
    return { user, setUser, loading };
  }, [user, loading]);

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context as AccountProviderType;
}
