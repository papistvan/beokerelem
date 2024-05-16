import React, { useContext, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Button, Text } from "react-native";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./components/LoginComponents/LoginScreen.js";
import RegisterScreen from "./components/LoginComponents/RegisterScreen.js";
import WorkDayList from "./components/WorkDayComponents/WorkDayList.js";
import {
  AuthProvider,
  AuthContext,
} from "./components/AuthContext/AuthContext.js";
import Toast from "react-native-toast-message";
import LogoutButton from "./components/LoginComponents/LogoutButton.js";

const Stack = createStackNavigator();

function AppStack({ navigationRef }) {
  const { user, isBoss, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen
            name="WorkDayList"
            options={{
              headerRight: () => (
                <View style={{ flexDirection: "row" }}>
                  {isBoss && (
                    <Button
                      onPress={() =>
                        navigationRef.current?.navigate("Register")
                      }
                      title="Új fiók regisztrálása"
                      color="#000"
                    />
                  )}
                  <LogoutButton />
                </View>
              ),
              headerTitle: "Munkanapok",
            }}
          >
            {(props) => (
              <WorkDayList {...props} navigationRef={navigationRef} />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{
              headerRight: () => (
                <View style={{ flexDirection: "row" }}>
                  <Button
                    onPress={() =>
                      navigationRef.current?.navigate("WorkDayList")
                    }
                    title="Munkanapok listája"
                    color="#000"
                  />
                  <LogoutButton />
                </View>
              ),
              headerTitle: "Új fiók regisztrálása",
              title: "Új fiók regisztrálása",
            }}
          />
        </>
      ) : (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: false,
          }}
        />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  const navigationRef = useNavigationContainerRef();
  const [navigationReady, setNavigationReady] = useState(false);

  return (
    <AuthProvider>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          setNavigationReady(true);
        }}
      >
        <AppStack navigationRef={navigationRef} />
        <StatusBar style="auto" />
        <Toast />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
