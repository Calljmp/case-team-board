import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="board" options={{ headerShown: false }} />
      <Stack.Screen name="create-post" options={{ headerShown: false }} />
    </Stack>
  );
}
