import { AccountProvider } from "@/providers/account";
import { Slot } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <AccountProvider>
      <Slot />
    </AccountProvider>
  );
}
