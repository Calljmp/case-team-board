import { AccountProvider } from "@/providers/account";
import { PresenceProvider } from "@/providers/presence";
import { Slot } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <AccountProvider>
      <PresenceProvider>
        <Slot />
      </PresenceProvider>
    </AccountProvider>
  );
}
