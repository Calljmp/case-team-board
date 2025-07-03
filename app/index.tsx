import { Calljmp, UserAuthenticationPolicy } from "@calljmp/react-native";
import { Button, View } from "react-native";

const calljmp = new Calljmp();

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button
        title="Authenticate"
        onPress={async () => {
          const result = await calljmp.users.auth.email.authenticate({
            email: "joe@calljmp.com",
            password: "Password#1256$",
            tags: ["role:user"],
            policy: UserAuthenticationPolicy.SignInOrCreate,
            doNotNotify: true,
          });
          console.log("Authentication:", result);
        }}
      />

      <Button
        title="Call service"
        onPress={async () => {
          const result = await calljmp.service.request("/").get().buffer();
          console.log("Service Call Result:", result.toString("utf8"));
        }}
      />
    </View>
  );
}
